// Candidate "blips" scattered around the radar. A few are marked as
// matches — the sweep line loops continuously, and matches pulse in
// mint on their own offset timer to suggest the AI is actively pinging
// good fits as it scans.
const BLIPS: { angle: number; radius: number; isMatch?: boolean; delay: number }[] = [
  { angle: 20, radius: 38, delay: 0 },
  { angle: 65, radius: 62, isMatch: true, delay: 0.4 },
  { angle: 110, radius: 45, delay: 1.1 },
  { angle: 150, radius: 80, delay: 1.8 },
  { angle: 195, radius: 55, isMatch: true, delay: 0.9 },
  { angle: 240, radius: 30, delay: 2.4 },
  { angle: 280, radius: 70, delay: 1.4 },
  { angle: 320, radius: 50, isMatch: true, delay: 2.9 },
  { angle: 5, radius: 88, delay: 3.3 },
  { angle: 165, radius: 20, delay: 0.6 },
];

function polar(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad) * 0.5;
  const y = 50 + radiusPct * Math.sin(rad) * 0.5;
  return { left: `${x}%`, top: `${y}%` };
}

export function RadarHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Concentric grid rings */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {[46, 34, 22, 10].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#1E2A44"
            strokeWidth="0.4"
          />
        ))}
        <line x1="50" y1="4" x2="50" y2="96" stroke="#1E2A44" strokeWidth="0.3" />
        <line x1="4" y1="50" x2="96" y2="50" stroke="#1E2A44" strokeWidth="0.3" />
      </svg>

      {/* Rotating sweep */}
      <div
        className="absolute inset-0 animate-radar-spin"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(232,163,61,0.35), rgba(232,163,61,0) 35%)",
          borderRadius: "9999px",
        }}
      />

      {/* Candidate blips */}
      {BLIPS.map((blip, i) => {
        const pos = polar(blip.angle, blip.radius);
        return (
          <span
            key={i}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              ...pos,
              backgroundColor: blip.isMatch ? "#5EEAD4" : "#4B5D7E",
              animation: blip.isMatch
                ? `radar-ping 3.6s ease-in-out ${blip.delay}s infinite`
                : undefined,
              boxShadow: blip.isMatch ? "0 0 0 rgba(94,234,212,0.5)" : undefined,
            }}
          />
        );
      })}

      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radar-sweep shadow-[0_0_16px_4px_rgba(232,163,61,0.5)]" />
    </div>
  );
}
