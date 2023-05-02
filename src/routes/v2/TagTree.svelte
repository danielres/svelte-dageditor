<script lang="ts">
  import type { Relation, Tag } from './TagTree/types'

  import Recursion from './TagTree/Recursion.svelte'
  import { relationsStore, tagsStore, makeTagTreeStore } from './TagTree/stores'

  export let tags: Tag[]
  export let relations: Relation[]
  export let rootId: string

  $tagsStore = tags
  $relationsStore = relations

  const tagTree = makeTagTreeStore(rootId)
</script>

<div>
  <Recursion tags={$tagTree} parentId={rootId} />
</div>

<style lang="postcss">
  div :global(ul) {
    @apply px-6 py-1 border-l border-gray-200;
  }
</style>
