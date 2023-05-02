<script lang="ts">
  import Dev from './TagTree/Dev.svelte'
</script>

<div class="grid grid-cols-2">
  <div class="p-8">
    <slot />
  </div>

  <div>
    <Dev />
  </div>
</div>
