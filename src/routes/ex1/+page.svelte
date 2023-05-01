<script lang="ts">
  // Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { accordion } from './accordion'

  let baskets = [
    { name: 'Basket 1', items: ['Orange', 'Pineapple'] },
    { name: 'Basket 2', items: ['Banana', 'Apple'] },
  ]

  let hoveringOverBasket: string | null

  function dragStart(
    event: DragEvent & { currentTarget: EventTarget & HTMLLIElement },
    basketIndex: number,
    itemIndex: number
  ) {
    const data: Data = { basketIndex, itemIndex }
    event.dataTransfer?.setData('text/plain', JSON.stringify(data))
  }

  type Data = { basketIndex: number; itemIndex: number }

  function drop(
    event: DragEvent & { currentTarget: EventTarget & HTMLUListElement },
    basketIndex: number
  ) {
    const json = event.dataTransfer?.getData('text/plain')
    if (!json) return
    const data = JSON.parse(json) as Data
    // Remove the item from one basket.
    const [item] = baskets[data.basketIndex].items.splice(data.itemIndex, 1)
    // Add the item to the drop target basket.
    baskets[basketIndex].items.push(item)
    baskets = baskets

    hoveringOverBasket = null
  }

  let counter = 0
</script>

{counter}

<div class="grid gap-8">
  {#each baskets as basket, basketIndex (basket)}
    <div>
      <h3>{basket.name}</h3>
      <ul
        use:accordion={basket.items.length}
        class="transition-all"
        class:hovering={hoveringOverBasket === basket.name}
        on:dragleave={() => {
          counter = counter - 1
          if (counter === 0) hoveringOverBasket = null
        }}
        on:dragenter={() => {
          counter = counter + 1
          hoveringOverBasket = basket.name
        }}
        on:drop|preventDefault={(event) => {
          counter = 0
          drop(event, basketIndex)
        }}
        on:dragover|preventDefault
      >
        {#each basket.items as item, itemIndex (item)}
          <div class="item" animate:flip={{ duration: 400 }}>
            <li
              transition:fade|local
              draggable={true}
              on:dragstart={(event) => dragStart(event, basketIndex, itemIndex)}
            >
              {item}
            </li>
          </div>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style lang="postcss">
  .hovering {
    @apply bg-orange-200;
  }

  .item {
    display: inline; /* required for flip to work */
  }

  li {
    @apply bg-gray-100 border border-gray-400 cursor-pointer inline-block p-2;
  }
  li:hover {
    background: orange;
    color: white;
  }
  ul {
    @apply flex gap-4 h-auto p-4 border border-gray-300 transition-all;
  }
</style>
