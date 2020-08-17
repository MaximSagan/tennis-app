import { writable, derived } from "svelte/store";

interface MatchPlayerState {
  name: string;
  games: number;
  points: number;
}

type MatchState = [MatchPlayerState, MatchPlayerState];

const POINT_MASK = new Map<number, number>([
  [0, 0],
  [1, 15],
  [2, 30],
  [3, 40],
]);

const MAX_POINTS_TO_SHOW_NUMERIC = 3;

const STANDARD_MIN_POINTS_TO_WIN = 4;
const TIEBREAK_MIN_POINTS_TO_WIN = 7;
const GAMES_FOR_WIN_OR_TIEBREAK = 6;

export class Match {
  private matchState: MatchState;

  constructor(public player1Name: string, public player2Name: string) {
    if (player1Name === player2Name) {
      throw new Error("Players must have different names");
    }
    this.matchState = [player1Name, player2Name].map((name) => ({
      name,
      games: 0,
      points: 0,
    })) as [MatchPlayerState, MatchPlayerState];
  }

  private get isTiebreak(): boolean {
    return (
      this.matchState[0].games === GAMES_FOR_WIN_OR_TIEBREAK &&
      this.matchState[1].games === GAMES_FOR_WIN_OR_TIEBREAK
    );
  }

  private get minPointsToWin(): number {
    return this.isTiebreak
      ? TIEBREAK_MIN_POINTS_TO_WIN
      : STANDARD_MIN_POINTS_TO_WIN;
  }

  pointWonBy(scorerName: string): void {
    const scorerIndex = this.matchState.findIndex(
      (player) => player.name === scorerName
    );
    if (scorerIndex === -1) {
      throw new Error("Unknown player");
    }

    const scorerState = this.matchState[scorerIndex];
    const opponentState = this.matchState[scorerIndex === 0 ? 1 : 0];

    const isGamePoint =
      scorerState.points + 1 >= this.minPointsToWin &&
      scorerState.points >= opponentState.points + 1;

    let updatedScorerState: MatchPlayerState;
    let updatedOpponentState: MatchPlayerState;
    if (isGamePoint) {
      updatedScorerState = {
        ...scorerState,
        games: scorerState.games + 1,
        points: 0,
      };
      updatedOpponentState = {
        ...opponentState,
        points: 0,
      };
    } else {
      updatedScorerState = {
        ...scorerState,
        points: scorerState.points + 1,
      };
      updatedOpponentState = opponentState;
    }
    this.matchState =
      scorerIndex === 0
        ? [updatedScorerState, updatedOpponentState]
        : [updatedOpponentState, updatedScorerState];
  }

  get isMatchFinished(): boolean {
    const [trailingPlayerGames, leadingPlayerGames] = [
      ...this.matchState.map((player) => player.games),
    ].sort();
    console.log({ trailingPlayerGames, leadingPlayerGames });
    return (
      // Leader reached points required to win with a sufficient margin
      (leadingPlayerGames === GAMES_FOR_WIN_OR_TIEBREAK &&
        leadingPlayerGames >= trailingPlayerGames + 2) ||
      // Leader won tiebreak
      leadingPlayerGames === GAMES_FOR_WIN_OR_TIEBREAK + 1
    );
  }

  private getPointsDisplay(): string {
    const [player1State, player2State] = this.matchState;
    console.log(this.matchState);

    if (this.isTiebreak) {
      return `${player1State.points}-${player2State.points}`;
    }

    const showMaskedNumeric =
      Math.min(player1State.points, player2State.points) <
      MAX_POINTS_TO_SHOW_NUMERIC;

    if (showMaskedNumeric) {
      const player1MaskedPoints = POINT_MASK.get(player1State.points);
      const player2MappedPoints = POINT_MASK.get(player2State.points);
      return `${player1MaskedPoints}-${player2MappedPoints}`;
    }

    if (player1State.points === player2State.points) {
      return "Deuce";
    }

    return `Advantage ${
      player1State.points > player2State.points
        ? player1State.name
        : player2State.name
    }`;
  }

  score(): string {
    const [player1State, player2State] = this.matchState;
    const gamesDisplay = `${player1State.games}-${player2State.games}`;
    const pointsDisplay = this.getPointsDisplay();
    return `${gamesDisplay}, ${pointsDisplay}`;
  }
}
