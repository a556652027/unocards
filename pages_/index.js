import Layout from "~/components/Layout.js";
import React, { useState } from "react";
// import Router from "next/router";
import db from "~/utils/firebase/index";
import Button from "~/components/Button";
import Main from "~/components/Main";
import Footer from "~/components/Footer";
import Select from "~/components/Select";
import { Timestamp } from "~/utils/firebase/index";
import useTranslation from "next-translate/useTranslation";
import Router from "next-translate/Router";

const PLAYER_COUNT_OPTIONS = [
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
];

export default function NewGame() {
  const { t } = useTranslation();
  const [value, setValue] = useState("2");
  const [name, setName] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();

    db.collection("rooms")
      .add({
        count: Number(value),
        deckDict: {},
        date: Timestamp.fromDate(new Date()),
      })
      .then(
        (roomRef) => {
          roomRef
            .collection("players")
            .add({ name, admin: true })
            .then(
              (playerRef) => {
                Router.pushI18n(
                  "/rooms/[roomId]/players/[playerId]",
                  `/rooms/${roomRef.id}/players/${playerRef.id}`
                );
              },
              (err) => {
                throw err;
              }
            );
        },
        (err) => {
          throw err;
        }
      );
  };

  return (
    <Main color="gray">
      <Layout />
      <div className="flex-auto px-4 py-8 mx-auto w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg ">
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <div className="items-center justify-between mb-2">
                <h1 className="text-red-600 text-2xl font-extrabold text-center">
                  {t("common:new-game")}
                </h1>
              </div>
              <form onSubmit={onSubmit} className="bg-white rounded px-2 pt-4 pb-2 mb-4">
                <div className="mb-6">
                  <p className="text-gray-700 text-base font-bold mb-2">
                    {t("index:players-number")}
                  </p>
                  <Select
                    id="players-number"
                    value={value}
                    onChange={setValue}
                    options={PLAYER_COUNT_OPTIONS}
                  />
                </div>
                <div className="mb-8">
                  <label className="block text-gray-700 text-base font-bold mb-2">
                    <p className="mb-2">{t("common:nickname")} </p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("common:nickname-holder")}
                      type="text"
                      className="appearance-none bg-gray-100 border-2 border-gray-200 rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-400 hover:border-gray-400 transition duration-150 ease-in-out"
                      required
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between ">
                  <Button type={"submit"} color={"red"}>
                    {t("index:submit")}
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
