import { useEffect, useState } from "react";

export default function PlayerMessageBubble({ message }) {
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

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
      style={{
        left: "50%",
        top: "-6.5rem",
        width: "max-content",
        maxWidth: "12rem",
      }}
    >
      <div className="bg-white text-gray-800 text-sm rounded-lg shadow-lg border border-gray-300 px-3 py-2 break-words text-center">
        {message.text}
      </div>
    </div>
  );
}
