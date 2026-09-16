import Layout from "~/components/Layout.js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import db from "~/utils/firebase";
import StartGame from "~/components/StartGame";
import RoomRules from "~/components/RoomRules";
import Chat from "~/components/Chat";
import EmojiReactions from "~/components/EmojiReactions";
import PlayerReactionBubble from "~/components/PlayerReactionBubble";
import PlayerMessageBubble from "~/components/PlayerMessageBubble";
import useReactions from "~/hooks/useReactions";
import useChatBubbles from "~/hooks/useChatBubbles";
import useGameSounds from "~/hooks/useGameSounds";
import { takeACard, isWild, isWildDrawFour, isDrawTwo } from "~/utils/game";
import Button from "~/components/Button";
import Main from "~/components/Main";
import Heading from "~/components/Heading";
import Footer from "~/components/Footer";
import useTranslation from "next-translate/useTranslation";
import getBaseUrl from "~/utils/getBaseUrl";

export default function Game() {
  const { t } = useTranslation();
  const [room, setRoom] = useState(null);
  const [playersActive, setPlayersActive] = useState([]);
  const router = useRouter();
  const roomId = router.query.roomId;
  const playerId = router.query.playerId;
  const currentPlayer = playersActive.find((player) => player.id === playerId);
  const playerName = currentPlayer ? currentPlayer.data().name : "";
  const reactionsByPlayer = useReactions(roomId);
  const messagesByPlayer = useChatBubbles(roomId);
  useGameSounds(room);
  // const link_jugadores = router.asPath;

  useEffect(() => {
    if (roomId) {
      const roomRef = db.collection("rooms").doc(roomId);

      const roomUnsubscribe = roomRef.onSnapshot((roomRef) => {
        setRoom(roomRef.data());
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

  const onNewGame = (e) => {
    event.preventDefault();
    const roomRef = db.collection("rooms").doc(roomId);
    let usedCards = {};
    let firstCard = takeACard(usedCards);
    //ver que pasa si la primera carta es reverse
    while (isWild(firstCard)) {
      usedCards = {};
      firstCard = takeACard(usedCards);
    }
    let drawCount = isDrawTwo(firstCard) ? 2 : 0;
    playersActive.forEach((playerActive) => {
      const cards = [];
      for (var i = 1; i <= 7; i++) {
        const card = takeACard(usedCards);
        cards.push(card);
      }

      playerActive.ref.set(
        {
          cards: cards,
        },
        { merge: true }
      );
    });

    roomRef.set(
      {
        playing: true,
        discardPile: firstCard,
        currentMove: 0,
        deckDict: usedCards,
        isReverse: false,
        drawPile: false,
        drawCount: drawCount,
        yellOne: null,
        pennalty: null,
        pendingChallenge: null,
      },
      { merge: true }
    );
  };

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
        <StartGame
          room={room}
          roomId={roomId}
          playersActive={playersActive}
          playerId={playerId}
          onNewGame={onNewGame}
          reactionsByPlayer={reactionsByPlayer}
          messagesByPlayer={messagesByPlayer}
        />
        <Chat roomId={roomId} playerId={playerId} playerName={playerName} />
        <EmojiReactions
          roomId={roomId}
          playerId={playerId}
          playerName={playerName}
        />
      </Main>
    );
  } else {
    const playersSlots = [];
    for (let i = 0; i < room.count; i++) {
      const player = playersActive[i];
      playersSlots.push(
        <li
          className={`flex items-center justify-between py-3 px-3 rounded-lg mb-2 ${
            player ? "bg-green-50" : "bg-gray-50"
          }`}
          key={i}
        >
          <div className="relative flex-auto font-medium text-gray-700">
            {player && (
              <>
                <PlayerMessageBubble
                  message={messagesByPlayer?.[player.id]}
                  position="side"
                />
                <PlayerReactionBubble
                  reaction={reactionsByPlayer?.[player.id]}
                  position="side"
                />
              </>
            )}
            {player ? player.data().name : t("playerId:waiting-player")}
            {player && player.id === playerId ? (
              <span className="text-gray-400"> {t("playerId:you")}</span>
            ) : null}
          </div>
          {player ? (
            <span className="text-green-600 text-xl">✅</span>
          ) : (
            <span className="text-gray-300 text-xl">⏳</span>
          )}
        </li>
      );
    }

    return (
      <Main color="gray">
        <Layout />
        <div className="flex-auto px-4 py-8 mx-auto w-full">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg ">
              <div className="bg-white p-6 rounded-lg shadow-2xl">
                <div className="mb-6">
                  <p className="text-gray-700 font-bold mb-2">
                    {t("playerId:link")}
                  </p>
                  <input
                    className="w-full text-gray-700 bg-gray-100 border-2 border-gray-200 h-12 p-2 rounded-lg mb-2"
                    readOnly
                    value={`${getBaseUrl()}/rooms/${roomId}`}
                  ></input>
                  <RoomLinkButton link={`${getBaseUrl()}/rooms/${roomId}`} />
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 font-bold mb-2">
                    {t("playerId:watch-link")}
                  </p>
                  <input
                    className="w-full text-gray-700 bg-gray-100 border-2 border-gray-200 h-12 p-2 rounded-lg mb-2"
                    readOnly
                    value={`${getBaseUrl()}/rooms/${roomId}/watch`}
                  ></input>
                  <RoomLinkButton
                    link={`${getBaseUrl()}/rooms/${roomId}/watch`}
                  />
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 font-bold mb-2">
                    {t("playerId:players")}
                  </p>
                  <ol className="pl-0">{playersSlots}</ol>
                </div>
                <RoomRules
                  room={room}
                  roomId={roomId}
                  isAdmin={currentPlayer?.data().admin === true}
                />
                {playersActive.map((player) => {
                  const isAdmin =
                    player.data().admin == true && player.id == playerId;
                  return isAdmin ? (
                    <Button
                      key={player.id}
                      color={
                        playersActive.length == room.count ? "green" : "red"
                      }
                      onClick={onNewGame}
                      className="w-full"
                      disabled={isAdmin ? false : true}
                    >
                      {t("playerId:start")}
                    </Button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Chat roomId={roomId} playerId={playerId} playerName={playerName} />
        <EmojiReactions
          roomId={roomId}
          playerId={playerId}
          playerName={playerName}
        />
      </Main>
    );
  }
}

const RoomLinkButton = ({ link }) => {
  const { t } = useTranslation();
  const [copiedLinkToClipboard, setCopiedLinkToClipboard] = useState(false);

  return (
    <CopyToClipboard
      text={link}
      onCopy={() => {
        setCopiedLinkToClipboard(true);
      }}
    >
      <Button
        onBlur={() => setCopiedLinkToClipboard(false)}
        color={copiedLinkToClipboard ? "gray" : "yellow"}
      >
        {copiedLinkToClipboard ? t("playerId:copied") : t("playerId:copy-link")}
      </Button>
    </CopyToClipboard>
  );
};
