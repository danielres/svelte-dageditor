<script lang="ts">
  import type { PageData } from './$types'

  import TagTree from './TagTree.svelte'
  import { nextOperations } from './TagTree/stores'

  export let data: PageData

  $nextOperations = [
    { tag: 't1', from: '<root>', to: 't2' },
    { tag: 't11', from: 't1', to: '<root>' },
  ]
</script>

<TagTree tags={data.tags} relations={data.relations} rootId="<root>" />
