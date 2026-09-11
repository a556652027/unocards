import { Card, BackCard } from "~/components/Card";

export default function PlayerCards({
  cards,
  isCurrentPlayer,
  isCardDisabled,
  onDiscardACard,
  onCardAdd,
  onCardRemove,
  winner,
  revealAll,
}) {
  return (
    <div
      className={
        isCurrentPlayer
          ? `flex align-start w-full flex-auto overflow-x-scroll pl-4 lg:pl-6`
          : "w-full pr-10 md:pr-16"
      }
    >
      <div
        className={`flex flex-row flex-no-wrap justify-center flex-auto ${
          isCurrentPlayer ? "" : "h-16 md:h-32 relative"
        }`}
      >
        {cards.map((card, index) => {
          const disabled = isCardDisabled(card);

          return isCurrentPlayer ? (
            // for sm: margin: 0 -15px md:0 -20px
            <div
              key={card}
              className="-mx-4 lg:-mx-6 flex flex-col justify-center"
            >
              <button
                onClick={() => onDiscardACard(card)}
                disabled={disabled}
                className={`transform transition-transform duration-200 ease-out ${
                  disabled
                    ? "cursor-not-allowed"
                    : "hover:-translate-y-3 hover:scale-105 active:translate-y-0 active:scale-100"
                }`}
              >
                <Card
                  onRemove={onCardRemove}
                  onAdd={onCardAdd}
                  sizeSM={24}
                  sizeMD={32}
                  card={card}
                  opacity={disabled ? "opacity-50" : "opacity-100"}
                />
              </button>
            </div>
          ) : (
            <div
              key={card + `_Back`}
              className="absolute"
              style={{
                left: `${(100 / (cards.length + 1)) * (index + 1)}%`,
              }}
            >
              {winner || revealAll ? (
                <Card
                  onRemove={onCardRemove}
                  onAdd={onCardAdd}
                  card={card}
                  sizeSM={10}
                  sizeMD={16}
                />
              ) : (
                <BackCard
                  onRemove={onCardRemove}
                  onAdd={onCardAdd}
                  sizeSM={10}
                  sizeMD={16}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
