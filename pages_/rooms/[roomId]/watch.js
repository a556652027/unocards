import Layout from "~/components/Layout.js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import db from "~/utils/firebase";
import StartGame from "~/components/StartGame";
import useReactions from "~/hooks/useReactions";
import useChatBubbles from "~/hooks/useChatBubbles";
import useGameSounds from "~/hooks/useGameSounds";
import Main from "~/components/Main";
import Heading from "~/components/Heading";
import Footer from "~/components/Footer";
import useTranslation from "next-translate/useTranslation";

const SPECTATOR_ID = "__spectator__";

export default function Watch() {
  const { t } = useTranslation();
  const [room, setRoom] = useState(null);
  const [playersActive, setPlayersActive] = useState([]);
  const router = useRouter();
  const roomId = router.query.roomId;
  const reactionsByPlayer = useReactions(roomId);
  const messagesByPlayer = useChatBubbles(roomId);
  useGameSounds(room);

  useEffect(() => {
    if (roomId) {
      const roomRef = db.collection("rooms").doc(roomId);

      const roomUnsubscribe = roomRef.onSnapshot((snapshot) => {
        setRoom(snapshot.data());
      });

      const playersUnsubscribe = roomRef
        .collection("players")
        .onSnapshot(function (querySnapshot) {
          var players = [];

          querySnapshot.forEach(function (doc) {
            players.push(doc);
          });
          setPlayersActive(players);
        });

      return () => {
        roomUnsubscribe();
        playersUnsubscribe();
      };
    }
  }, [roomId]);

  if (!room) {
    return (
      <Main color={"gray"}>
        <Layout />
        <Heading type="h1" color="white">
          {t("playerId:loading")}
        </Heading>
      </Main>
    );
  }

  if (room.playing) {
    return (
      <Main color={"gray"}>
        <Layout />
        <div className="w-full text-center py-1 bg-black bg-opacity-30 text-white text-sm">
          {t("watch:spectator-badge")}
        </div>
        <StartGame
          room={room}
          roomId={roomId}
          playersActive={playersActive}
          playerId={SPECTATOR_ID}
          onNewGame={() => {}}
          reactionsByPlayer={reactionsByPlayer}
          messagesByPlayer={messagesByPlayer}
          isSpectator
        />
      </Main>
    );
  }

  return (
    <Main color="gray">
      <Layout />
      <div className="flex-auto px-4 py-8 mx-auto w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white p-4 rounded shadow">
              <h1 className="text-gray-700 text-lg font-bold text-center mb-2">
                {t("watch:spectator-badge")}
              </h1>
              <p className="text-gray-500 text-sm text-center mb-4">
                {t("watch:waiting")}
              </p>
              <p className="text-gray-700 font-bold mb-2">
                {t("watch:players")} ({playersActive.length}/{room.count})
              </p>
              <ol className="divide-y divide-gray-400 list-decimal pl-5">
                {playersActive.map((player) => (
                  <li className="py-2 text-gray-700" key={player.id}>
                    {player.data().name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Main>
  );
}
