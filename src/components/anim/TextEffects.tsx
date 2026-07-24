"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TextEffectTemplate {
  id: string;
  name: string;
  category: string;
  animationTextType:
  | "typewriter"
  | "fade-words"
  | "character-pop"
  | "gradient-wave"
  | "glitch"
  | "stagger-up"
  | "3d-flip"
  | "neon-glow"
  | "scramble"
  | "blur-reveal"
  | "wave"
  | "liquid-fill"
  | "chrome-shine"
  | "focus-blur"
  | "echo"
  | "spectrum"
  | "jitter"
  | "anaglyph"
  | "flap"
  | "elastic"
  | "spotlight"
  | "ember"
  | "melt"
  | "heartbeat"
  | "marker"
  | "hologram"
  | "kinetic"
  | "blackout"
  | "magnetic"
  | "pendulum"
  | "smoke"
  | "scanner";
  description: string;
  defaultText: string;
  prompt: string;
}

export const TEXT_EFFECT_TEMPLATES: TextEffectTemplate[] = [
  // ── Typing & Writing ─────────────────────────────────────────────────────
  {
    id: "typewriter",
    name: "Typewriter Caret",
    category: "Typing & Writing",
    animationTextType: "typewriter",
    description: "Looping character-by-character typing with a blinking terminal cursor.",
    defaultText: "Agentic experiences.",
    prompt: "Animate text appearing character by character in a continuous loop with a typing delay and blinking cursor.",
  },
  {
    id: "flap",
    name: "Split-Flap Board",
    category: "Typing & Writing",
    animationTextType: "flap",
    description: "Classic airport departure board flip tiles revealing each character.",
    defaultText: "HELLO",
    prompt: "Animate characters as split-flap display tiles that rotate through random glyphs before landing on the final character.",
  },
  {
    id: "scramble",
    name: "Matrix Scramble",
    category: "Typing & Writing",
    animationTextType: "scramble",
    description: "Randomized alphanumeric glyphs resolve into the final target string.",
    defaultText: "DECRYPTING INTENT",
    prompt: "Scramble characters through random ASCII glyphs before revealing the resolved target string.",
  },
  {
    id: "scanner",
    name: "Scanner Sweep",
    category: "Typing & Writing",
    animationTextType: "scanner",
    description: "A luminous scanning bar sweeps left-to-right revealing text beneath it.",
    defaultText: "SCANNING TARGET",
    prompt: "Animate a bright scanner bar sweeping across text, lighting up each character as it passes.",
  },

  // ── Hero Reveal ───────────────────────────────────────────────────────────
  {
    id: "stagger-up",
    name: "Staggered Word Rise",
    category: "Hero Reveal",
    animationTextType: "stagger-up",
    description: "Words slide up from behind a clipping baseline with spring physics.",
    defaultText: "Designed for high conversion.",
    prompt: "Split text into words and animate each word sliding up vertically with a staggered spring transition.",
  },
  {
    id: "fade-words",
    name: "Word-by-Word Fade",
    category: "Hero Reveal",
    animationTextType: "fade-words",
    description: "Words softly crossfade in sequence for readable hero headlines.",
    defaultText: "Simple decisions. Extraordinary outcomes.",
    prompt: "Animate text by fading in individual words sequentially with gentle ease-out timing in a loop.",
  },
  {
    id: "blur-reveal",
    name: "Cinematic Blur Reveal",
    category: "Hero Reveal",
    animationTextType: "blur-reveal",
    description: "Text emerges from heavy gaussian blur into sharp focus.",
    defaultText: "Focus on what matters.",
    prompt: "Reveal headline text by transitioning filter blur from 14px to 0px with opacity fade.",
  },
  {
    id: "focus-blur",
    name: "Focus Blur Cycle",
    category: "Hero Reveal",
    animationTextType: "focus-blur",
    description: "Letters oscillate between sharp and blurry focus in a staggered loop.",
    defaultText: "CLARITY IN MOTION",
    prompt: "Animate each letter cycling between in-focus and blurred-out with a staggered delay loop.",
  },
  {
    id: "blackout",
    name: "Blackout Bars",
    category: "Hero Reveal",
    animationTextType: "blackout",
    description: "Two black bars wipe in from top and bottom to hide/reveal the text.",
    defaultText: "CLASSIFIED",
    prompt: "Animate two bars sweeping in from the top and bottom of text like a censor/redaction reveal.",
  },

  // ── Gradients & Shimmer ───────────────────────────────────────────────────
  {
    id: "gradient-wave",
    name: "AURORA Gradient Wave",
    category: "Gradients & Shimmer",
    animationTextType: "gradient-wave",
    description: "A continuous animated multi-color gradient sweeps through the text fill.",
    defaultText: "Next-Generation Partner",
    prompt: "Create a continuous background-clip text gradient wave that sweeps infinitely.",
  },
  {
    id: "chrome-shine",
    name: "Chrome Shine",
    category: "Gradients & Shimmer",
    animationTextType: "chrome-shine",
    description: "A bright chrome sheen sweeps across metallic text like a spotlight.",
    defaultText: "CHROME TYPE",
    prompt: "Animate a bright white shimmer sweeping across metallic gradient text using background-position.",
  },
  {
    id: "spectrum",
    name: "Spectrum Rainbow",
    category: "Gradients & Shimmer",
    animationTextType: "spectrum",
    description: "Each character cycles through a full hue spectrum in staggered sequence.",
    defaultText: "FULL SPECTRUM",
    prompt: "Animate each character with a continuously rotating hue-rotate filter staggered across the word.",
  },
  {
    id: "spotlight",
    name: "Spotlight Sweep",
    category: "Gradients & Shimmer",
    animationTextType: "spotlight",
    description: "A radial spotlight sweeps across the text, highlighting one area at a time.",
    defaultText: "IN THE SPOTLIGHT",
    prompt: "Animate a radial gradient spotlight sweeping left-to-right across background-clip text.",
  },
  {
    id: "marker",
    name: "Marker Highlight",
    category: "Gradients & Shimmer",
    animationTextType: "marker",
    description: "A neon highlighter marker swipes across the text and retreats.",
    defaultText: "Highlight This",
    prompt: "Animate a background-size highlight swiping from 0% to 100% width under text like a marker stroke.",
  },
  {
    id: "liquid-fill",
    name: "Liquid Fill",
    category: "Gradients & Shimmer",
    animationTextType: "liquid-fill",
    description: "Text appears to fill with liquid from bottom to top in a loop.",
    defaultText: "LIQUID TYPE",
    prompt: "Animate a gradient fill rising through outline text using background-clip and background-position.",
  },

  // ── Special Effects ───────────────────────────────────────────────────────
  {
    id: "glitch",
    name: "Cyberpunk Glitch",
    category: "Special Effects",
    animationTextType: "glitch",
    description: "RGB split offset and digital micro-glitch jitter.",
    defaultText: "SYSTEM OVERRIDE",
    prompt: "Create a cyberpunk text glitch with dual RGB offset layers and random transform offsets.",
  },
  {
    id: "neon-glow",
    name: "Neon Pulse Glow",
    category: "Special Effects",
    animationTextType: "neon-glow",
    description: "Electric ambient neon breathing pulse with multi-layered glow shadows.",
    defaultText: "ALWAYS CREATING",
    prompt: "Animate a neon sign text effect with breathing multi-layered text-shadow drop glows.",
  },
  {
    id: "hologram",
    name: "Hologram Flicker",
    category: "Special Effects",
    animationTextType: "hologram",
    description: "Translucent holographic projection with horizontal scan lines and color splits.",
    defaultText: "HOLOGRAPHIC UI",
    prompt: "Create a hologram text effect with scan-line overlay, chromatic aberration split, and float animation.",
  },
  {
    id: "anaglyph",
    name: "Anaglyph 3D",
    category: "Special Effects",
    animationTextType: "anaglyph",
    description: "Red/cyan stereo separation that pulses like classic 3D glasses text.",
    defaultText: "DEPTH FIELD",
    prompt: "Animate red and cyan text-shadow offsets expanding and contracting to create anaglyph 3D glasses effect.",
  },
  {
    id: "ember",
    name: "Fire & Ember",
    category: "Special Effects",
    animationTextType: "ember",
    description: "Fiery upward-shooting glow embers flickering above the text.",
    defaultText: "BURNING BRIGHT",
    prompt: "Animate upward text-shadow layers in fire orange/red that flicker and pulse like burning embers.",
  },
  {
    id: "echo",
    name: "Echo Bloom",
    category: "Special Effects",
    animationTextType: "echo",
    description: "Ghost copies of the text bloom outward and fade into nothing.",
    defaultText: "ECHO",
    prompt: "Create two pseudo-element copies of text that scale outward and fade to transparent in a loop.",
  },

  // ── Playful & Kinetic ─────────────────────────────────────────────────────
  {
    id: "character-pop",
    name: "Pop & Bounce Letters",
    category: "Playful & Kinetic",
    animationTextType: "character-pop",
    description: "Letters spring in with overshoot bounce physics.",
    defaultText: "TASTE / LOOP",
    prompt: "Animate individual letter characters springing into view with scale and bounce overshoot.",
  },
  {
    id: "3d-flip",
    name: "3D Perspective Flip",
    category: "Playful & Kinetic",
    animationTextType: "3d-flip",
    description: "Letters rotate on the X-axis in 3D perspective.",
    defaultText: "PERSPECTIVE",
    prompt: "Animate characters rotating 90deg on rotateX in 3D perspective into their flat state.",
  },
  {
    id: "wave",
    name: "Wave Bounce",
    category: "Playful & Kinetic",
    animationTextType: "wave",
    description: "Letters bob up and down in a continuous rolling wave.",
    defaultText: "RIDE THE WAVE",
    prompt: "Animate each character bouncing up and down with a staggered delay to create a wave motion.",
  },
  {
    id: "kinetic",
    name: "Kinetic Type",
    category: "Playful & Kinetic",
    animationTextType: "kinetic",
    description: "Letters leap up and rotate at random angles, alternating pink and cyan.",
    defaultText: "KINETIC",
    prompt: "Animate each character with independent translateY and rotate keyframes in a staggered kinetic loop.",
  },
  {
    id: "elastic",
    name: "Elastic Squash & Stretch",
    category: "Playful & Kinetic",
    animationTextType: "elastic",
    description: "The whole word squashes and stretches like a rubber band in a loop.",
    defaultText: "ELASTIC MOTION",
    prompt: "Animate scaleX and scaleY alternately to create a squash-and-stretch elastic bounce effect.",
  },
  {
    id: "magnetic",
    name: "Magnetic Letters",
    category: "Playful & Kinetic",
    animationTextType: "magnetic",
    description: "Letters attract and repel each other as if charged with magnetism.",
    defaultText: "MAGNETIC TYPE",
    prompt: "Animate letters with staggered translateX attracted together and repelled apart in a loop.",
  },
  {
    id: "pendulum",
    name: "Pendulum Swing",
    category: "Playful & Kinetic",
    animationTextType: "pendulum",
    description: "Each letter swings like a pendulum from a fixed top anchor point.",
    defaultText: "PENDULUM",
    prompt: "Animate each character rotating from a top-center transform-origin like a swinging pendulum.",
  },
  {
    id: "melt",
    name: "Letter Melt",
    category: "Playful & Kinetic",
    animationTextType: "melt",
    description: "Characters stretch and drip downward as if melting, then reset.",
    defaultText: "MELTING NOW",
    prompt: "Animate each letter scaling vertically and blurring downward in a staggered melt drip loop.",
  },
  {
    id: "smoke",
    name: "Smoke Dissolve",
    category: "Playful & Kinetic",
    animationTextType: "smoke",
    description: "Characters drift upward and fade out like smoke, then reset.",
    defaultText: "SMOKE & SIGNAL",
    prompt: "Animate each letter drifting upward with rotation, blur, and opacity fade like dispersing smoke.",
  },
  {
    id: "heartbeat",
    name: "Heartbeat Pulse",
    category: "Playful & Kinetic",
    animationTextType: "heartbeat",
    description: "Text pumps in a double-beat cardiac rhythm with glow flares.",
    defaultText: "ALIVE",
    prompt: "Animate scale with a double-pulse heartbeat rhythm and glowing text-shadow bursts.",
  },
];

/**
 * Custom auto-looping hook that increments loop count every N seconds
 */
function useAutoLoop(intervalMs = 3500) {
  const [loopCount, setLoopCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      setLoopCount((c) => c + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [reduce, intervalMs]);

  return loopCount;
}

export function TextEffectRenderer({
  template,
  text,
  replayKey,
}: {
  template: TextEffectTemplate;
  text: string;
  replayKey: number;
}) {
  const content = text || template.defaultText;
  const loopCount = useAutoLoop(4000);
  const currentKey = `${replayKey}-${loopCount}`;

  switch (template.animationTextType) {
    case "typewriter": return <TypewriterEffect text={content} key={currentKey} />;
    case "stagger-up": return <StaggerUpEffect text={content} key={currentKey} />;
    case "fade-words": return <FadeWordsEffect text={content} key={currentKey} />;
    case "character-pop": return <CharacterPopEffect text={content} key={currentKey} />;
    case "gradient-wave": return <GradientWaveEffect text={content} key={currentKey} />;
    case "glitch": return <GlitchEffect text={content} key={currentKey} />;
    case "3d-flip": return <Flip3DEffect text={content} key={currentKey} />;
    case "neon-glow": return <NeonGlowEffect text={content} key={currentKey} />;
    case "scramble": return <ScrambleEffect text={content} key={currentKey} />;
    case "blur-reveal": return <BlurRevealEffect text={content} key={currentKey} />;
    case "wave": return <WaveEffect text={content} key={currentKey} />;
    case "liquid-fill": return <LiquidFillEffect text={content} key={currentKey} />;
    case "chrome-shine": return <ChromeShineEffect text={content} key={currentKey} />;
    case "focus-blur": return <FocusBlurEffect text={content} key={currentKey} />;
    case "echo": return <EchoEffect text={content} key={currentKey} />;
    case "spectrum": return <SpectrumEffect text={content} key={currentKey} />;
    case "jitter": return <JitterEffect text={content} key={currentKey} />;
    case "anaglyph": return <AnaglyphEffect text={content} key={currentKey} />;
    case "flap": return <FlapEffect text={content} key={currentKey} />;
    case "elastic": return <ElasticEffect text={content} key={currentKey} />;
    case "spotlight": return <SpotlightEffect text={content} key={currentKey} />;
    case "ember": return <EmberEffect text={content} key={currentKey} />;
    case "melt": return <MeltEffect text={content} key={currentKey} />;
    case "heartbeat": return <HeartbeatEffect text={content} key={currentKey} />;
    case "marker": return <MarkerEffect text={content} key={currentKey} />;
    case "hologram": return <HologramEffect text={content} key={currentKey} />;
    case "kinetic": return <KineticEffect text={content} key={currentKey} />;
    case "blackout": return <BlackoutEffect text={content} key={currentKey} />;
    case "magnetic": return <MagneticEffect text={content} key={currentKey} />;
    case "pendulum": return <PendulumEffect text={content} key={currentKey} />;
    case "smoke": return <SmokeEffect text={content} key={currentKey} />;
    case "scanner": return <ScannerEffect text={content} key={currentKey} />;
    default:
      return <span className="text-2xl font-bold text-white">{content}</span>;
  }
}

// ─── Existing effects ─────────────────────────────────────────────────────────

function TypewriterEffect({ text }: { text: string }) {
  return (
    <div className="flex items-center font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: Math.max(1.2, text.length * 0.06), ease: "linear" }}
        className="inline-block overflow-hidden whitespace-nowrap"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block h-7 w-2.5 bg-[#22d3ee]"
      />
    </div>
  );
}

function StaggerUpEffect({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl font-bold text-white sm:text-3xl">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

function FadeWordsEffect({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-2xl font-medium text-white/90 sm:text-3xl">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function CharacterPopEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex flex-wrap justify-center text-2xl font-extrabold tracking-wider text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.03, type: "spring", stiffness: 450, damping: 14 }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function GradientWaveEffect({ text }: { text: string }) {
  return (
    <div className="text-center text-2xl font-extrabold sm:text-4xl">
      <motion.span
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, #a855f7, #22d3ee, #ec4899, #a855f7)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}

function GlitchEffect({ text }: { text: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest text-white sm:text-3xl">
      <motion.span
        animate={{ x: [-2, 2, -1, 0] }}
        transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 1.2 }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
      <span className="absolute inset-0 text-cyan-400 opacity-75" style={{ clipPath: "inset(0 0 55% 0)" }} aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0 text-rose-500 opacity-75" style={{ clipPath: "inset(45% 0 0 0)" }} aria-hidden>
        {text}
      </span>
    </div>
  );
}

function Flip3DEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex flex-wrap justify-center text-2xl font-bold tracking-tight text-white sm:text-3xl" style={{ perspective: "500px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block origin-bottom"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function NeonGlowEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 0 4px #fff, 0 0 11px #22d3ee, 0 0 24px #22d3ee, 0 0 48px #22d3ee",
          "none",
          "0 0 4px #fff, 0 0 11px #22d3ee, 0 0 24px #22d3ee, 0 0 48px #22d3ee",
        ],
        opacity: [1, 0.35, 1],
      }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.5, 1] }}
      className="text-center text-2xl font-black tracking-widest text-cyan-300 sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

function ScrambleEffect({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const glyphs = "ABCDEFGIJKLMNOPQRSTUVXYZ0123456789#$@!%&";

  useEffect(() => {
    let frame = 0;
    const maxFrames = 25;
    const interval = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        setDisplay(text);
        clearInterval(interval);
      } else {
        setDisplay(
          text.split("").map((ch) => (ch === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)])).join("")
        );
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400 sm:text-3xl">{display}</div>;
}

function BlurRevealEffect({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ filter: "blur(14px)", opacity: 0, scale: 0.95 }}
      animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

// ─── New effects ──────────────────────────────────────────────────────────────

function WaveEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-[#22d3ee] sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ y: [7, -7, 7] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: i * -0.14 }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function LiquidFillEffect({ text }: { text: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-4xl">
      <motion.span
        animate={{ backgroundPosition: ["0% -110%", "0% 10%", "0% -110%"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(0deg, #22d3ee 0 46%, rgba(34,211,238,0.5) 48%, transparent 52% 100%)",
          backgroundSize: "100% 220%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          WebkitTextStroke: "1px rgba(34,211,238,0.6)",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}

function ChromeShineEffect({ text }: { text: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["130% 0", "-130% 0"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(105deg, rgba(255,255,255,0.3) 0 38%, #fff 47%, #fff 50%, rgba(255,255,255,0.3) 53% 100%)",
          backgroundSize: "260% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="inline-block [background:linear-gradient(105deg,rgba(255,255,255,0.2)_0_38%,#fff_47%,#fff_50%,rgba(255,255,255,0.2)_53%_100%)]"
      >
        {text}
      </motion.span>
    </div>
  );
}

function FocusBlurEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ filter: ["blur(0px)", "blur(7px)", "blur(0px)"], opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function EchoEffect({ text }: { text: string }) {
  return (
    <div className="relative flex items-center justify-center text-2xl font-black tracking-widest text-white sm:text-3xl">
      <span className="relative z-10">{text}</span>
      {[0, 1].map((layer) => (
        <motion.span
          key={layer}
          aria-hidden
          animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: layer * 1 }}
          style={{ color: layer === 0 ? "#7c5cff" : "#22d3ee" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
}

function SpectrumEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ filter: [`hue-rotate(${i * 42}deg)`, `hue-rotate(${i * 42 + 360}deg)`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          style={{ color: "#ff2d78" }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function JitterEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        skewX: [0, -14, 10, 0, 0, 0, 8, -6, 0],
        x: [0, -4, 3, 0, 0, 0, 2, 0, 0],
        opacity: [1, 1, 1, 1, 1, 1, 0.75, 1, 1],
      }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "linear" }}
      className="text-2xl font-black tracking-widest text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

function AnaglyphEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 0 0 #ff3355, 0 0 0 #33ddff",
          "-6px 0 1px #ff3355, 6px 0 1px #33ddff",
          "0 0 0 #ff3355, 0 0 0 #33ddff",
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

function FlapEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold text-white sm:text-3xl" style={{ perspective: "400px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ rotateX: [0, -88, 0, -25, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          style={{
            display: "grid",
            placeItems: "center",
            width: "1.4em",
            height: "1.8em",
            background: "linear-gradient(rgba(255,255,255,0.12) 0 49%, rgba(255,255,255,0.06) 51% 100%)",
            borderRadius: "4px",
            transformOrigin: "center",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function ElasticEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        scaleX: [1, 1.28, 0.78, 1.12, 0.96, 1.02, 1],
        scaleY: [1, 0.72, 1.24, 0.9, 1.05, 0.98, 1],
      }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest text-[#22d3ee] sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

function SpotlightEffect({ text }: { text: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["100% 0", "0% 0"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{
          background: "radial-gradient(3.5ch 100% at 50% 50%, #fff 20%, rgba(255,255,255,0.12) 75%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}

function EmberEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 -2px 6px #ffab40, 0 -6px 14px #ff6d00, 0 -12px 28px #dd2c00, 0 -20px 44px rgba(213,0,0,0.55)",
          "0 -3px 8px #ffc46b, 0 -9px 20px #ff8f1f, 0 -18px 38px #ff3d00, 0 -30px 60px rgba(213,0,0,0.8)",
          "0 -2px 6px #ffab40, 0 -6px 14px #ff6d00, 0 -12px 28px #dd2c00, 0 -20px 44px rgba(213,0,0,0.55)",
        ],
      }}
      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest sm:text-3xl"
      style={{ color: "#ffd9a0" }}
    >
      {text}
    </motion.div>
  );
}

function MeltEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-black tracking-widest text-[#ec4899] sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            scaleY: [1, 1.55, 1],
            scaleX: [1, 0.92, 1],
            y: [0, 7, 0],
            filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeIn", delay: i * 0.22 }}
          className="inline-block origin-top"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function HeartbeatEffect({ text }: { text: string }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.14, 1, 1.18, 1],
        textShadow: [
          "0 0 0 transparent",
          "0 0 18px rgba(236,72,153,0.65)",
          "0 0 0 transparent",
          "0 0 26px rgba(236,72,153,0.8)",
          "0 0 0 transparent",
        ],
      }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.14, 0.28, 0.42, 0.7] }}
      className="text-2xl font-black tracking-widest text-[#ec4899] sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}

function MarkerEffect({ text }: { text: string }) {
  return (
    <div className="relative text-2xl font-bold tracking-wider text-white sm:text-3xl">
      <motion.span
        animate={{ backgroundSize: ["0% 46%", "100% 46%", "0% 46%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(100deg, rgba(124,92,255,0.85), rgba(124,92,255,0.6))",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 62%",
          paddingBottom: "2px",
          WebkitBackgroundClip: "none",
        }}
        className="inline"
      >
        {text}
      </motion.span>
    </div>
  );
}

function HologramEffect({ text }: { text: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest sm:text-3xl" style={{ isolation: "isolate" }}>
      <motion.span
        animate={{ y: [2, -4, 2], skewX: [0, -3, 0], filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "rgba(34,211,238,0.72)", textShadow: "0 0 6px rgba(34,211,238,0.6), 0 0 22px rgba(34,211,238,0.45)" }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
      <span
        aria-hidden
        className="absolute inset-0 text-[#7c5cff] opacity-50"
        style={{ clipPath: "inset(0 0 52% 0)" }}
      >
        {text}
      </span>
    </div>
  );
}

function KineticEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-wide sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -18, 14, 0], rotate: [0, -9, 7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.08 }}
          style={{ color: i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#22d3ee" : "#fff" }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function BlackoutEffect({ text }: { text: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest text-white sm:text-3xl" style={{ padding: "0.28em 0.12em" }}>
      <span>{text}</span>
      <motion.div
        animate={{ scaleX: [0, 0, 1, 1, 0.38, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.19, 0.2, 0.58, 0.64, 1] }}
        className="absolute left-0 right-0 top-0 h-[44%] origin-left bg-white"
        style={{ boxShadow: "0 0 0 1px rgba(124,92,255,0.45)" }}
      />
      <motion.div
        animate={{ scaleX: [0, 0, 1, 1, 0.38, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.19, 0.2, 0.58, 0.64, 1], delay: 0.28 }}
        className="absolute bottom-0 left-0 right-0 h-[44%] origin-right bg-white"
        style={{ boxShadow: "0 0 0 1px rgba(124,92,255,0.45)" }}
      />
    </div>
  );
}

function MagneticEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            x: [0, (3 - i) * 2, (i - 3) * 3, 0],
            scale: [1, 1.12, 0.96, 1],
          }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
          style={{ color: i % 2 === 0 ? "#22d3ee" : "#fff" }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function PendulumEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl" style={{ perspective: "400px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * -0.12 }}
          style={{ color: i % 2 === 0 ? "#22d3ee" : "#fff", transformOrigin: "50% -80%", display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function SmokeEffect({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            y: [0, 0, -22, 10, 0],
            rotate: [0, 0, 14, 0, 0],
            scale: [1, 1, 1.45, 0.8, 1],
            opacity: [1, 1, 0, 0, 1],
            filter: ["blur(0px)", "blur(0px)", "blur(7px)", "blur(4px)", "blur(0px)"],
          }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }}
          style={{ color: i % 2 === 0 ? "#7c5cff" : "#22d3ee", display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}

function ScannerEffect({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["100% 0", "0% 0"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.18) 0 40%, #fff 50%, rgba(255,255,255,0.18) 60% 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
      <motion.div
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        className="pointer-events-none absolute bottom-[-6px] top-[-6px] w-[3px] bg-[#22d3ee]"
        style={{ boxShadow: "0 0 14px #22d3ee", transform: "translateX(-100%)" }}
      />
    </div>
  );
}
