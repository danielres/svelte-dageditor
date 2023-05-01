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

<div class="grid gap-4 px-8 py-4">
  <div>
    <code class="text-xs bg-emerald-100 px-1 py-0.5 inline-block text-emerald-800">Key: {key}</code>
  </div>

  <form
    action="?/apply-operations"
    method="post"
    use:enhance={() => () => {
      opsStore.reset()
      invalidateAll()
      key = Math.random()
    }}
  >
    <input type="hidden" name="operations" value={JSON.stringify($opsStoreOptimized)} />
    <button class="bg-slate-200 hover:bg-slate-300 px-4 py-2 transition-colors">Save</button>
  </form>

  {#key key}
    <div in:fade>
      <TagTree tags={data.tags} parentId={'<root>'} />
    </div>
  {/key}
</div>

<style lang="postcss">
  /* your styles go here */
</style>
