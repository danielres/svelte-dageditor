<script lang="ts">
  import type { SortableEvent } from 'sortablejs'
  import type { Tag } from './types.d'

  import { onlyUnique } from '$lib/utils/array'
  import { getAncestors, getDescendants } from '$lib/utils/tags'
  import Sortable from 'sortablejs'
  import { onMount } from 'svelte'
  import { allTags, opsStore } from './$tagTree'

  export let parentId: string
  export let tags: Tag[]

  if ($allTags.length === 0) $allTags = tags

  export let depth = 0

  let sortableEl: HTMLElement

  onMount(() => {
    const s = Sortable.create(sortableEl, {
      group: { name: 'nested' },
      animation: 150,
      onMove: (e) => {
        const draggedId = e.dragged.dataset.id
        const relatedId = e.related.dataset.id

        const isSame = draggedId === relatedId || relatedId === undefined
        if (isSame) console.log('!! dropped on itself')
      },

      onEnd: function (e: SortableEvent) {
        const tagId = e.clone.dataset.id
        const fromId = e.from.dataset.parentId
        const toId = e.to.dataset.parentId

        if (!tagId || !fromId || !toId) return

        if (tagId === toId) {
          console.log('!! dropped on itself')
          return cancelDrop(e)
        }

        opsStore.add({ tag: tagId, from: fromId, to: toId })
      },
    })

    function cancelDrop(e: SortableEvent) {
      // evt.to.removeChild(evt.item) // Remove the item from the new list (to)
      e.from.insertBefore(e.item, e.from.children[e.oldIndex ?? 0])
    }
  })
</script>

<ul bind:this={sortableEl} data-parent-id={parentId}>
  {#each tags.filter((t) => t.parentId === parentId) as tag (tag.name)}
    <li data-id={tag.id} data-parent-id={parentId} data-name={tag.name}>
      {tag.name}
      <code>
        <small style="color: red">
          {getAncestors(tags, tag.id)
            .map((t) => t.id)
            .filter(onlyUnique)
            .sort()}
        </small>
      </code>

      <code>
        <small style="color:green">
          {getDescendants(tags, tag.id)
            .map((t) => t.id)
            .filter(onlyUnique)
            .sort()}
        </small>
      </code>
      {#if depth < 10}
        <svelte:self {tags} parentId={tag.id} depth={depth + 1} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  :global(.sortable-chosen) {
    color: green;
  }
  :global(.sortable-drag) {
    display: none;
    border-top: 1px solid blue;
  }
</style>
