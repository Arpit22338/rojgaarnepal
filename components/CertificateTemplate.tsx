"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Award } from "lucide-react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateId?: string; // Optional, kept for backward compatibility
}

export default function CertificateTemplate({
  studentName,
  courseName,
  completionDate,
  instructorName,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [signBase64, setSignBase64] = useState<string>("");

  useEffect(() => {
    // Convert logo to base64 to avoid CORS issues in html2canvas
    const getBase64FromUrl = async (url: string) => {
      try {
        const data = await fetch(url);
        if (!data.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      } catch (e) {
        console.error("Error loading image:", url, e);
        return "";
      }
    };

    getBase64FromUrl('/logo.png').then((base64) => {
      setLogoBase64(base64 as string);
    });

    getBase64FromUrl('/uploads/ceo-sign.png').then((base64) => {
      setSignBase64(base64 as string);
    });
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      setIsGenerating(true);
      // Longer delay to ensure all images and styles are fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Higher quality for better output
        logging: false,
        backgroundColor: '#ffffff',
        useCORS: true, // Enable CORS for external images
        allowTaint: true, // Allow cross-origin images
        windowWidth: 800,
        windowHeight: 600,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0); // Max quality
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Certificate-${studentName}-${courseName}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert(`Failed to generate certificate: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="min-w-[800px] w-[800px] min-h-[600px] h-[600px] p-8 relative text-center flex flex-col items-center justify-center shadow-2xl"
        style={{ 
          fontFamily: 'serif',
          backgroundColor: '#ffffff',
          border: '20px double #1e3a8a',
          color: '#111827'
        }}
      >
        {/* Watermark/Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          {logoBase64 && <Image src={logoBase64} alt="Watermark" width={500} height={500} className="w-[500px] h-[500px] object-contain" unoptimized />}
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Logo at top */}
          <div className="mb-1">
             {logoBase64 && <Image src={logoBase64} alt="Rojgaar Logo" width={200} height={64} className="h-12 w-auto object-contain" unoptimized />}
          </div>
          
          <div className="mb-1 font-bold tracking-widest uppercase text-xs" style={{ color: '#1e3a8a' }}>RojgaarNepal Skills Academy</div>
          <h1 className="text-3xl font-bold mb-3 font-serif" style={{ color: '#1e3a8a' }}>Certificate of Completion</h1>
          
          <p className="text-base mb-3 italic" style={{ color: '#4b5563' }}>This is to certify that</p>
          
          <div className="text-2xl font-bold mb-2 border-b-2 inline-block px-10 py-1 min-w-[300px]" style={{ color: '#111827', borderColor: '#d1d5db' }}>
            {studentName}
          </div>
          
          <p className="text-base mt-3 mb-3 italic" style={{ color: '#4b5563' }}>
            has successfully completed the comprehensive course on
          </p>
          
          <h2 className="text-xl font-bold mb-6" style={{ color: '#1e40af' }}>{courseName}</h2>
          
          <div className="flex justify-between items-end w-full px-8 mt-4">
            <div className="text-center flex flex-col items-center">
              <div className="text-base font-bold border-b px-4 pb-1 mb-1 min-w-[120px]" style={{ color: '#1f2937', borderColor: '#9ca3af' }}>
                {new Date(completionDate).toLocaleDateString()}
              </div>
              <div className="text-xs" style={{ color: '#6b7280' }}>Date</div>
            </div>

            <div className="flex flex-col items-center">
               {/* Seal */}
               <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 mb-2" style={{ backgroundColor: '#eab308', borderColor: '#ca8a04' }}>
                  <Award size={32} />
               </div>
            </div>
            
            <div className="text-center flex flex-col items-center relative">
              {/* Signature positioned absolutely to overlap the line */}
              <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2 z-10">
                {signBase64 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={signBase64} 
                    alt="Signature" 
                    style={{ 
                      height: '150px', 
                      width: 'auto', 
                      maxWidth: 'none' 
                    }} 
                  />
                ) : (
                   <div className="text-9xl font-script font-cursive" style={{ fontFamily: 'cursive', color: '#1e3a8a' }}>Arpit</div>
                 )}
              </div>
              
              {/* Name Line */}
              <div className="text-base font-bold border-t pt-2 px-8 min-w-[200px] mt-8 relative z-0" style={{ color: '#1f2937', borderColor: '#9ca3af' }}>
                {instructorName}
              </div>
              <div className="text-xs mt-1" style={{ color: '#6b7280' }}>CEO, RojgaarNepal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button - Bottom Center */}
      <div className="flex justify-center w-full max-w-4xl">
        <Button onClick={handleDownload} disabled={isGenerating} className="px-8 py-3">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
