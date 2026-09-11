import { useEffect, useState } from "react";

export default function PlayerMessageBubble({ message, position = "above" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 20);
    const hideTimer = setTimeout(() => setVisible(false), 4600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message?.localId]);

  if (!message) return null;

  const isSide = position === "side";

  return (
    <div
      className={`absolute z-30 transform -translate-y-full pointer-events-none transition-all duration-300 ${
        isSide ? "" : "-translate-x-1/2"
      } ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      style={
        isSide
          ? {
              right: "calc(50% + 4.5rem)",
              top: "-1rem",
              width: "max-content",
              maxWidth: "11rem",
            }
          : {
              left: "50%",
              top: "-1rem",
              width: "max-content",
              maxWidth: "13rem",
            }
      }
    >
      <div
        className="bg-white text-gray-800 text-sm md:text-base font-medium rounded-lg shadow-2xl px-4 py-2 break-words text-center"
        style={{ borderTop: "3px solid #EF4444" }}
      >
        {message.text}
      </div>
    </div>
  );
}
