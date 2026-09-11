import { useEffect, useRef, useState } from "react";
import db, { Timestamp } from "~/utils/firebase";
import { emojis } from "~/utils/emojis";

const DISPLAY_DURATION_MS = 4000;
const FADE_OUT_BEFORE_MS = 400;

function ReactionBubble({ reaction, onExpire }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 20);
    const hideTimer = setTimeout(
      () => setVisible(false),
      DISPLAY_DURATION_MS - FADE_OUT_BEFORE_MS
    );
    const removeTimer = setTimeout(
      () => onExpire(reaction.localId),
      DISPLAY_DURATION_MS
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${
        visible ? "opacity-100 scale-100 -translate-y-1" : "opacity-0 scale-75"
      }`}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
        <img
          src={`/img/${reaction.emoji}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <span className="mt-1 text-xs text-white bg-black bg-opacity-60 px-2 rounded-full truncate max-w-[84px]">
        {reaction.playerName}
      </span>
    </div>
  );
}

export default function EmojiReactions({ roomId, playerId, playerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReactions, setActiveReactions] = useState([]);
  const isFirstSnapshot = useRef(true);

  useEffect(() => {
    if (!roomId) return;

    const reactionsRef = db
      .collection("rooms")
      .doc(roomId)
      .collection("reactions")
      .orderBy("createdAt", "desc")
      .limit(20);

    const unsubscribe = reactionsRef.onSnapshot((snapshot) => {
      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type !== "added") return;
        const data = change.doc.data();
        setActiveReactions((current) => [
          ...current,
          { localId: `${change.doc.id}-${Date.now()}`, ...data },
        ]);
      });
    });

    return () => unsubscribe();
  }, [roomId]);

  const onExpire = (localId) => {
    setActiveReactions((current) =>
      current.filter((reaction) => reaction.localId !== localId)
    );
  };

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
        }, DISPLAY_DURATION_MS + 1000);
      });
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-3 pointer-events-none max-w-[90vw]">
        {activeReactions.map((reaction) => (
          <ReactionBubble
            key={reaction.localId}
            reaction={reaction}
            onExpire={onExpire}
          />
        ))}
      </div>

      <div className="fixed bottom-4 left-4 z-20 flex flex-col items-start">
        {isOpen && (
          <div className="mb-2 w-56 max-w-[80vw] max-h-72 overflow-y-auto bg-white rounded shadow-lg border border-gray-300 p-2 grid grid-cols-4 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onThrow(emoji)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:border-red-500 focus:outline-none flex-shrink-0"
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
    </>
  );
}
