import { useEffect, useState } from "react";

export default function PlayerReactionBubble({ reaction }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!reaction) return;
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 20);
    const hideTimer = setTimeout(() => setVisible(false), 3600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [reaction?.localId]);

  if (!reaction) return null;

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
      style={{ left: "50%", top: "-0.75rem" }}
    >
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-lg bg-white"
        style={{ width: "5.5rem", height: "5.5rem" }}
      >
        <img
          src={`/img/${reaction.emoji}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
