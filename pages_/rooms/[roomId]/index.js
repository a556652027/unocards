import Layout from "~/components/Layout.js";
import db from "~/utils/firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Button from "~/components/Button";
import Main from "~/components/Main";
import { isAllowedToThrow } from "~/utils/game";
import Footer from "~/components/Footer";
import useTranslation from "next-translate/useTranslation";
import Router from "next-translate/Router";
import getBaseUrl from "~/utils/getBaseUrl";

export default function Room() {
  const { t } = useTranslation();
  const router = useRouter();
  const roomId = router.query.roomId;
  const [roomIsFull, setRoomIsFull] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomPlaying, setRoomPlaying] = useState(false);
  const [formAllowedToSubmit, setFormAllowedToSubmit] = useState(true);
  // useEffect(() => {
  const onCreateRoom = (e) => {
    event.preventDefault();
    if (formAllowedToSubmit) {
      setFormAllowedToSubmit(false);
      if (roomId) {
        const roomRef = db.collection("rooms").doc(roomId);
        Promise.all([roomRef.get(), roomRef.collection("players").get()]).then(
          ([roomSnapshot, playersSnapshot]) => {
            //hay veces que data es undefine ver de como manejarlo
            if (
              roomSnapshot.data().count > playersSnapshot.size &&
              !roomSnapshot.data().playing
            ) {
              roomRef
                .collection("players")
                .add({ name: playerName, admin: false })
                .then((playerRef) => {
                  Router.pushI18n(
                    "/rooms/[roomId]/players/[playerId]",
                    `/rooms/${roomSnapshot.id}/players/${playerRef.id}`
                  );
                });
            } else if (roomSnapshot.data().playing) {
              setRoomPlaying(true);
            } else {
              setRoomIsFull(true);
            }
          }
        );
      }
    }
  };

  // , [roomId]);

  const onWatch = () => {
    Router.pushI18n("/rooms/[roomId]/watch", `/rooms/${roomId}/watch`);
  };

  if (roomIsFull || roomPlaying) {
    return (
      <Main color="gray" justify="center">
        <Layout />
        <div className="flex-auto px-4 py-8 mx-auto w-full">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
                <p className="text-gray-700 font-bold mb-4">
                  {roomIsFull
                    ? t("roomId:no-more-place")
                    : t("roomId:game-isplaying")}
                </p>
                <Button color="yellow" onClick={onWatch}>
                  {t("roomId:watch-as-spectator")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Main>
    );
  } else {
    return (
      <Main color="gray" justify="center">
        <Layout />
        <div className="flex-auto px-4 py-8 mx-auto w-full">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg ">
              <div className="bg-white p-6 rounded-lg shadow-2xl">
                <div className="items-center justify-between mb-2">
                  <h1 className="text-red-600 text-2xl font-extrabold text-center">
                    {t("roomId:join-game")}
                  </h1>
                </div>
                <form
                  className="bg-white rounded px-2 pt-4 pb-2 mb-4"
                  onSubmit={onCreateRoom}
                >
                  <div className="mb-8">
                    <label className="block text-gray-700 text-base font-bold mb-2">
                      <p className="mb-2">{t("common:nickname")}</p>
                      <input
                        className="appearance-none bg-gray-100 border-2 border-gray-200 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-400 hover:border-gray-400 transition duration-150 ease-in-out"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder={t("common:nickname-holder")}
                        type="text"
                        required
                      ></input>
                    </label>
                  </div>
                  <div className="flex items-center justify-between ">
                    <Button
                      color={"green"}
                      type={"submit"}
                      className="w-full"
                      disabled={!isAllowedToThrow}
                    >
                      {t("roomId:join")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Main>
    );
  }
}
