<script lang="ts">
  import type { PageData } from './$types'

  import Dev from './Dev.svelte'
  import Tree from './Tree.svelte'
  import { makeTreeStore, relationsStore, tagsStore } from './stores'

  export let data: PageData

  $tagsStore = data.tags
  $relationsStore = data.relations
  const tree = makeTreeStore('<root>')
</script>

<div class="grid grid-cols-2">
  <main>
    <Tree tag={$tree} />
  </main>

  <aside class="py-4 px-8 bg-emerald-200 text-emerald-800">
    <Dev />
  </aside>
</div>
