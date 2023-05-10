<script lang="ts">
  import type { TreeStore } from '$lib/components/stores'

  import Branch from '$lib/components/Branch.svelte'

  let className = 'tree'

  export { className as class }
  export let tree: TreeStore
  export let root = true
</script>

<div class={className}>
  <Branch branch={$tree} {tree} {root} />
</div>
