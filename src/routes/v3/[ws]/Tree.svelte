<script lang="ts">
  import type { TreeStore } from './stores'

  import Branch from './Branch.svelte'
  import './tree.css'

  export let tree: TreeStore
</script>

<div class="tree">
  <Branch branch={$tree} {tree} />
</div>
