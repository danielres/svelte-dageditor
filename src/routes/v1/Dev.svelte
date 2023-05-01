<script>
  import { allTags, opsStore, opsStoreOptimized, opsStoreAllowed } from './$tagTree'
</script>

<div class="dev">
  <form action="?/reset-data" method="post">
    <button>Reset data</button>
  </form>

  <code>All operations</code>
  <pre>
    {JSON.stringify($opsStore, null, 2)}
  </pre>

  <hr />

  <code>Allowed operations</code>
  <pre>
    {JSON.stringify($opsStoreAllowed, null, 2)}
  </pre>

  <hr />

  <code>Optimized</code>
  <pre>
    {JSON.stringify($opsStoreOptimized, null, 2)}
  </pre>

  <hr />

  <code>All tags</code>
  <pre>
    {JSON.stringify($allTags, null, 2)}
  </pre>
</div>

<style lang="postcss">
  .dev {
    @apply absolute top-0 right-0 bottom-0 bg-emerald-100 p-8 overflow-auto w-1/2 text-emerald-800 text-xs;
  }
</style>
