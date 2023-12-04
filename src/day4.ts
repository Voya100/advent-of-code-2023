import { ExtendedSet } from './data-structures/set';
import { numberSum, sum } from './utils';
// https://adventofcode.com/2023/day/4

type Card = {
  id: number;
  matches: number;
};

export function part1(input: string) {
  const cards = parseInput(input);
  return sum(cards, getCardValue);
}

export function part2(input: string) {
  const cards = parseInput(input);
  return countScratchCards(cards);
}

function parseInput(input: string) {
  return input.split('\n').map(parseCard);
}

// Format "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1"
function parseCard(row: string): Card {
  const [cardSection, numberSection] = row.split(/:\s+/);
  const id = +cardSection.split(/\s+/)[1];
  const [winningNumbers, yourNumbers] = numberSection
    .split(' | ')
    .map((numberString) => numberString.split(/\s+/).map((num) => +num));
  const matches = new ExtendedSet(yourNumbers).intersect(winningNumbers).size;
  return { id, matches };
}

function getCardValue(card: Card) {
  if (card.matches >= 1) {
    return 2 ** (card.matches - 1);
  }
  return 0;
}

function countScratchCards(cards: Card[]) {
  // How many copies each card generates, including itself
  const numberOfCardsById: Record<number, number> = {};

  // Iterate in reverse. Since cards only reference following cards, this ensures references have already been counted
  for (const card of cards.reverse()) {
    let cardsTotal = 1;
    for (let i = 1; i < card.matches + 1; i++) {
      cardsTotal += numberOfCardsById[card.id + i];
    }
    numberOfCardsById[card.id] = cardsTotal;
  }
  return numberSum(Object.values(numberOfCardsById));
}
