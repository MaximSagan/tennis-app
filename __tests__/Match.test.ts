import { Match } from "../src/Match";

describe(Match.name, () => {
  let match: Match;
  const player1Name = "Abe";
  const player2Name = "Maude";
  beforeEach(() => {
    match = new Match(player1Name, player2Name);
  });
  it("should initialize with 0 games, 0 points", () => {
    expect(match.score()).toBe("0-0, 0-0");
  });
  it("should use appropriate point masks (15, 30, 40)", () => {
    match.pointWonBy(player2Name);
    expect(match.score()).toBe("0-0, 0-15");
    match.pointWonBy(player2Name);
    expect(match.score()).toBe("0-0, 0-30");
    match.pointWonBy(player2Name);
    expect(match.score()).toBe("0-0, 0-40");
  });

  it("player should win game when passing 40 with a two-point difference", () => {
    match.pointWonBy(player1Name);
    match.pointWonBy(player1Name);

    match.pointWonBy(player2Name);
    match.pointWonBy(player2Name);
    match.pointWonBy(player2Name);
    match.pointWonBy(player2Name);

    expect(match.score()).toBe("0-1, 0-0");
  });

  describe("deuce/advantage", () => {
    it("points should be marked as Deuce when reaching 40 when scores are equal", () => {
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe("0-0, 15-15");

      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe("0-0, 30-30");

      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe("0-0, Deuce");

      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe("0-0, Deuce");
    });

    it("after deuce, players' advantage should be correctly marked", () => {
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe("0-0, Deuce");

      match.pointWonBy(player1Name);
      expect(match.score()).toBe(`0-0, Advantage ${player1Name}`);

      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      expect(match.score()).toBe(`0-0, Advantage ${player2Name}`);
    });

    it("game should be won when scoring after advantage", () => {
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player2Name); // Deuce

      match.pointWonBy(player1Name); // Advantage

      match.pointWonBy(player1Name); // Advantage

      expect(match.score()).toBe("1-0, 0-0");
    });
  });

  describe("winning a match (excluding tiebreak)", () => {
    it("when the difference in games is 2 or more, player should win the match by winning 6 games", () => {
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);

      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);

      expect(match.score()).toBe("4-5, 0-0");
      expect(match.isMatchFinished).toBe(false);

      winStandardGame(match, player2Name);

      expect(match.score()).toBe("4-6, 0-0");
      expect(match.isMatchFinished).toBe(true);
    });

    it("when the difference in games is 1 when 6 games is reached by a player, the leading plaer must win a 7th game to win the match", () => {
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);

      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);

      expect(match.score()).toBe("5-6, 0-0");
      expect(match.isMatchFinished).toBe(false);

      winStandardGame(match, player2Name);

      expect(match.score()).toBe("5-7, 0-0");
      expect(match.isMatchFinished).toBe(true);
    });
  });

  describe("tiebreak", () => {
    beforeEach(() => {
      // Enter tiebreak

      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);
      winStandardGame(match, player1Name);

      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);
      winStandardGame(match, player2Name);

      winStandardGame(match, player1Name);
      winStandardGame(match, player2Name);
    });

    it("should enter a tiebreak when score is 6-6", () => {
      expect(match.score()).toBe("6-6, 0-0");
      expect(match.isTiebreak).toBe(true);
    });

    it("points in a tiebreak should increase by 1 (rather than 15, 30, 40)", () => {
      match.pointWonBy(player1Name);
      expect(match.score()).toBe("6-6, 1-0");
      match.pointWonBy(player1Name);
      expect(match.score()).toBe("6-6, 2-0");
      match.pointWonBy(player1Name);
      expect(match.score()).toBe("6-6, 3-0");
      match.pointWonBy(player1Name);
      expect(match.score()).toBe("6-6, 4-0");
      match.pointWonBy(player1Name);
      expect(match.score()).toBe("6-6, 5-0");
    });

    it("when the difference in points is 2 or more, player should win the tiebreak by winning 7 points", () => {
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);

      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);

      expect(match.score()).toBe("6-6, 4-6");
      expect(match.isMatchFinished).toBe(false);

      match.pointWonBy(player2Name);

      expect(match.score()).toBe("6-7, 0-0");
      expect(match.isMatchFinished).toBe(true);
    });

    it("when both players have 6 points or more, a difference of two points is required to win a tiebreak", () => {
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);
      match.pointWonBy(player1Name);

      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);

      match.pointWonBy(player1Name);

      expect(match.score()).toBe("6-6, 7-6");
      expect(match.isMatchFinished).toBe(false);

      match.pointWonBy(player2Name);
      match.pointWonBy(player2Name);

      expect(match.score()).toBe("6-6, 7-8");
      expect(match.isMatchFinished).toBe(false);

      match.pointWonBy(player2Name);

      expect(match.score()).toBe("6-7, 0-0");
      expect(match.isMatchFinished).toBe(true);
    });
  });
});

/**
 * Simple helper function that wins a single game for a player, simple so we don't have to count calls to "pointWonBy".
 * Note: Only works when points start at 0-0, for simplicity
 */
function winStandardGame(match: Match, playerName: string): void {
  if (!match.score().endsWith(", 0-0")) {
    throw new Error(
      "Helper method can only be called when no points have yet been scored in the current game."
    );
  }
  match.pointWonBy(playerName);
  match.pointWonBy(playerName);
  match.pointWonBy(playerName);
  match.pointWonBy(playerName);
}
