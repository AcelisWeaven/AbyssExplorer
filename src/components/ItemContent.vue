<template>
    <div class="item-content">
        <div class="item-name">{{ item.name[lang] }}</div>
        <div class="item-desc">
            <span>{{ item.desc[lang] }}</span>
            <span class="helper">{{ item.slug | helper(lang) }}</span>
            <div class="bullets" v-if="item.category === 'weapon'">
                <div class="bullet" v-for="bullet in item.bulletTypes" :key="bullet">{{ bullet }}</div>
                <div class="bullet-speed" v-if="item.rpm !== 300">{{ item.rpm | rpmToText }}</div>
            </div>
            <div class="variants"
                 v-if="item.category === 'weapon' && item.variants.length > 0 && item.variants[0].secSkill !== null"
            >
                <p class="text text-strike" v-if="item.variants.length > 1">VARIANTS</p>
                <div v-for="(variant, index) in item.variants" :key="`${variant.secSkill}-${index}`" class="variant-wrapper">
                    <div class="variant"
                         :class="{'no-effect': variant.desc[lang] === 'No effect'}"
                    >
                        <p>{{ variant.desc[lang] }}</p>
                        <div class="costs">
                            <div v-for="cost in variant.secSkillCosts" :key="cost.type" class="cost">
                                <span>{{ cost.count }}</span>
                                <img :src="`${publicPath}cost/${cost.type}.png`" :alt="cost.type">
                            </div>
                        </div>
                    </div>
                    <div class="text" v-if="index !== item.variants.length - 1">OR</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Content",
        props: {
            item: {
                type: Object,
                required: true,
            },
            lang: {
                type: String,
                required: true,
            },
            publicPath: {
                type: String,
                required: true,
            },
        }
    }
</script>