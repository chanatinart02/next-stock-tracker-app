"use client";

import { useEffect, useRef } from "react";

// Custom hook to handles EVERYTHING related to loading TradingView safely.
const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
  // Create a ref for the widget container div
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If the ref does NOT exist yet → do nothing (avoids errors during first render)
    if (!containerRef.current) return;
    // If it already exists → widget already injected → skip (Prevent loading widget multiple times)
    if (containerRef.current.dataset.loaded) return;

    /**
     * Prepare inside container before injecting script
     * - Ensure there is a widget element for TradingView to mount into
     * - Set correct height + 100% width
     */
    containerRef.current.innerHTML = `
      <div 
        class="tradingview-widget-container__widget"
        style="height:${height}px; width:100%;"
      ></div>
    `;

    // Create <script> tag dynamically
    const script = document.createElement("script");
    script.src = scriptUrl; // TradingView library URL
    script.async = true; //  Load without blocking UI
    script.innerHTML = JSON.stringify(config); // Widget configuration

    containerRef.current.appendChild(script); //  Append script into container
    containerRef.current.dataset.loaded = "true"; // Marks widget as already created

    // Cleanup function to remove widget when component unmounts or dependencies change
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clear container
        delete containerRef.current.dataset.loaded; // Reset loaded flag
      }
    };
  }, [scriptUrl, config, height]);

  return containerRef;
};
export default useTradingViewWidget;
