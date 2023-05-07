<script lang="ts">
  import { fade } from 'svelte/transition'
  import type { Branch, TreeStore } from './stores'

  export let branch: Branch
  export let depth = 0
  export let tree: TreeStore
  export let root = false

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

<div in:fade class="depth-{depth}" class:root>
  {#if isAllowedDropTarget}
    <span
      class="name"
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
