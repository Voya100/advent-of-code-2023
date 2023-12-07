// https://adventofcode.com/2023/day/7

import { sum, toCountMap } from './utils';

const cardTypes = 'AKQJT98765432';
const nonJokerCardTypes = 'AKQT98765432'.split('');
enum HandType {
  FiveOfAKind = 7,
  FourOfAKind = 6,
  FullHouse = 5,
  ThreeOfAKind = 4,
  TwoPair = 3,
  OnePair = 2,
  HighCard = 1,
}

type Hand = {
  hand: string;
  handType: HandType;
  bid: number;
};

export function part1(input: string) {
  const hands = parseInput(input, false);
  hands.sort((h1, h2) => compareHands(h1, h2, false));
  return sum(hands, (hand, i) => hand.bid * (i + 1));
}

export function part2(input: string) {
  const hands = parseInput(input, true);
  hands.sort((h1, h2) => compareHands(h1, h2, true));
  return sum(hands, (hand, i) => hand.bid * (i + 1));
}

function parseInput(input: string, usesJokers: boolean) {
  return input.split('\n').map((row) => parseHand(row, usesJokers));
}

function parseHand(row: string, usesJokers: boolean) {
  const [handInput, bidInput] = row.split(' ');
  return {
    hand: handInput,
    handType: usesJokers ? getHandTypeWithJokers(handInput) : getHandType(handInput),
    bid: +bidInput,
  };
}

function getHandType(handInput: string) {
  const countMap = toCountMap(handInput.split(''));
  const counts = [...countMap.values()];
  if (counts.includes(5)) {
    return HandType.FiveOfAKind;
  }
  if (counts.includes(4)) {
    return HandType.FourOfAKind;
  }
  if (counts.includes(3) && counts.includes(2)) {
    return HandType.FullHouse;
  }
  if (counts.includes(3)) {
    return HandType.ThreeOfAKind;
  }
  const pairCount = counts.filter((count) => count === 2).length;
  if (pairCount === 2) {
    return HandType.TwoPair;
  }
  if (pairCount === 1) {
    return HandType.OnePair;
  }
  return HandType.HighCard;
}

function getHandTypeWithJokers(handInput: string): HandType {
  if (handInput.indexOf('J') === -1) {
    return getHandType(handInput);
  }
  const possibleHandTypes = nonJokerCardTypes.map((nonJokerCard) =>
    getHandTypeWithJokers(handInput.replace('J', nonJokerCard))
  );
  return Math.max(...possibleHandTypes);
}

function compareHands(hand1: Hand, hand2: Hand, usesJokers: boolean) {
  if (hand1.handType !== hand2.handType) {
    return hand1.handType - hand2.handType;
  }
  for (let i = 0; i < hand1.hand.length; i++) {
    if (hand1.hand[i] !== hand2.hand[i]) {
      return getCardValue(hand1.hand[i], usesJokers) - getCardValue(hand2.hand[i], usesJokers);
    }
  }
  return 0;
}

function getCardValue(card: string, usesJokers: boolean) {
  if (usesJokers && card === 'J') {
    return -1;
  }
  return cardTypes.length - cardTypes.indexOf(card);
}
