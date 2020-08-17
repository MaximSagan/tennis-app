<script lang="ts">
  import "smelte/src/tailwind.css";
  import PlayerNameInput from "./PlayerNameInput.svelte";
  import { Match } from "./Match";
  import MatchBoard from "./MatchBoard.svelte";

  let match: Match | null;

  const handleSetPlayerNames = (
    event: CustomEvent<{ player1Name: string; player2Name: string }>
  ) => {
    const { detail } = event;
    match = new Match(detail.player1Name, detail.player2Name);
  };
</script>

<style>
  main {
    height: 100vh;
    display: grid;
    place-items: center;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>

<main>

  {#if match}
    <MatchBoard {match} />
  {:else}
    <PlayerNameInput on:setPlayerNames={handleSetPlayerNames} />
  {/if}

</main>
