import { useState } from "react";
import db, { Timestamp } from "~/utils/firebase";
import { emojis } from "~/utils/emojis";

export default function EmojiReactions({ roomId, playerId, playerName }) {
  const [isOpen, setIsOpen] = useState(false);

  const onThrow = (emoji) => {
    setIsOpen(false);

    db.collection("rooms")
      .doc(roomId)
      .collection("reactions")
      .add({
        playerId,
        playerName: playerName || "",
        emoji,
        createdAt: Timestamp.now(),
      })
      .then((docRef) => {
        setTimeout(() => {
          docRef.delete().catch(() => {});
        }, 5000);
      });
  };

  return (
    <div
      className="fixed z-20 flex flex-col items-start"
      style={{ bottom: "1rem", left: "1rem" }}
    >
      {isOpen && (
        <div
          className="mb-2 overflow-y-auto bg-white rounded-lg shadow-2xl border border-gray-200 p-3 grid grid-cols-3 gap-3"
          style={{ width: "17rem", maxWidth: "85vw", maxHeight: "24rem" }}
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onThrow(emoji)}
              className="rounded-full overflow-hidden border-2 border-gray-200 hover:border-red-500 hover:scale-110 transform transition duration-150 focus:outline-none flex-shrink-0"
              style={{ width: "4rem", height: "4rem" }}
            >
              <img
                src={`/img/${emoji}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center text-2xl focus:outline-none"
        aria-label="toggle emoji picker"
      >
        😊
      </button>
    </div>
  );
}
