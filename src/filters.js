import Vue from "vue";

Vue.filter('rpmToText', (rpm) => {
    if (rpm < 200)
        return 'very slow'
    else if (rpm < 300)
        return 'slow'
    else
        return 'fast'
});
