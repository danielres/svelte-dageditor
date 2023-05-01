<script lang="ts">
  import { fade } from 'svelte/transition'
  import {
    allRelations,
    allTags,
    nextOperations,
    prevOperations,
    runOperation,
    undoOperation,
  } from './stores'

  let key = 0
</script>

<div class="dev">
  <div class="flex gap-4">
    <form action="?/reset-data" method="post" on:submit={() => (key = Math.random())}>
      <button>Reset data</button>
    </form>

    <button on:click={runOperation}>Run next operation</button>
    <button on:click={undoOperation}>Undo last operation</button>
  </div>

  <div class="flex gap-8">
    <div>
      <h3>All tags</h3>
      {#key $allTags}
        <pre in:fade>{JSON.stringify($allTags, null, 2)}</pre>
      {/key}
    </div>

    <div>
      <h3>All relations</h3>
      {#key $allRelations}
        <pre in:fade>{JSON.stringify($allRelations, null, 2)}</pre>
      {/key}
    </div>

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
  </div>
</div>

<style lang="postcss">
  button {
    @apply bg-emerald-200  px-4 py-2;
  }
  .dev {
    @apply grid gap-8;
    @apply bg-emerald-100 p-8 text-emerald-800 text-xs;
  }
  h3 {
    @apply font-bold font-mono opacity-80 mb-2;
  }
</style>
