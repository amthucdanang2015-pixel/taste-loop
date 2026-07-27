"use client";

import DemoComponent from "@/components/anim/DemoCP";

export default function TestPage() {
  return (
    <main
      className="min-h-screen bg-[#0d0c14] flex items-center justify-center p-8"
      style={{ fontFamily: "inherit" }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
        {/* Label */}
        <div className="text-center">
          <p className="font-mono text-xs font-semibold tracking-widest uppercase text-white/30">
            /test · component preview
          </p>
          <p className="mt-1 text-xs text-white/20 font-mono">
            Paste any copied component code into{" "}
            <code className="text-white/40">components/anim/DemoCP.tsx</code> to preview it here
          </p>
        </div>

        {/* Component render area */}
        <div className="w-full flex items-center justify-center rounded-2xl border border-white/10 bg-[#12111c] min-h-[300px] p-10">
          <DemoComponent />
        </div>
      </div>
    </main>
  );
}
