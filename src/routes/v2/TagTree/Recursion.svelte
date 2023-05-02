<script lang="ts">
  import type { NestedTag } from './types'

  import { flash } from '../actions/flash'

  export let parentId: string
  export let tags: NestedTag[]
</script>

<ul use:flash data-parent-id={parentId}>
  {#each tags as tag (tag.name)}
    <li>
      {tag.name}
      {#if tag.children.length}
        <svelte:self tags={tag.children} parentId={tag.id} />
      {/if}
    </li>
  {/each}
</ul>

<style lang="postcss">
  :global(ul ul) {
    @apply px-6 py-1 border-l border-gray-200;
  }
</style>
