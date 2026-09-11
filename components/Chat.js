import { useState } from "react";
import db, { Timestamp } from "~/utils/firebase";
import useTranslation from "next-translate/useTranslation";

const MAX_MESSAGE_LENGTH = 300;

export default function Chat({ roomId, playerId, playerName }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const onSend = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        playerId,
        playerName: playerName || "",
        text: trimmed.slice(0, MAX_MESSAGE_LENGTH),
        createdAt: Timestamp.now(),
      })
      .then((docRef) => {
        setTimeout(() => {
          docRef.delete().catch(() => {});
        }, 6000);
      });

    setText("");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-30 transform -translate-y-1/2 bg-red-700 hover:bg-red-800 text-white rounded-l-lg shadow-lg px-2 py-3 flex flex-col items-center gap-1 transition-opacity duration-200 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ top: "50%", right: "0px" }}
        aria-label="open chat"
      >
        <span className="text-xl">💬</span>
      </button>

      <div
        className="fixed z-30 bg-white rounded-l-lg shadow-lg border border-gray-300 overflow-hidden"
        style={{
          top: "3rem",
          width: "16rem",
          maxWidth: "80vw",
          right: isOpen ? "0px" : "-16rem",
          transition: "right 300ms ease-in-out",
        }}
      >
        <form onSubmit={onSend} className="flex items-center">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={t("playerId:chat.placeholder")}
            className="flex-1 px-3 py-3 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-3 text-red-600 font-bold text-sm focus:outline-none disabled:opacity-50 flex-shrink-0"
            disabled={!text.trim()}
          >
            {t("playerId:chat.send")}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-2 text-gray-400 text-lg leading-none focus:outline-none flex-shrink-0"
            aria-label="close chat"
          >
            &times;
          </button>
        </form>
      </div>
    </>
  );
}
