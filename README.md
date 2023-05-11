## Example usage

```svelte
<script>
  // import editable DAG tree logic (stores, commands, etc.):
  import { makeTreeStore } from '@danielres/svelte-dageditor'

  // import the Tree component:
  import { Tree } from '@danielres/svelte-dageditor'

  // import default styles:
  import '@danielres/svelte-dageditor/styles.css'

  // Provide nodes and relations (could be fetched from a server / db):
  const data = {
    nodes: [
      { name: '<root>', id: '<root>' },
      { name: 'tag1', id: 'tag1' },
      { name: 'tag2', id: 'tag2' },
    ],
    relations: [
      { id: 'aaa', parentId: '<root>', childId: 'tag1' },
      { id: 'aaa', parentId: '<root>', childId: 'tag2' },
    ],
  }

  // Generate the tree stores
  // The first argument ("<root>" in this example) should be the id of the node that we wish to use as the root:
  const tree = makeTreeStore('<root>', data.nodes, data.relations)

  // Optional: get the commands store (for debugging):
  const { commands } = tree

  // Optional: get the undo/redo actions
  // Optional: get the undos/redos stores
  // Optional: get the history store
  const { undo, redo, undos, redos, history } = commands
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-2">
    <!-- Undo / redo buttons: -->
    <button on:click={undo} disabled={!$undos}>Undo ({$undos})</button>
    <button on:click={redo} disabled={!$redos}>Redo ({$redos})</button>
  </div>
</div>

<div class="grid grid-cols-2">
  <main class="py-4 px-8 grid gap-8 h-fit">
    <!-- The DAG rendered as an editable tree -->
    <!-- root={true} is for aesthetic purposes, and allows to render the root node differently  -->
    <Tree {tree} root={true} />
  </main>
</div>

<!-- Optional: inspect the internals (commands, history) -->
<div>
  <h2>Commands:</h2>
  <pre>{JSON.stringify($commands, null, 2)}</pre>

  <h2>History:</h2>
  <pre>{JSON.stringify($history, null, 2)}</pre>
</div>

<style lang="postcss">
  button {
    @apply text-sm text-gray-600 bg-gray-200 rounded opacity-75;
    @apply px-2 py-1;
    @apply transition-opacity;
  }
  button:disabled {
    @apply opacity-25;
  }
  button:not(:disabled) {
    @apply cursor-pointer;
  }
  button:not(:disabled):hover {
    @apply opacity-100;
  }
</style>
```
