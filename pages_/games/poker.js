import Layout from "~/components/Layout.js";
import Main from "~/components/Main";
import Footer from "~/components/Footer";
import Link from "next-translate/Link";
import useTranslation from "next-translate/useTranslation";

export default function Poker() {
  const { t } = useTranslation();

  return (
    <Main color="gray" justify="center">
      <Layout />
      <div className="flex-auto px-4 py-8 mx-auto w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h1 className="text-red-600 text-2xl font-extrabold mb-4">
                {t("games:poker-name")}
              </h1>
              <div className="text-6xl mb-4">🃏</div>
              <p className="text-gray-700 font-bold mb-6">
                {t("games:coming-soon")}
              </p>
              <Link href="/games">
                <a className="text-red-600 hover:underline font-medium">
                  {t("games:back-to-games")}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Main>
  );
}
