<script lang="ts">
  import type { PageData } from './$types'

  import TagTree from './TagTree.svelte'

  export let data: PageData
</script>

<TagTree tags={data.tags} relations={data.relations} rootId="<root>" />
