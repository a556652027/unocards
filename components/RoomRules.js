import useTranslation from "next-translate/useTranslation";
import db from "~/utils/firebase";

export default function RoomRules({ room, roomId, isAdmin }) {
  const { t } = useTranslation();
  const skipChallengeEnabled = room.rules?.skipChallenge !== false;

  const onToggleSkipChallenge = () => {
    if (!isAdmin) return;

    db.collection("rooms")
      .doc(roomId)
      .set(
        {
          rules: { ...room.rules, skipChallenge: !skipChallengeEnabled },
        },
        { merge: true }
      )
      .catch((error) => {
        // If the deployed Firestore rules haven't been updated to allow the
        // "rules" field yet, this write is silently rejected and the
        // checkbox appears to snap back - surface it so that's obvious.
        console.error("Failed to update room rules:", error);
      });
  };

  return (
    <div className="mb-6">
      <p className="text-gray-700 font-bold mb-2">
        {t("playerId:room-rules.title")}
      </p>
      <label
        className={`flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 ${
          isAdmin ? "cursor-pointer" : "cursor-not-allowed opacity-75"
        }`}
      >
        <span className="text-gray-700 text-sm sm:text-base pr-2">
          {t("playerId:room-rules.skip-challenge")}
        </span>
        <input
          type="checkbox"
          checked={skipChallengeEnabled}
          disabled={!isAdmin}
          onChange={onToggleSkipChallenge}
          className="w-5 h-5 flex-shrink-0 accent-red-600"
        />
      </label>
    </div>
  );
}
