<script lang="ts">
  import { makeTreeStore } from '$lib/components/stores'
  import Dev from '$lib/components/Dev.svelte'
  import Tree from '$lib/components/Tree.svelte'
  import '$lib/components/tree.postcss'

  export let data

  const tree = makeTreeStore('<root>', data.nodes, data.relations)
  const { undo, redo, undos, redos } = tree.commands
</script>

<div class="grid grid-cols-[1fr_2fr]">
  <main class="py-4 px-8 grid gap-8 h-fit">
    <div>
      <button on:click={undo} disabled={!$undos}>Undo</button>
      <button on:click={redo} disabled={!$redos}>Redo</button>
    </div>

    <Tree {tree} root={true} />
  </main>

  <aside class="py-4 px-8 bg-emerald-200 text-emerald-800">
    <Dev {tree} />
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
