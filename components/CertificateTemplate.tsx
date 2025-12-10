"use client";

import { useRef, useState, useEffect } from "react";
// Image not required here; CertificateLayout handles rendering
import html2canvas from "html2canvas";
import CertificateLayout from "@/components/CertificateLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

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

      // If we applied a visual scale via CSS transform, temporarily remove it for high-quality capture
      const el = certificateRef.current as HTMLDivElement;
      const prevTransform = el.style.transform;
      const prevTransformOrigin = el.style.transformOrigin;
      if (prevTransform) {
        el.style.transform = "none";
        el.style.transformOrigin = "initial";
      }

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Higher quality for better output
        logging: false,
        backgroundColor: '#ffffff',
        useCORS: true, // Enable CORS for external images
        allowTaint: true, // Allow cross-origin images
        windowWidth: 800,
        windowHeight: 600,
      });

      // restore transform
      if (prevTransform) {
        el.style.transform = prevTransform;
        el.style.transformOrigin = prevTransformOrigin;
      }
      
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
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Certificate Container */}
      <CertificateLayout
        ref={certificateRef}
        studentName={studentName}
        courseTitle={courseName}
        completionDate={completionDate}
        instructorName={instructorName}
        logoSrc={logoBase64}
        signSrc={signBase64}
      />

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
