import React from "react";
export interface CertificateLayoutProps {
  studentName: string;
  courseTitle: string;
  completionDate?: string;
  instructorName?: string;
  logoSrc?: string; // base64 or url
  signSrc?: string; // base64 or url
}

// Forward ref to the certificate root so html2canvas can target it
const CertificateLayout = React.forwardRef<HTMLDivElement, CertificateLayoutProps>(
  (
    {
      studentName,
      courseTitle,
      completionDate,
      instructorName = "Arpit Kafle",
      logoSrc,
      signSrc,
    },
    ref
  ) => {
    const dateText = completionDate ? new Date(completionDate).toLocaleDateString() : new Date().toLocaleDateString();

    return (
      <div className="w-full flex items-center justify-center">
        <div
          ref={ref}
          className="relative bg-white shadow-lg"
          style={{
            width: 800,
            height: 600,
            maxWidth: "100%",
            boxSizing: "border-box",
            border: "20px double #1e3a8a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "serif",
            padding: 28,
            position: "relative",
            overflow: "hidden",
            color: "#111827",
          }}
        >
          {/* Watermark */}
          {logoSrc && (
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Watermark" style={{ width: 500, height: 500, objectFit: "contain" }} />
            </div>
          )}

          <div style={{ zIndex: 10, width: "100%", textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Top area: logo + title + name */}
            <div style={{ width: '100%' }}>
              {logoSrc && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              )}

              <div style={{ letterSpacing: 2, color: "#1e3a8a", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
                ROJGAARNEPAL SKILLS ACADEMY
              </div>

              <h1 style={{ fontSize: 28, margin: "6px 0", color: "#1e3a8a", fontWeight: 700 }}>Certificate of Completion</h1>

              <p style={{ color: "#6b7280", marginBottom: 10, fontStyle: "italic" }}>This is to certify that</p>

              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                {studentName}
              </div>

              {/* light gray horizontal line */}
              <div style={{ height: 2, background: "#e5e7eb", width: "50%", margin: "8px auto 18px" }} />

              <p style={{ color: "#6b7280", marginBottom: 10 }}>has successfully completed the comprehensive course on</p>

              <div style={{ fontSize: 18, fontWeight: 700, color: "#1e40af" }}>{courseTitle}</div>
            </div>

            {/* Footer area: date and signature aligned to bottom */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: 24, paddingRight: 24, paddingBottom: 8 }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 160 }}>
                <div style={{ fontSize: 14, fontWeight: 700, borderBottom: "2px solid #9ca3af", padding: "8px 14px", color: "#1f2937", minWidth: 120 }}>
                  {dateText}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Date</div>
              </div>

              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 220 }}>
                <div style={{ minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {signSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={signSrc} alt="Signature" style={{ height: 140, width: "auto", display: "block" }} />
                  ) : (
                    <div style={{ fontSize: 48, fontFamily: "cursive", color: "#1e3a8a" }}>Arpit</div>
                  )}
                </div>

                <div style={{ fontWeight: 700, color: "#1f2937", marginTop: 6 }}>{instructorName}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>CEO, RojgaarNepal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateLayout.displayName = "CertificateLayout";

export default CertificateLayout;
