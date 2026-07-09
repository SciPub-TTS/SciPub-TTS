import { motion } from "motion/react";

export function SectionBg({
  src,
  from = "#E1EFE6",
  opacity = 0.72,
}: {
  src: string;
  from?: string;
  opacity?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        whileInView={{ scale: [1.05, 1.16, 1.05], opacity }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 30, ease: "easeInOut", repeat: Infinity },
        }}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.78) saturate(0.95)" }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${from} 0%, ${from}ee 8%, ${from}66 30%, ${from}55 50%, ${from}66 70%, ${from}ee 92%, ${from} 100%)`,
        }}
      />
    </div>
  );
}
