<script lang="ts">
  import type { DagStore } from '$lib/components/stores'

  import Branch from '$lib/components/Branch.svelte'

  let className = 'danielres-dageditor'

  export { className as class }
  export let dag: DagStore
  export let root = true
</script>

<div class={className}>
  <Branch branch={$dag} {dag} {root} />
</div>
