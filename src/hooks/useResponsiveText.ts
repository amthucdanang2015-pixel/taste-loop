import { useEffect, useRef, useState } from "react";

/**
 * A hook that calculates the optimal font size so that the given text
 * fits within its container without overflowing.
 * 
 * It uses a hidden DOM element to measure text dimensions efficiently.
 */
export function useResponsiveText(
  text: string,
  options = { minFontSize: 12, maxFontSize: 40, lineHeight: 1.2 }
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(options.maxFontSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;

        // Use a binary search to find the best font size that fits both width and height
        let min = options.minFontSize;
        let max = options.maxFontSize;
        let best = min;

        // Create a hidden measuring element to perfectly match the DOM rendering
        const measurer = document.createElement("div");
        measurer.style.position = "absolute";
        measurer.style.visibility = "hidden";
        measurer.style.whiteSpace = "pre-wrap";
        measurer.style.wordBreak = "break-word";
        measurer.style.width = `${width}px`; // Constrain to container width
        measurer.style.padding = "0";
        measurer.style.margin = "0";
        measurer.style.lineHeight = String(options.lineHeight);
        
        // Copy relevant styles from container
        const computedStyle = window.getComputedStyle(container);
        measurer.style.fontFamily = computedStyle.fontFamily;
        measurer.style.fontWeight = computedStyle.fontWeight;
        measurer.style.letterSpacing = computedStyle.letterSpacing;
        measurer.style.textTransform = computedStyle.textTransform;
        
        measurer.innerText = text;
        document.body.appendChild(measurer);

        // Binary search for max font size that fits in height
        for (let i = 0; i < 8; i++) {
          const mid = (min + max) / 2;
          measurer.style.fontSize = `${mid}px`;
          
          if (measurer.scrollHeight <= height && measurer.scrollWidth <= width) {
            best = mid;
            min = mid;
          } else {
            max = mid;
          }
        }

        document.body.removeChild(measurer);

        // Small padding offset so it doesn't touch the very edges
        setFontSize(best * 0.95);
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [text, options.minFontSize, options.maxFontSize, options.lineHeight]);

  return { containerRef, fontSize };
}
