import { useEffect, useRef } from "react";

const START_SOUND_URL = "/audio/start_card.mp3";
const PLACE_SOUND_URL = "/audio/place_card.mp3";

export default function useGameSounds(room) {
  const startAudioRef = useRef(null);
  const placeAudioRef = useRef(null);
  const prevPlayingRef = useRef(undefined);
  const prevDiscardPileRef = useRef(undefined);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    startAudioRef.current = new Audio(START_SOUND_URL);
    placeAudioRef.current = new Audio(PLACE_SOUND_URL);
  }, []);

  useEffect(() => {
    if (!room) return;

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      prevPlayingRef.current = room.playing;
      prevDiscardPileRef.current = room.discardPile;
      return;
    }

    const justStarted = !prevPlayingRef.current && room.playing;
    const discardChanged = room.discardPile !== prevDiscardPileRef.current;

    const play = (audio) => {
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    if (justStarted) {
      play(startAudioRef.current);
    } else if (room.playing && discardChanged) {
      play(placeAudioRef.current);
    }

    prevPlayingRef.current = room.playing;
    prevDiscardPileRef.current = room.discardPile;
  }, [room?.playing, room?.discardPile]);
}
