<script lang="ts">
  import { fade } from 'svelte/transition'
  import type { Branch, TreeStore } from './stores'

  export let branch: Branch
  export let depth = 0
  export let tree: TreeStore

  const { dragged, commands } = tree
  const { ids: draggedIds } = dragged

  $: isAllowedDropTarget = !$draggedIds.includes(branch.id)

  function dataTransfer(e: DragEvent) {
    return {
      set: (data: { from: string }) => e.dataTransfer?.setData('text/plain', JSON.stringify(data)),
      get: (): { from?: string } => JSON.parse(e.dataTransfer?.getData('text/plain') || '{}'),
    }
  }

  function onDrop(e: DragEvent) {
    const data = dataTransfer(e).get()
    if (!data.from || !$dragged) return
    const { id } = $dragged
    $dragged = null
    const command = { kind: 'move' as const, id, from: data.from, to: branch.id }
    commands.add(command).exec()
  }
</script>

<div in:fade>
  {#if isAllowedDropTarget}
    <span
      class="name"
      class:root={depth === 0}
      class:drop-allowed={$dragged && isAllowedDropTarget}
      class:drop-forbidden={$dragged && !isAllowedDropTarget}
      on:dragover|preventDefault
      on:drop={onDrop}
    >
      {branch.name}
    </span>
  {:else}
    <span
      class="name"
      class:root={depth === 0}
      class:drop-allowed={$dragged && isAllowedDropTarget}
      class:drop-forbidden={$dragged && !isAllowedDropTarget}
    >
      {branch.name}
    </span>
  {/if}

  <ul>
    {#each branch.children as childBranch}
      <li
        draggable={true}
        on:dragstart|self={(e) => {
          $dragged = childBranch
          dataTransfer(e).set({ from: branch.id })
        }}
        on:dragend|self={() => ($dragged = null)}
      >
        <svelte:self branch={childBranch} depth={depth + 1} {tree} />
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  .name {
    @apply rounded px-1 py-0.5 mb-1.5 inline-block;
    @apply transition-all duration-500;
    @apply border-2 border-black/50;
    @apply text-black font-bold text-sm;
    @apply opacity-40;

    &:not(.root) {
      cursor: grab;
      &:hover {
        @apply opacity-75;
      }
      &.drop-allowed {
        @apply bg-emerald-100/25 text-emerald-700/50 border-emerald-600/40 opacity-100;
      }
      &.drop-forbidden {
        @apply opacity-10;
      }
    }

    /* &.root {
      cursor: default;
      @apply cursor-not-allowed;
      &.drop-allowed {
        @apply bg-emerald-100/25 text-emerald-700/50 border-emerald-600/40 opacity-100;
      }
    } */

    &.root {
      cursor: default;
      @apply w-6 h-6 rounded-full text-transparent ml-0.5 bg-gray-400 border-2 border-transparent;
      &.drop-allowed {
        @apply bg-emerald-500/40 opacity-100 border-2;
      }
    }
  }
</style>
