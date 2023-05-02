<script lang="ts">
  import { flash } from './actions/flash'
  import type { NestedTag } from './stores/getNestedDescendants'

  export let tags: NestedTag[]
</script>

<ul use:flash>
  {#each tags as tag (tag.name)}
    <li>
      {tag.name}
      {#if tag.children.length}
        <svelte:self tags={tag.children} />
      {/if}
    </li>
  {/each}
</ul>

<style lang="postcss">
  :global(ul ul) {
    @apply px-6 py-1 border-l border-gray-200;
  }
</style>
