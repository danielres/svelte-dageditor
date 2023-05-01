<script lang="ts">
  type Item = { name: string }

  let basket1: Item[] = [
    { name: 'Orange' },
    { name: 'Pineapple' },
    { name: 'Banana' },
    { name: 'Apple' },
  ]

  let basket2: Item[] = []

  const byKey = (key: keyof Item) => (a: Item, b: Item) =>
    a[key] === b[key] ? 0 : a[key] > b[key] ? 1 : -1
</script>

<h2 class="text-lg">Minimal example</h2>

<div class="grid gap-4">
  <div>
    <h3>Basket 1</h3>

    <ul
      on:dragover|preventDefault
      on:drop={(e) => {
        const name = e.dataTransfer?.getData('text/plain')
        if (!name) return
        basket2 = basket2.filter((item) => item.name !== name)
        basket1 = [...basket1, { name }].sort(byKey('name'))
      }}
    >
      {#each basket1 as item}
        <li
          draggable={true}
          data-name={item.name}
          on:dragstart={(e) => {
            const name = e.currentTarget?.dataset?.name
            if (!name) return
            e.dataTransfer?.setData('text/plain', name)
          }}
        >
          {item.name}
        </li>
      {/each}
    </ul>
  </div>

  <div>
    <h3>Basket 2</h3>

    <ul
      on:dragover|preventDefault
      on:drop={(e) => {
        const name = e.dataTransfer?.getData('text/plain')
        if (!name) return
        basket1 = basket1.filter((item) => item.name !== name)
        basket2 = [...basket2, { name }].sort(byKey('name'))
        console.log('drop', name)
      }}
    >
      {#each basket2 as item}
        <li
          draggable={true}
          data-name={item.name}
          on:dragstart={(e) => {
            const name = e.currentTarget?.dataset?.name
            if (!name) return
            e.dataTransfer?.setData('text/plain', name)
          }}
        >
          {item.name}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  ul {
    @apply bg-gray-100 border border-gray-400 p-4 flex gap-4;
    li {
      @apply bg-gray-100 border border-gray-400 cursor-pointer inline-block p-2;
    }
  }
</style>
