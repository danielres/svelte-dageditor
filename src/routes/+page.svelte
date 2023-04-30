<script lang="ts">
  import type { PageData } from './$types'

  import { enhance } from '$app/forms'
  import { opsStoreOptimized } from './$tagTree'
  import Dev from './Dev.svelte'
  import TagTree from './TagTree.svelte'

  export let data: PageData
</script>

<Dev />

<form method="post" use:enhance>
  <input type="hidden" name="operations" value={JSON.stringify($opsStoreOptimized)} />
  <button>Save</button>
</form>

<div>
  <TagTree tags={data.tags} parentId={null} />
</div>
