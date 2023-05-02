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

<Recursion tags={$tagTree} parentId={rootId} />
