<script lang="ts">
  import type { PageData } from './$types'

  import TagTree from './TagTree.svelte'
  import {
    allRelations,
    allTags,
    makeTagTreeStore,
    nextOperations as operationsQueue,
  } from './stores'

  export let data: PageData

  $allTags = data.tags
  $allRelations = data.relations
  $operationsQueue = [
    { tag: 't1', from: '<root>', to: 't2' },
    { tag: 't11', from: 't1', to: '<root>' },
  ]

  const tagTree = makeTagTreeStore('<root>')
</script>

<TagTree tags={$tagTree} />
