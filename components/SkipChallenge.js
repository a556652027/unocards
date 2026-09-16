import useTranslation from "next-translate/useTranslation";

export function SkipChallengePrompt({ skippedPlayerName, onChallenge }) {
  const { t } = useTranslation();

  return (
    <div className="px-8 sm:px-0 flex flex-col items-center mt-1">
      <p className="text-white font-bold text-center mb-2 text-sm md:text-base drop-shadow">
        {t("playerId:skip-challenge.prompt", { name: skippedPlayerName })}
      </p>
      <button
        onClick={onChallenge}
        className="text-2xl md:text-xl flex-initial text-white font-bold py-1 md:py-2 px-4 rounded-lg shadow-md bg-purple-600 hover:bg-purple-500 mb-2 transform transition duration-150 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
      >
        {t("playerId:player-options.challenge")}
      </button>
    </div>
  );
}

export function SkipChallengeResult({
  skippedPlayerName,
  challengerName,
  hadPlayableCard,
}) {
  const { t } = useTranslation();

  return (
    <p className="text-white font-bold text-center mb-2 text-sm md:text-base drop-shadow">
      {hadPlayableCard
        ? t("playerId:skip-challenge.caught", { name: skippedPlayerName })
        : t("playerId:skip-challenge.false-alarm", {
            name: skippedPlayerName,
            challenger: challengerName,
          })}
    </p>
  );
}
