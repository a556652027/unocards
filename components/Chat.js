import { useEffect, useRef, useState } from "react";
import db, { Timestamp } from "~/utils/firebase";
import useTranslation from "next-translate/useTranslation";

const MAX_MESSAGE_LENGTH = 300;
const MESSAGE_HISTORY_LIMIT = 50;

export default function Chat({ roomId, playerId, playerName }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const isFirstSnapshot = useRef(true);

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(MESSAGE_HISTORY_LIMIT);

    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => newMessages.push({ id: doc.id, ...doc.data() }));
      newMessages.reverse();
      setMessages(newMessages);

      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        return;
      }

      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.playerId !== playerId) {
        setUnreadCount((count) => count + 1);
      }
    });

    return () => unsubscribe();
  }, [roomId, playerId]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [isOpen, messages]);

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
      });

    setText("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-20 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-72 max-w-[85vw] h-96 max-h-[70vh] bg-white rounded shadow-lg flex flex-col overflow-hidden border border-gray-300">
          <div className="bg-gray-800 text-white px-3 py-2 flex items-center justify-between">
            <span className="font-bold text-sm">{t("playerId:chat.title")}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-lg leading-none focus:outline-none"
              aria-label="close chat"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-4">
                {t("playerId:chat.empty")}
              </p>
            ) : (
              messages.map((message) => {
                const isMine = message.playerId === playerId;
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500 px-1">
                      {isMine ? t("playerId:chat.you") : message.playerName}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm break-words max-w-full ${
                        isMine
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={onSend} className="flex border-t border-gray-200">
            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder={t("playerId:chat.placeholder")}
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 text-red-600 font-bold text-sm focus:outline-none disabled:opacity-40"
              disabled={!text.trim()}
            >
              {t("playerId:chat.send")}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="relative bg-red-700 hover:bg-red-800 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center text-2xl focus:outline-none"
        aria-label="toggle chat"
      >
        💬
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
