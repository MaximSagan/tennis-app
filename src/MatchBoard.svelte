<script lang="ts">
  import Button from "smelte/src/components/Button";

  import type { Match } from "./Match";
  import type PlayerNameInput from "./PlayerNameInput.svelte";
  import { createEventDispatcher } from "svelte";

  export let match: Match;
  let scoreDisplay = match.score();
  let isMatchedFinished = false;

  const handlePlayerButtonClick: svelte.JSX.EventHandler<
    MouseEvent,
    HTMLButtonElement
  > = (event) => {
    const playerName = event.target.dataset.player!;
    match.pointWonBy(playerName);
    scoreDisplay = match.score();
    isMatchedFinished = match.isMatchFinished;
  };

  const dispatch = createEventDispatcher();
  const handleNewGameClick: svelte.JSX.EventHandler<
    MouseEvent,
    HTMLButtonElement
  > = (event) => {
    dispatch("newGame");
  };
</script>

<style>
  .board {
    min-width: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .button-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
  .button-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
  }
  .racket {
    font-size: 2rem;
  }
  .reverse {
    transform: scaleX(-1);
  }

  .score {
    font-size: 2.5rem;
    margin-top: 1rem;
  }
</style>

<div class="max-w-md rounded shadow-lg p-4 board">
  <div class="button-container">
    {#each [match.player1Name, match.player2Name] as playerName, index (playerName)}
      <Button
        on:click={handlePlayerButtonClick}
        disabled={isMatchedFinished}
        outlined={true}
        data-player={playerName}>
        <div class="button-content">
          {playerName}
          <span class={`racket${index === 1 ? ' reverse' : ''}`}>🎾</span>
        </div>
      </Button>
    {/each}
  </div>

  <p class="score">{scoreDisplay}</p>

  {#if isMatchedFinished}
    <p>Match is finished!</p>
    <Button on:click={handleNewGameClick}>New game</Button>
  {/if}
</div>
