<script lang="ts">
  import { tags } from '../../../db/schema'
  import Dev from './Dev.svelte'
  import Tree from './Tree.svelte'
  import { makeTreeStore } from './stores'

  export let data

  const tree = makeTreeStore('<root>', data.tags, data.relations)
  const { undo, redo, undos, redos } = tree.commands

  const t = tree.tags
  const r = tree.relations
  $: tree2 = makeTreeStore('t1', $t, $r)
</script>

<div class="grid grid-cols-2">
  <main class="py-4 px-8 grid gap-8 h-fit">
    <div>
      <button on:click={undo} disabled={!$undos}>Undo</button>
      <button on:click={redo} disabled={!$redos}>Redo</button>
    </div>

    <Tree {tree} root={true} />
    <Tree tree={tree2} root={false} />
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
