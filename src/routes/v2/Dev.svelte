<script lang="ts">
</script>

<div class="dev">
  <form action="?/reset-data" method="post">
    <button>Reset data</button>
  </form>

  <code>All operations</code>
  <!-- <pre>
    {JSON.stringify($opsStore, null, 2)}
  </pre> -->

  <hr />

  <code>All tags</code>
  <!-- <pre>
    {JSON.stringify($allTags, null, 2)}
  </pre> -->
</div>

<style lang="postcss">
  button {
    @apply bg-emerald-200  px-4 py-2;
  }
  .dev {
    @apply grid gap-4;
    @apply bg-emerald-100 p-8 text-emerald-800 text-xs;
  }

  hr {
    @apply border border-emerald-800/20;
  }
</style>
