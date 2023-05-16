# @danielres/svelte-dageditor

An advanced editable DAG (directed acyclic graph) component for Svelte[Kit].

This is basically a treeview of interconnected nodes, with the ability to add, remove, rename, delete, and move nodes around. The major difference with a traditional tree structure, is that nodes can have multiple parents.

- [Preview video (Youtube)](https://www.youtube.com/watch?v=HDXNwqDPwAs)
- [Try it on Stackblitz!](https://stackblitz.com/edit/svelte-dageditor?file=src/App.svelte)

This allows to create flexible multi-dimensional datastructures/taxonomies/classification systems beyond the limitations of the more common flat or tree-like structures.

- No extra dependencies
- Written in TypeScript
- Supports Svelte 3 and SvelteKit
- Provides undo/redo
- Uses (svelte native) drag and drop
- Comes with default styles (copy [them](https://github.com/danielres/svelte-dageditor/blob/main/src/lib/components/tree.postcss) to your project and customize them as you wish)
- 9Kb (unpacked, all included)

## Disclaimer

This is an early alpha version, seems to work well. But it is not yet ready for production use.
Major breaking changes are expected.

## Installation

`npm install @danielres/svelte-dageditor`

or

`pnpm install @danielres/svelte-dageditor`

or

`yarn add @danielres/svelte-dageditor`

## Example usage

```svelte
<script>
  // import editable DAG tree logic (stores, commands, etc.):
  import { makeDagStore } from '@danielres/svelte-dageditor'

  // import the Tree component:
  import { Tree } from '@danielres/svelte-dageditor'

  // import default styles:
  import '@danielres/svelte-dageditor/dist/styles.css'

  import { onMount } from 'svelte'

  // Provide nodes and relations (could be fetched from a server / db)
  //   At the minimum you have to provide a root node as follows:
  //    const data = { nodes: [{ name: '<root>', id: '<root>' }], relations: [] }
  //   The name and id can be any string
  const data = {
    nodes: [
      { name: '<root>', id: '<root>' },
      { name: 'tag1', id: 'tag1' },
      { name: 'tag2', id: 'tag2' },
    ],
    relations: [
      { id: 'some-id-string1', parentId: '<root>', childId: 'tag1' },
      { id: 'some-id-string2', parentId: '<root>', childId: 'tag2' },
    ],
  }

  // Generate the editable tree stores.
  //   The first argument ("<root>" in this example) should be the
  //   id of a node that we wish to use as the root (top node)
  //   for the generated tree:
  const dag = makeDagStore('<root>', data.nodes, data.relations)

  const { commands } = dag

  // Optional: use undo/redo features
  // Optional: get the undos/redos counts
  // Optional: get the history store (containing previously executed commands)
  const { undo, redo, undos, redos, history } = commands

  onMount(() => {
    // All actions that can be done through the UI are also available programmatically.
    // Example: execute some commands:
    commands.rename({ id: 'tag1', to: 'tag1-renamed' })
    commands.rename({ id: 'tag2', to: 'tag2-renamed' })
    commands.move({ id: 'tag2', from: '<root>', to: 'tag1' })
  })
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-2">
    <button on:click={undo} disabled={!$undos}>Undo ({$undos})</button>
    <button on:click={redo} disabled={!$redos}>Redo ({$redos})</button>
  </div>
</div>

<div class="grid grid-cols-2">
  <main class="py-4 px-8 grid gap-8 h-fit">
    <!-- The DAG rendered as an editable tree -->
    <!-- root={true} allows to render the root node differently  -->
    <Tree {dag} root={true} />
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
