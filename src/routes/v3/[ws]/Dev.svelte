<script>
  import { commandsStore, relationsStore, tagsStore, historyStore } from './stores'
</script>

<div class="grid grid-cols-3">
  <div class="grid gap-8 h-fit">
    <div>
      <h3>Commands</h3>
      <pre class="text-xs">{JSON.stringify($commandsStore, null, 2)}</pre>
    </div>

    <div>
      <h3>History</h3>
      <pre class="text-xs">{JSON.stringify($historyStore, null, 2)}</pre>
    </div>
  </div>

  <div>
    <h3>Tags</h3>
    <pre class="text-xs">{JSON.stringify($tagsStore, null, 2)}</pre>
  </div>

  <div>
    <h3>Relations</h3>
    <pre class="text-xs">{JSON.stringify($relationsStore, null, 2)}</pre>
  </div>
</div>
