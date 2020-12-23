<template>
  <div class="item-img">
    <div class="img">
      <i
        class="icon"
        :class="'icon-'+slug"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Sprite",
  props: {
    slug: {
      type: String,
      required: true,
    }
  }
}
</script>

<style>
.item-img .img .icon {
  transform: scale(2);
  image-rendering: pixelated;
}
</style>