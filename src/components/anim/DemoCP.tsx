// Blackout Bars — TasteLoop Animation Vocabulary
"use client";

import React from "react";
import { motion } from "framer-motion";

export function BlackoutBarsEffect({ text = "CLASSIFIED" }: { text?: string }) {
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

export default BlackoutBarsEffect;
