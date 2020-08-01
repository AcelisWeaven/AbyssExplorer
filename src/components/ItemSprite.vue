<template>
    <div class="item-img">
        <div class="img">
            <img
                    :src="`${publicPath}spritesheet-${sprite.sheet}.png`"
                    :style="{
                                'width': `${sprite.width}px`,
                                'height': `${sprite.height}px`,
                                'object-position': `-${sprite.x}px -${sprite.y}px`,
                            }"
                    alt=""
            >
        </div>
    </div>
</template>

<script>
    export default {
        name: "Sprite",
        props: {
            publicPath: {
                type: String,
                required: true,
            },
            sprite: {
                type: Object,
                required: true,
            }
        }
    }
</script>