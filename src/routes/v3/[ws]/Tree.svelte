<script lang="ts">
  import type { DragEventHandler } from 'svelte/elements'
  import type { TagWithChildren } from './stores'

  import { derived } from 'svelte/store'
  import { commandsStore, draggedStore, getBranchIds } from './stores'

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
  on:dragover|preventDefault
  on:drop={onDrop}
  class:drop-allowed={$draggedStore && $isAllowedDropTarget}
  class:drop-forbidden={$draggedStore && !$isAllowedDropTarget}
>
  {tag.name}
</span>

{#if tag.children.length && depth < MAX_DEPTH}
  <ul>
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
  span {
    @apply px-2 -ml-2 py-1 rounded inline-block mb-1 leading-none;
    @apply transition-all duration-500;
  }
  li {
    @apply pl-8 border-l;
    :global(span) {
      cursor: grab;
      &:hover {
        @apply bg-slate-200 transition-all;
      }
    }
  }
  .drop-allowed {
    @apply bg-emerald-100 text-emerald-700;
  }
  .drop-forbidden {
    @apply opacity-25;
  }
</style>
