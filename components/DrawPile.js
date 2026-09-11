import { BackCard } from "~/components/Card";

export default function DrawPile({
  onDrawCard,
  canDrawFromPile,
  isCurrentPlayerTurn,
  drawPileRef,
}) {
  return (
    <button
      onClick={(e) => onDrawCard()}
      disabled={!(canDrawFromPile && isCurrentPlayerTurn)}
      style={{ marginRight: "1em" }}
      className={`transform transition-transform duration-200 ease-out ${
        canDrawFromPile && isCurrentPlayerTurn
          ? "hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100"
          : "cursor-not-allowed opacity-75"
      }`}
    >
      <div
        style={{
          position: "relative",
          paddingRight: "1em",
        }}
      >
        <div>
          <BackCard sizeSM={16} sizeMD={20} />
        </div>
        <div
          style={{
            top: 0,
            position: "absolute",
            left: ".5em",
          }}
        >
          <BackCard sizeSM={16} sizeMD={20} />
        </div>
        <div
          style={{
            top: 0,
            position: "absolute",
            left: "1em",
          }}
          ref={drawPileRef}
        >
          <BackCard sizeSM={16} sizeMD={20} />
        </div>
      </div>
    </button>
  );
}
