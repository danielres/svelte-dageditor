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

<style>
  .dev {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    background: #ccc;
  }
</style>
