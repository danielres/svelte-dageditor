<script lang="ts">
  import type { PageData } from './$types'

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

<pre class="text-xs leading-none">{JSON.stringify($tagTree, null, 2)}</pre>
