<script lang="ts">
  import { fade } from 'svelte/transition'
  import {
    relationsStore as relations,
    tagsStore,
    nextOperations,
    prevOperations,
    runOperation,
    undoOperation,
  } from './stores'

  let key = 0
</script>

<div class="dev">
  <div class="flex gap-4 justify-between">
    <div class="flex">
      <button on:click={undoOperation} disabled={!$prevOperations.length}>Undo</button>
      <button on:click={runOperation} disabled={!$nextOperations.length}>Redo</button>
    </div>

    <form action="?/reset-data" method="post" on:submit={() => (key = Math.random())}>
      <button>Reset data</button>
    </form>
  </div>

  <div class="flex gap-8">
    <div>
      <h3>Next operations</h3>
      {#key $nextOperations}
        <pre in:fade>{JSON.stringify($nextOperations, null, 2)}</pre>
      {/key}
    </div>

    <div>
      <h3>Prev operations</h3>
      {#key $prevOperations}
        <pre in:fade>{JSON.stringify($prevOperations, null, 2)}</pre>
      {/key}
    </div>

    <div>
      <h3>All tags</h3>
      {#key $tagsStore}
        <pre in:fade>{JSON.stringify($tagsStore, null, 2)}</pre>
      {/key}
    </div>

    <div>
      <h3>All relations</h3>
      {#key $relations}
        <pre in:fade>{JSON.stringify($relations, null, 2)}</pre>
      {/key}
    </div>
  </div>
</div>

<style lang="postcss">
  button {
    @apply bg-emerald-200  px-4 py-2;
    &:disabled {
      @apply opacity-50;
    }
  }
  .dev {
    @apply grid gap-8;
    @apply bg-emerald-100 p-8 text-emerald-800 text-xs;
  }
  h3 {
    @apply font-bold font-mono opacity-80 mb-2;
  }
</style>
