<script context="module" lang="ts">
  import type { SortableEvent } from 'sortablejs'
</script>

<script lang="ts">
  import Sortable from 'sortablejs'
  import { onMount } from 'svelte'
  import { opsStore } from './$tagTree'

  export let parentId: string | null
  export let tags: {
    name: string
    id: string
    parentId: string | null
  }[]

  let sortableEl: HTMLElement

  const onEnd = (e: SortableEvent) => {
    const tag = e.clone.dataset.id
    const from = e.from.dataset.parentId ?? null
    const to = e.to.dataset.parentId ?? null
    if (!tag || from === to) return
    opsStore.add({ tag, from, to })
  }

  onMount(() => {
    const s = Sortable.create(sortableEl, {
      group: 'nested',
      onEnd: onEnd,
    })
  })
</script>

<ul bind:this={sortableEl} data-parent-id={parentId}>
  {#each tags.filter((t) => t.parentId === parentId) as tag}
    <li data-id={tag.id}>
      {tag.name} - {tag.id.slice(0, 5)}
      <svelte:self {tags} parentId={tag.id} />
    </li>
  {/each}
</ul>
