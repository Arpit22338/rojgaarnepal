import { cn } from "@/lib/utils";

export const BackgroundWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
   <div className={cn("min-h-screen w-full relative bg-white", className)}>
      {/* Soft Blue Glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #2563eb 0%, transparent 70%)
          `,
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
         {children}
      </div>
    </div>
  );
};
