<script lang="ts">
  import TextField from "smelte/src/components/TextField";
  import Button from "smelte/src/components/Button";
  import { createEventDispatcher } from "svelte";

  const PLAYER_1_DEFAULT_NAME = "Player 1";
  const PLAYER_2_DEFAULT_NAME = "Player 2";
  let player1Name: string;
  let player2Name: string;
  let error: string | undefined;
  $: error =
    player1Name === PLAYER_2_DEFAULT_NAME
      ? `Player 1 must not be called ${PLAYER_2_DEFAULT_NAME}`
      : player2Name === PLAYER_1_DEFAULT_NAME
      ? `Player 2 must not be called ${PLAYER_1_DEFAULT_NAME}`
      : player1Name && player2Name && player1Name === player2Name
      ? "Players must have different names"
      : undefined;
  const dispatch = createEventDispatcher();

  const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = () => {
    if (error) {
      return;
    }
    dispatch("setPlayerNames", {
      player1Name: player1Name || "Player 1",
      player2Name: player2Name || "Player 2",
    });
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <p>Please set player names</p>
  <TextField label="Player 1" bind:value={player1Name} />
  <TextField label="Player 2" bind:value={player2Name} />
  {#if error}
    <p>{error}</p>
  {/if}
  <Button>Start game</Button>
</form>
