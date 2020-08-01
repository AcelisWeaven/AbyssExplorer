<template>
    <div class="item"
         :class="{
                    'is-active': isActive,
                    'is-hover': isHovered && !isPinned,
                    'is-pinned': isPinned,
                }"
    >
        <item-sprite :sprite="item.sprite" :public-path="publicPath"
             @mousedown.native="preparePinning()"
             @mouseup.native="handleRelease()"
             @mouseover.native="adjustHoverItem(item.slug, $event.target)"
             @mouseleave.native="isHovered = false"
        ></item-sprite>

        <item-content :item="item" :lang="lang" :public-path="publicPath"
             :style="isHovered ? tooltipStyle : {}"
        ></item-content>
    </div>
</template>

<script>
    import ItemSprite from "./ItemSprite";
    import ItemContent from "./ItemContent";

    export default {
        name: "ItemList",
        components: {
            ItemSprite,
            ItemContent,
        },
        data() {
            return {
                isActive: false,
                isHovered: false,
                isPinned: false,
                pinningTimeout: null,
                tooltipStyle: {},
            }
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
            lang: {
                type: String,
                required: true,
            },
            layout: {
                type: String,
                required: true,
            },
            publicPath: {
                type: String,
                required: true,
            },
        },
        methods: {
            adjustHoverItem(id, elem) {
                this.isHovered = true;
                const maxTooltipSize = {x: 200, y: 300}
                const rect = elem.getBoundingClientRect();
                const windowRect = {x: window.innerWidth, y: window.innerHeight}
                const left = rect.x + rect.width / 2 - maxTooltipSize.x / 2
                let tooltipStyle = {};
                if (left < 0) {
                    tooltipStyle.transform = `translateX(${-left}px)`
                } else if (left + maxTooltipSize.x > windowRect.x) {
                    tooltipStyle.transform = `translateX(${-(left + maxTooltipSize.x - windowRect.x)}px)`
                }
                const bottom = rect.y + rect.height + maxTooltipSize.y;
                if (bottom > windowRect.y) {
                    tooltipStyle.top = 'initial'
                    tooltipStyle.bottom = 'calc(100% + 10px)'
                }

                this.tooltipStyle = tooltipStyle;
            },
            preparePinning() {
                this.pinningTimeout = setTimeout(() => {
                    this.isPinned = !this.isPinned;
                    this.pinningTimeout = null;
                }, 200)
            },
            handleRelease() {
               // figure if we want to open a modal (short press) or pin an item (long press)
               if (this.pinningTimeout !== null) {
                   // modal
                   this.selectItem();
                   clearTimeout(this.pinningTimeout);
                   this.pinningTimeout = null;
               }
            },
            selectItem() {
                // only possible in compact mode, while not pinned
                if (this.layout !== 'compact' || this.isPinned) return;

                // avoids body scroll when modal is open
                const body = document.querySelector('.body');
                if (this.isActive === false) {
                    const scrollY = window.scrollY;
                    body.style.position = 'fixed';
                    body.style.top = `-${scrollY}px`;
                } else {
                    const scrollY = body.style.top;
                    body.style.position = '';
                    body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }

                this.isActive = !this.isActive;
                this.isHovered = false;
            },
        }
    }
</script>