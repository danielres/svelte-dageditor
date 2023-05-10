<script lang="ts">
  import type { TreeStore } from './stores'

  export let tree: TreeStore

  const { commands, tags, relations } = tree
  const { history } = commands
</script>

<div class="grid grid-cols-3">
  <div class="grid gap-8 h-fit">
    <div>
      <h3>Commands</h3>
      <pre class="text-xs">{JSON.stringify($commands, null, 2)}</pre>
    </div>

    <div>
      <h3>History</h3>
      <pre class="text-xs">{JSON.stringify($history, null, 2)}</pre>
    </div>
  </div>

  <div>
    <h3>Tags</h3>
    <pre class="text-xs">{JSON.stringify($tags, null, 2)}</pre>
  </div>

  <div>
    <h3>Relations</h3>
    <pre class="text-xs">{JSON.stringify($relations, null, 2)}</pre>
  </div>
</div>
