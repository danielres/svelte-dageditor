<script lang="ts">
  import '../app.postcss'
</script>

<div class="all">
  <nav>
    <ul>
      <li><a href="/v1">v1</a></li>
      <li><a href="/v2">v2</a></li>
      <li><a href="/v3">v3</a></li>
    </ul>

    <ul>
      <li><a href="/ex1">Example1</a></li>
      <li><a href="/ex2">Example2 (minimal)</a></li>
    </ul>
  </nav>

  <main>
    <slot />
  </main>
</div>

<style lang="postcss">
  .all {
    @apply text-slate-600;
  }
  nav {
    @apply bg-slate-300 px-4 flex justify-between;
    ul {
      @apply flex;
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
