<script>
  import { opsStore, opsStoreOptimized } from './$tagTree'
</script>

<div class="dev">
  <form action="?/reset-data" method="post">
    <button>Reset data</button>
  </form>

  <pre>
    {JSON.stringify($opsStore, null, 2)}
  </pre>
  <hr />
  <pre>
    {JSON.stringify($opsStoreOptimized, null, 2)}
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
