<script lang="ts">
  import type { LayoutData } from './$types'

  export let data: LayoutData

  const { workspaces } = data
</script>

<nav>
  <div>Workspaces:</div>
  <ul>
    {#each workspaces as ws}
      <li><a href="/v3/{ws.name}">{ws.name}</a></li>
    {/each}
  </ul>
</nav>

<slot />

<style lang="postcss">
  nav {
    @apply flex items-baseline px-8;
    @apply bg-slate-300;

    ul {
      @apply flex items-baseline;
      li {
        a {
          @apply py-2 px-4 block font-bold;
          @apply text-slate-600 bg-transparent transition-all;
          &:hover {
            @apply text-slate-800 bg-slate-200;
          }
        }
      }
    }
  }
</style>
