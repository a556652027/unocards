import { useEffect, useState } from "react";

export default function PlayerReactionBubble({ reaction, position = "above" }) {
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

  const isSide = position === "side";

  return (
    <div
      className={`absolute z-30 transform -translate-y-full pointer-events-none transition-all duration-300 ${
        isSide ? "" : "-translate-x-1/2"
      } ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      style={
        isSide
          ? { left: "calc(50% + 4.5rem)", top: "-1rem" }
          : { left: "50%", top: "-5.5rem" }
      }
    >
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-xl bg-white"
        style={{ width: "8rem", height: "8rem" }}
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
