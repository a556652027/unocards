import Layout from "~/components/Layout.js";
import Main from "~/components/Main";
import Footer from "~/components/Footer";
import Link from "next-translate/Link";
import useTranslation from "next-translate/useTranslation";

const GAMES = [
  { id: "uno", href: "/", image: "/cards/UNO_Logo.svg" },
  { id: "poker", href: "/games/poker", emoji: "🃏" },
];

export default function Games() {
  const { t } = useTranslation();

  return (
    <Main color="gray">
      <Layout />
      <div className="flex-auto px-4 py-8 mx-auto w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h1 className="text-red-600 text-2xl font-extrabold text-center mb-6">
                {t("games:title")}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAMES.map((game) => (
                  <Link key={game.id} href={game.href}>
                    <a className="block bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 hover:border-red-400 rounded-lg p-4 text-center transition duration-150 ease-in-out">
                      {game.image ? (
                        <img
                          src={game.image}
                          alt={t(`games:${game.id}-name`)}
                          className="h-12 mx-auto mb-2"
                        />
                      ) : (
                        <div className="h-12 mb-2 flex items-center justify-center text-4xl">
                          {game.emoji}
                        </div>
                      )}
                      <p className="font-bold text-gray-700">
                        {t(`games:${game.id}-name`)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {t(`games:${game.id}-desc`)}
                      </p>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Main>
  );
}
