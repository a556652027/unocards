import db from "~/utils/firebase/index";
import {
  takeACard,
  isReverse,
  isSkip,
  isWildDrawFour,
  isDrawTwo,
} from "~/utils/game";

function getPlayingCards(playersCards, discardPile) {
  return [...playersCards.flat(), discardPile];
}

export function yellOne(player, roomId, playersActive) {
  const roomRef = db.collection("rooms").doc(roomId);

  return db.runTransaction(async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    const freshRoom = roomSnap.data();
    const currentPlayerSnap = await transaction.get(
      playersActive[freshRoom.currentMove].ref
    );
    const playerCards = currentPlayerSnap.data().cards;
    const pennalty = playerCards.length > 2 ? 4 : null;

    transaction.set(roomRef, { yellOne: player, pennalty }, { merge: true });
  });
}

export function passTurn(player, roomId, playersActive) {
  const roomRef = db.collection("rooms").doc(roomId);

  return db.runTransaction(async (transaction) => {
    const [roomSnap, ...playerSnaps] = await Promise.all([
      transaction.get(roomRef),
      ...playersActive.map((p) => transaction.get(p.ref)),
    ]);
    const freshRoom = roomSnap.data();
    const playersCards = playerSnaps.map((snap) => snap.data().cards);

    const totalPlayers = playersActive.length;
    const direction = freshRoom.isReverse ? -1 : 1;
    const nextPlayer = (totalPlayers + (player + direction)) % totalPlayers;
    const playerCards = playersCards[freshRoom.currentMove];
    const playingCards = getPlayingCards(playersCards, freshRoom.discardPile);
    const usedCards = freshRoom.deckDict;

    const pennalty = freshRoom.pennalty;
    if (pennalty > 0) {
      for (let i = 0; i < pennalty; i++) {
        const newCard = takeACard(usedCards, playingCards);
        playerCards.push(newCard);
        playingCards.push(newCard);
      }
    }

    transaction.set(
      playersActive[player].ref,
      { cards: playerCards },
      { merge: true }
    );

    transaction.set(
      roomRef,
      {
        currentMove: nextPlayer,
        deckDict: usedCards,
        previousMove: player,
        yellOne: null,
        drawCount: 0,
        drawPile: false,
        pennalty: null,
      },
      { merge: true }
    );
  });
}

export function drawCard(roomId, playersActive) {
  const roomRef = db.collection("rooms").doc(roomId);

  return db.runTransaction(async (transaction) => {
    const [roomSnap, ...playerSnaps] = await Promise.all([
      transaction.get(roomRef),
      ...playersActive.map((p) => transaction.get(p.ref)),
    ]);
    const freshRoom = roomSnap.data();
    const playersCards = playerSnaps.map((snap) => snap.data().cards);

    const player = freshRoom.currentMove;
    const usedCards = freshRoom.deckDict;
    const playingCards = getPlayingCards(playersCards, freshRoom.discardPile);
    const playerCards = playersCards[player];
    const drawCount = freshRoom.drawCount;
    const pennalty = freshRoom.pennalty;
    const total = pennalty ? drawCount + pennalty : drawCount;

    if (drawCount > 0 || pennalty) {
      for (let i = 0; i < total; i++) {
        const newCard = takeACard(usedCards, playingCards);
        playerCards.push(newCard);
        playingCards.push(newCard);
      }
    } else {
      const card = takeACard(usedCards, playingCards);
      playingCards.push(card);
      playerCards.push(card);
    }

    transaction.set(
      playersActive[player].ref,
      { cards: playerCards },
      { merge: true }
    );

    if (drawCount > 0) {
      const totalPlayers = playersActive.length;
      const direction = freshRoom.isReverse ? -1 : 1;
      const nextPlayer = (totalPlayers + (player + direction)) % totalPlayers;

      transaction.set(
        roomRef,
        {
          deckDict: usedCards,
          yellOne: null,
          drawCount: 0,
          currentMove: nextPlayer,
          previousMove: player,
          drawPile: false,
          pennalty: null,
        },
        { merge: true }
      );
    } else {
      transaction.set(
        roomRef,
        {
          deckDict: usedCards,
          yellOne: null,
          drawCount,
          drawPile: true,
          pennalty: null,
        },
        { merge: true }
      );
    }
  });
}

export function discardACard(roomId, playersActive, card, color) {
  const roomRef = db.collection("rooms").doc(roomId);

  return db.runTransaction(async (transaction) => {
    const [roomSnap, ...playerSnaps] = await Promise.all([
      transaction.get(roomRef),
      ...playersActive.map((p) => transaction.get(p.ref)),
    ]);
    const freshRoom = roomSnap.data();
    const playersCards = playerSnaps.map((snap) => snap.data().cards);

    const totalPlayers = playersActive.length;
    let moves;
    let roomIsReverse;
    if (totalPlayers == 2 && isReverse(card)) {
      moves = 2;
      roomIsReverse = freshRoom.isReverse;
    } else {
      roomIsReverse = isReverse(card)
        ? !freshRoom.isReverse
        : freshRoom.isReverse;
      moves = isSkip(card) ? 2 : 1;
    }
    const direction = roomIsReverse ? -1 : 1;
    const playerCards = playersCards[freshRoom.currentMove];
    const nextPlayer =
      (totalPlayers + (freshRoom.currentMove + moves * direction)) %
      totalPlayers;

    let drawCount = freshRoom.drawCount || 0;
    if (isWildDrawFour(card)) {
      drawCount += 4;
    } else if (isDrawTwo(card)) {
      drawCount += 2;
    }

    let nextCards = playerCards.filter((c) => c != card);
    const usedCards = freshRoom.deckDict;
    let yellOne =
      freshRoom.currentMove == freshRoom.yellOne ? freshRoom.yellOne : null;
    let pennalty = freshRoom.pennalty;
    const playingCards = getPlayingCards(playersCards, freshRoom.discardPile);
    if (yellOne == null && nextCards.length == 1) {
      pennalty = 4;
    }
    if (pennalty > 0) {
      for (let i = 0; i < pennalty; i++) {
        const newCard = takeACard(usedCards, playingCards);
        nextCards.push(newCard);
        playingCards.push(newCard);
      }
    }

    transaction.set(
      playersActive[freshRoom.currentMove].ref,
      { cards: nextCards },
      { merge: true }
    );

    transaction.set(
      roomRef,
      {
        deckDict: usedCards,
        currentMove: nextPlayer,
        previousMove: freshRoom.currentMove,
        discardPile: card,
        discardColor: color || null,
        isReverse: roomIsReverse,
        yellOne,
        drawCount,
        drawPile: false,
        pennalty: null,
      },
      { merge: true }
    );
  });
}
