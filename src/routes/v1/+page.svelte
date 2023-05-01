<script lang="ts">
  import type { PageData } from './$types'

  import { enhance } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import { fade } from 'svelte/transition'
  import { opsStore, opsStoreOptimized } from './$tagTree'
  import Dev from './Dev.svelte'
  import TagTree from './TagTree.svelte'

  export let data: PageData
  let key = 0
</script>

<Dev />

<form
  method="post"
  use:enhance={() => () => {
    opsStore.reset()
    invalidateAll()
    key = Math.random()
    // console.log('finished')
  }}
  action="?/apply-operations"
>
  <input type="hidden" name="operations" value={JSON.stringify($opsStoreOptimized)} />
  <button>Save</button>
</form>

{key}

{#key key}
  <div in:fade>
    <TagTree tags={data.tags} parentId={'<root>'} />
  </div>
{/key}
