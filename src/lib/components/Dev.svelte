<script lang="ts">
  import type { DagStore } from '$lib/components/stores'

  export let dag: DagStore

  const { commands, nodes, relations, dragged } = dag
  const { history } = commands
</script>

<div class="grid grid-cols-3">
  <section class="grid gap-8 h-fit">
    <section>
      <h3>Dragged</h3>
      <pre>{JSON.stringify($dragged, null, 2)}</pre>
    </section>

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
    <h3>Nodes</h3>
    <pre>{JSON.stringify($nodes, null, 2)}</pre>
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
