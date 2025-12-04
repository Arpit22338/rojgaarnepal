import { BackgroundWrapper } from "@/components/ui/background-components";

export default function BackgroundDemo() {
  return (
    <BackgroundWrapper>
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-10 bg-white/50 backdrop-blur-sm rounded-xl border shadow-sm">
          <h1 className="text-4xl font-bold">Background Demo</h1>
          <p className="mt-2 text-gray-600">This is a demo of the background component.</p>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
