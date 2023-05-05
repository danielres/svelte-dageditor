<script lang="ts">
  import Dev from './Dev.svelte'
  import Tree from './Tree.svelte'
  import { makeTreeStore, relationsStore, tagsStore } from './stores'

  export let data

  const { tree, undo, redo, undos, redos } = makeTreeStore('<root>', data.tags, data.relations)
</script>

<div class="grid grid-cols-[2fr_4fr]">
  <main class="py-4 px-8 grid gap-8 h-fit">
    <div>
      <button on:click={undo} disabled={!$undos}>Undo</button>
      <button on:click={redo} disabled={!$redos}>Redo</button>
    </div>

    <div>
      <Tree tag={$tree} />
    </div>
  </main>

  <aside class="py-4 px-8 bg-emerald-200 text-emerald-800">
    <Dev />
  </aside>
</div>

<style lang="postcss">
  button {
    @apply text-sm text-gray-600 bg-gray-200 rounded opacity-75;
    @apply px-2 py-1;
    @apply transition-opacity;
    &:disabled {
      @apply opacity-25;
    }
    &:not(:disabled) {
      @apply cursor-pointer;
      &:hover {
        @apply opacity-100;
      }
    }
  }
</style>
