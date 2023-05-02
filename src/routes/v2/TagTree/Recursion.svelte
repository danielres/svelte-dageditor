<script lang="ts">
  import type { NestedTag } from './types'

  import { flash } from '../actions/flash'
  import { nextOperations, runOperation } from './stores'

  export let parentId: string
  export let tags: NestedTag[]
</script>

<ul
  data-parent-id={parentId}
  draggable={true}
  on:dragover|preventDefault
  on:dragstart|self={(e) => {
    e.dataTransfer?.setData('text/plain', JSON.stringify({ id: parentId, from: parentId }))
  }}
  on:drop|self={async (e) => {
    const data = e.dataTransfer?.getData('text/plain')
    if (!data) return
    const { id, from } = JSON.parse(data)
    $nextOperations = [{ tag: id, from, to: parentId }]
    runOperation()
  }}
>
  {#each tags as tag (tag.name)}
    <li
      use:flash
      draggable={true}
      on:dragover|preventDefault
      on:dragstart|self={(e) => {
        e.dataTransfer?.setData('text/plain', JSON.stringify({ id: tag.id, from: parentId }))
      }}
      on:drop|self={async (e) => {
        const data = e.dataTransfer?.getData('text/plain')
        if (!data) return
        const { id, from } = JSON.parse(data)
        $nextOperations = [{ tag: id, from, to: tag.id }]
        runOperation()
      }}
    >
      {tag.name}
      {#if tag.children.length}
        <svelte:self tags={tag.children} parentId={tag.id} />
      {/if}
    </li>
  {/each}
</ul>
