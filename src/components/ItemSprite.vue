<template>
    <div class="item-img">
        <div class="img">
            <i class="icon" :class="'icon-'+slug"></i>
        </div>
    </div>
</template>

<style>
  .item-img .img .icon {
    transform: scale(2);
    image-rendering: crisp-edges;
  }
</style>

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