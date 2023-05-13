<script lang="ts">
  import type { TreeStore } from '$lib/components/stores'

  export let tree: TreeStore

  const { commands, tags, relations } = tree
  const { history } = commands
</script>

<div class="grid grid-cols-3">
  <section class="grid gap-8 h-fit">
    <section>
      <h3>Commands</h3>
      <pre>{JSON.stringify($commands, null, 2)}</pre>
    </section>

    <section>
      <h3>History</h3>
      <pre>{JSON.stringify($history, null, 2)}</pre>
    </section>
  </section>

  <section>
    <h3>Tags</h3>
    <pre>{JSON.stringify($tags, null, 2)}</pre>
  </section>

  <section>
    <h3>Relations</h3>
    <pre>{JSON.stringify($relations, null, 2)}</pre>
  </section>
</div>

<style lang="postcss">
  pre {
    @apply text-xs leading-tight;
  }
  section {
    @apply overflow-x-hidden;
  }
</style>
