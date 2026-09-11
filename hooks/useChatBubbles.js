import { useEffect, useRef, useState } from "react";
import db from "~/utils/firebase";

const DISPLAY_DURATION_MS = 5000;
const MESSAGE_SOUND_URL = "/audio/message_quack.mp3";

export default function useChatBubbles(roomId) {
  const [messagesByPlayer, setMessagesByPlayer] = useState({});
  const isFirstSnapshot = useRef(true);
  const messageAudioRef = useRef(null);

  useEffect(() => {
    messageAudioRef.current = new Audio(MESSAGE_SOUND_URL);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(20);

    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type !== "added") return;
        const data = change.doc.data();
        const localId = `${change.doc.id}-${Date.now()}`;

        setMessagesByPlayer((current) => ({
          ...current,
          [data.playerId]: { ...data, localId },
        }));

        if (messageAudioRef.current) {
          messageAudioRef.current.currentTime = 0;
          messageAudioRef.current.play().catch(() => {});
        }

        setTimeout(() => {
          setMessagesByPlayer((current) => {
            if (current[data.playerId]?.localId !== localId) return current;
            const next = { ...current };
            delete next[data.playerId];
            return next;
          });
        }, DISPLAY_DURATION_MS);
      });
    });

    return () => unsubscribe();
  }, [roomId]);

  return messagesByPlayer;
}
