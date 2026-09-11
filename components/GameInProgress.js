import useCardAnimations from "~/hooks/useCardAnimations";
import { useState } from "react";
import { isAllowedToThrow, isWild, sortCards } from "~/utils/game";
import Heading from "~/components/Heading";
import PlayerCards from "~/components/PlayerCards";
import WildCardOptions from "~/components/WildCardOptions";
import CurrentMovePlayerOptions from "~/components/CurrentMovePlayerOptions";
import DrawPile from "~/components/DrawPile";
import DiscardPile from "~/components/DiscardPile";
import BoardLayout from "~/components/BoardLayout";
import {
  yellOne,
  passTurn,
  drawCard,
  discardACard,
} from "~/gameLogic/gameLogic";
import useTranslation from "next-translate/useTranslation";
import HeaderPlayer from "~/components/HeaderPlayer";
import PlayerReactionBubble from "~/components/PlayerReactionBubble";
import PlayerMessageBubble from "~/components/PlayerMessageBubble";

export default function GameInProgress({
  room,
  roomId,
  playersActive,
  playerId,
  winner,
  onNewGame,
  reactionsByPlayer,
  messagesByPlayer,
  isSpectator,
}) {
  const { t } = useTranslation();
  const [wildCard, setWildCard] = useState(null);
  const { drawPileRef, pileRef, onCardAdd, onCardRemove } = useCardAnimations();
  const currentMovePlayer = playersActive[room.currentMove];

  const onYellOne = (player) => {
    yellOne(player, roomId, playersActive);
  };

  const onPassTurn = (player) => {
    passTurn(player, roomId, playersActive);
  };

  const onDrawCard = () => {
    drawCard(roomId, playersActive);
  };

  const onDiscardACard = (card, color) => {
    if (isWild(card) && !color) {
      setWildCard(card);
      return;
    }
    discardACard(roomId, playersActive, card, color);
    setWildCard(null);
  };
  return (
    <div className="flex flex-1">
      <BoardLayout
        players={playersActive}
        currentPlayerId={playerId}
        renderPlayer={(player, isCurrentPlayer) => (
          <>
            <div className="relative">
              <PlayerMessageBubble
                message={messagesByPlayer?.[player.id]}
                position={isCurrentPlayer ? "side" : "above"}
              />
              <PlayerReactionBubble
                reaction={reactionsByPlayer?.[player.id]}
                position={isCurrentPlayer ? "side" : "above"}
              />
              <HeaderPlayer color="white" type="h1" margin="0" marginBottom="1">
                <span
                  className={
                    currentMovePlayer.id == player.id
                      ? "px-3 py-1 rounded-full bg-yellow-400 text-black font-bold turn-glow inline-block"
                      : "opacity-60 pl-2"
                  }
                >
                  {currentMovePlayer.id == player.id ? <span>👉 </span> : null}
                  {player.data().name}
                </span>
              </HeaderPlayer>
            </div>
            <PlayerCards
              cards={sortCards(player.data().cards)}
              isCurrentPlayer={isCurrentPlayer}
              onDiscardACard={onDiscardACard}
              isCardDisabled={(card) =>
                !!winner ||
                currentMovePlayer.id != player.id ||
                !isAllowedToThrow(
                  card,
                  room.discardPile,
                  room.discardColor,
                  room.drawCount,
                  player.data().cards
                )
              }
              onCardAdd={onCardAdd}
              onCardRemove={onCardRemove}
              winner={winner}
              revealAll={isSpectator}
            />
          </>
        )}
        drawPile={
          <DrawPile
            onDrawCard={onDrawCard}
            canDrawFromPile={!room.drawPile}
            isCurrentPlayerTurn={currentMovePlayer.id == playerId}
            drawPileRef={drawPileRef}
          />
        }
        discardPile={
          <DiscardPile
            discardPile={room.discardPile}
            discardColor={room.discardColor}
            pileRef={pileRef}
          />
        }
        playerOptions={
          isSpectator ? null : wildCard ? (
            <WildCardOptions
              onChooseColor={(color) => onDiscardACard(wildCard, color)}
            />
          ) : (
            <CurrentMovePlayerOptions
              currentMovePlayer={currentMovePlayer}
              playerId={playerId}
              onPassTurn={onPassTurn}
              room={room}
              onYellOne={onYellOne}
            />
          )
        }
        yellOneMessage={
          room.yellOne != null ? (
            <h1 className="z-10 bg-red-600 text-white m-2 font-bold text-center text-xl md:text-2xl p-4 rounded-lg shadow-xl winner-pop-in">
              📢 {t("playerId:yell-one")}{" "}
              {playersActive[room.yellOne].data().name}
            </h1>
          ) : null
        }
        winner={winner}
        onNewGame={onNewGame}
        readOnly={isSpectator}
      />
    </div>
  );
}
