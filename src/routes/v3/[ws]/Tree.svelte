<script lang="ts">
  import type { DragEventHandler } from 'svelte/elements'
  import type { TagWithChildren } from './stores'

  import { derived } from 'svelte/store'
  import { commandsStore, draggedStore, getBranchIds } from './stores'
  import './tree.css'

  const MAX_DEPTH = 10

  export let tag: TagWithChildren
  export let depth = 0

  const isAllowedDropTarget = derived(
    draggedStore,
    ($draggedStore) => !getBranchIds($draggedStore).includes(tag.id)
  )

  type Command = { kind: 'move'; id: string; from: string; to: string }
  const commands: Command[] = []

  const dataTransfer = (e: DragEvent) => ({
    set: (data: { from: string }) => e.dataTransfer?.setData('text/plain', JSON.stringify(data)),
    get: (): { from?: string } => JSON.parse(e.dataTransfer?.getData('text/plain') || '{}'),
  })

  const onDrop: DragEventHandler<HTMLElement> = async (e) => {
    const data = dataTransfer(e).get()
    if (!data.from || !$draggedStore) return
    const { id } = $draggedStore
    $draggedStore = null
    const command = { kind: 'move' as const, id, from: data.from, to: tag.id }
    commandsStore.add(command).exec()
  }
</script>

<span
  class="label {depth ? '' : 'root'}"
  on:dragover|preventDefault
  on:drop={onDrop}
  class:drop-allowed={$draggedStore && $isAllowedDropTarget}
  class:drop-forbidden={$draggedStore && !$isAllowedDropTarget}
>
  {tag.name}
</span>

{#if tag.children.length && depth < MAX_DEPTH}
  <ul class="tree">
    {#each tag.children as child}
      <li
        draggable={true}
        on:dragstart|self={(e) => {
          $draggedStore = child
          dataTransfer(e).set({ from: tag.id })
        }}
        on:dragend|self={() => ($draggedStore = null)}
      >
        <svelte:self tag={child} depth={depth + 1} />
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  .label {
    @apply rounded px-1 py-0.5 mb-1.5 inline-block;
    @apply transition-all duration-500;
    @apply border-2 border-black/50;
    @apply text-black font-bold text-sm;
    @apply opacity-40;

    &.root {
      @apply w-6 h-6 rounded-full text-transparent ml-0.5 bg-gray-400 border-2 border-transparent;
      &.drop-allowed {
        @apply bg-emerald-500/40 opacity-100 border-2;
      }
    }

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
  }
</style>
