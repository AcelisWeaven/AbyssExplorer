<template>
  <div class="item-content">
    <div class="item-name">
      {{ item.name[lang] }}
    </div>
    <div class="item-desc">
      <span>{{ item.desc[lang] }}</span>
      <span class="helper">{{ item.slug | helper(lang) }}</span>
      <div
        v-if="item.category === 'weapon'"
        class="bullets"
      >
        <div
          v-for="bullet in item.bulletTypes"
          :key="bullet"
          class="bullet"
        >
          {{ bullet }}
        </div>
        <div
          v-if="item.rpm !== 300"
          class="bullet-speed"
        >
          {{ item.rpm | rpmToText }}
        </div>
      </div>
      <div
        v-if="item.category === 'weapon' && item.variants.length > 0 && item.variants[0].secSkill !== null"
        class="variants"
      >
        <p
          v-if="item.variants.length > 1"
          class="text text-strike"
        >
          VARIANTS
        </p>
        <div
          v-for="(variant, index) in item.variants"
          :key="`${variant.secSkill}-${index}`"
          class="variant-wrapper"
        >
          <div
            class="variant"
            :class="{'no-effect': variant.desc[lang] === 'No effect'}"
          >
            <p>{{ variant.desc[lang] }}</p>
            <div class="costs">
              <div
                v-for="cost in variant.secSkillCosts"
                :key="cost.type"
                class="cost"
              >
                <span>{{ cost.count }}</span>
                <i
                  class="icon"
                  :class="'icon-'+cost.type"
                />
              </div>
            </div>
          </div>
          <div
            v-if="index !== item.variants.length - 1"
            class="text"
          >
            OR
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemContent",
  props: {
    item: {
      type: Object,
      required: true,
    },

    lang: {
      type: String,
      required: true,
    },
  }
}
</script>