import useTranslation from "next-translate/useTranslation";

export default function WildCardOptions({ onChooseColor }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row flex-no-wrap md:flex-no-wrap mt-2 px-2 md:px-4 justify-center">
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 md:py-2 px-2 rounded-full shadow-lg mx-2 flex-auto border-2 border-white transform transition-transform duration-150 hover:scale-110 active:scale-95"
        onClick={() => onChooseColor(t("red"))}
      >
        {t("playerId:wild-options.red")}
      </button>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-1 md:py-2 px-2 rounded-full shadow-lg mr-2 flex-auto border-2 border-white transform transition-transform duration-150 hover:scale-110 active:scale-95"
        onClick={() => onChooseColor("yellow")}
      >
        {t("playerId:wild-options.yellow")}
      </button>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 md:py-2 px-2 rounded-full shadow-lg flex-auto border-2 border-white transform transition-transform duration-150 hover:scale-110 active:scale-95"
        onClick={() => onChooseColor("green")}
      >
        {t("playerId:wild-options.green")}
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 md:py-2 px-2 rounded-full shadow-lg mx-2 flex-auto border-2 border-white transform transition-transform duration-150 hover:scale-110 active:scale-95"
        onClick={() => onChooseColor("blue")}
      >
        {t("playerId:wild-options.blue")}
      </button>
    </div>
  );
}
