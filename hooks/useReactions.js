import { useEffect, useRef, useState } from "react";
import db from "~/utils/firebase";

const DISPLAY_DURATION_MS = 4000;

export default function useReactions(roomId) {
  const [reactionsByPlayer, setReactionsByPlayer] = useState({});
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
        const localId = `${change.doc.id}-${Date.now()}`;

        setReactionsByPlayer((current) => ({
          ...current,
          [data.playerId]: { ...data, localId },
        }));

        setTimeout(() => {
          setReactionsByPlayer((current) => {
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

  return reactionsByPlayer;
}
