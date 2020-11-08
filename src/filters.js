import Vue from "vue";
import * as contributedHelpers from './contributed-helpers.json';

const helpers = contributedHelpers.default

Vue.filter('rpmToText', (rpm) => {
    if (rpm < 200)
        return 'very slow'
    else if (rpm < 300)
        return 'slow'
    else
        return 'fast'
});

// Looks for an helper for an item. Fallback to the english text, if it's defined.
const langFallback = 'en-US'
Vue.filter('helper', (itemSlug, lang) => {
    if (itemSlug in helpers) {
        const helper = helpers[itemSlug];

        if (lang in helper)
            return helper[lang]
        else if (langFallback in helper)
            return helper[langFallback]
    }
    return ''
})