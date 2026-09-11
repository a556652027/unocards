import useTranslation from "next-translate/useTranslation";

export default function CurrentMovePlayerOptiones({
  currentMovePlayer,
  playerId,
  onPassTurn,
  room,
  onYellOne,
}) {
  const { t } = useTranslation();
  const alreadyYelled = room.yellOne === room.currentMove;
  const shouldYell =
    currentMovePlayer.id == playerId &&
    !alreadyYelled &&
    currentMovePlayer.data().cards.length === 2;

  return (
    <div
      className={`px-8 sm:px-0 flex flex-1 flex-row mt-1 justify-center ${
        currentMovePlayer.id == playerId ? "" : "invisible"
      }`}
    >
      <button
        onClick={() => onPassTurn(room.currentMove)}
        className={`text-2xl md:text-xl flex-initial text-white font-bold py-1 md:py-2 px-4 rounded-lg shadow-md transform transition duration-150 bg-${
          room.drawPile == false ? "gray-400" : "green-600"
        } hover:bg-${
          room.drawPile == false ? "gray-400" : "green-500"
        } mr-2 ${
          room.drawPile == false
            ? "cursor-not-allowed opacity-75"
            : "hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
        }`}
        disabled={room.drawPile == false ? true : false}
      >
        {t("playerId:player-options.pass")}
      </button>
      <button
        onClick={() => onYellOne(room.currentMove)}
        className={`text-2xl md:text-xl bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-4 md:p-2 rounded-lg shadow-md ml-2 transform transition duration-150 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 ${
          shouldYell ? "uno-glow" : ""
        }`}
      >
        UNO!
      </button>
    </div>
  );
}
