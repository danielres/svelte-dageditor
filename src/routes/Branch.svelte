<script lang="ts">
  import type { Branch, TreeStore } from './stores'

  import { fade } from 'svelte/transition'
  import Icon from './Icon.svelte'

  export let branch: Branch

  export let depth = 0
  export let tree: TreeStore
  export let parent: Branch | undefined = undefined
  export let root = false

  const { dragged, commands } = tree
  const { ids: draggedIds } = dragged

  $: isAllowedDropTarget = !$draggedIds.includes(branch.id)

  function dataTransfer(e: DragEvent) {
    return {
      set: (data: { from: string }) => e.dataTransfer?.setData('text/plain', JSON.stringify(data)),
      get: (): { from?: string } => JSON.parse(e.dataTransfer?.getData('text/plain') || '{}'),
    }
  }

  function onDrop(e: DragEvent) {
    const data = dataTransfer(e).get()
    if (!data.from || !$dragged) return
    const { id } = $dragged
    dragged.clear()
    commands.move({ id, from: data.from, to: branch.id })
  }

  let action: 'add' | 'rename' | null = null

  const actions = {
    rename: {
      value: branch.name,
      submit() {
        commands.rename({ id: branch.id, from: branch.name, to: this.value })
        action = null
      },
      cancel() {
        this.value = branch.name
        action = null
      },
    },
    add: {
      value: '',
      submit() {
        commands.insert({ parentId: branch.id, name: this.value })
        this.value = ''
        action = null
      },
      cancel() {
        this.value = ''
        action = null
      },
    },
    copy: {
      linked: {
        add() {
          if (!parent) return
          commands.copy.linked.add({ id: branch.id, parentId: parent.id })
        },
        remove() {
          if (!parent) return
          commands.copy.linked.remove({ id: branch.id, parentId: parent.id })
        },
      },
    },
    delete() {
      commands.delete({ id: branch.id })
    },
  }

  let isOpen = true
  function toggleOpen() {
    if (branch.children.length && !root) isOpen = !isOpen
  }

  const relations = tree.relations
  $: hasLinkedCopy = $relations.filter((r) => r.childId === branch.id)?.length > 1
</script>

<div in:fade class="depth-{depth}" class:root class:closed={!isOpen}>
  {#if action === 'rename'}
    <form on:submit={() => actions.rename.submit()} class="name">
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" bind:value={actions.rename.value} autofocus />
    </form>
  {:else}
    <button
      class="name"
      class:drop-allowed={$dragged && isAllowedDropTarget}
      class:drop-forbidden={$dragged && !isAllowedDropTarget}
      on:dragover={isAllowedDropTarget ? (e) => e.preventDefault() : undefined}
      on:drop={isAllowedDropTarget ? onDrop : undefined}
      on:click={toggleOpen}
    >
      {branch.name}
    </button>
  {/if}

  {#if !$dragged}
    <span class="actions" class:autohide={!action}>
      <span class="w-0 opacity-0 pointer-events-none">_</span>
      {#if action === 'rename'}
        <button on:click={() => actions.rename.submit()}><Icon kind="submit" /></button>
        <button on:click={() => actions.rename.cancel()}><Icon kind="cancel" /></button>
      {:else}
        <button on:click={() => (action = 'add')}><Icon kind="add" /></button>
        {#if depth > 0}
          <button on:click={() => (action = 'rename')}><Icon kind="rename" /></button>
          <button on:click={() => actions.copy.linked.add()}><Icon kind="linked-copy" /></button>
          <button><Icon kind="go" /></button>
          {#if hasLinkedCopy}
            <button on:click={() => actions.copy.linked.remove()}>
              <Icon kind="linked-copy-break" />
            </button>
          {:else}
            <button on:click={() => actions.delete()} class="danger"><Icon kind="delete" /></button>
          {/if}
        {/if}
      {/if}
    </span>
  {/if}

  <ul>
    {#if action === 'add'}
      <li in:fade>
        <form on:submit={() => actions.add.submit()} class="name">
          <!-- svelte-ignore a11y-autofocus -->
          <input type="text" bind:value={actions.add.value} autofocus />
        </form>
        <span class="actions">
          <span class="w-0 opacity-0 pointer-events-none">_</span>
          <button on:click={() => actions.add.submit()}><Icon kind="submit" /></button>
          <button on:click={() => actions.add.cancel()}><Icon kind="cancel" /></button>
        </span>
      </li>
    {/if}

    {#if isOpen}
      {#each branch.children as childBranch}
        <li
          draggable={true}
          on:dragstart|self={(e) => {
            dragged.set(childBranch)
            dataTransfer(e).set({ from: branch.id })
          }}
          on:dragend|self={() => dragged.clear()}
        >
          <svelte:self parent={branch} branch={childBranch} depth={depth + 1} {tree} />
        </li>
      {/each}
    {/if}
  </ul>
</div>
