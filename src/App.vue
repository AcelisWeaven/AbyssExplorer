<template>
    <div class="body">
        <div class="background"></div>
        <div class="update-available red-line" v-if="swUpdateExists">
            An update is available
            <span class="button" @click="refreshApp">Update</span>
        </div>
        <div class="header">
            <div class="title">
                <h1 class="red-line">ABYSS <span class="pink">EXPLORER</span></h1>
                <p>Search tool for <strong>Neon Abyss</strong> items</p>
            </div>
            <div class="lang">
                <div class="dropdown" :class="{'active': isMenuOpen}">
                    <div class="button" @click="isMenuOpen = !isMenuOpen">{{ langIcon }} <i class="arrow-down"></i>
                    </div>
                    <div class="dropdown-options">
                        <div class="option" v-for="l in languages" :key="l.name" @click="switchLanguage(l.code)"
                             :class="{'active': l.code === lang}">{{ l.icon }} {{ l.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search">
            <input type="text" id="search" v-model="search" placeholder="Search an item here...">
            <div class="more-options">
                <input type="checkbox" id="more-options" v-model="useAdvancedSearch">
                <label for="more-options">More options</label>
            </div>

            <div class="filters" v-if="useAdvancedSearch">
                <div class="filter">
                    <label for="filter">Filter by</label>
                    <div class="select">
                        <select id="filter" v-model="filter">
                            <option value="">Everything</option>
                            <option v-for="key in tagSingle" :key="key" :value="key">{{ tags[key].name }}</option>
                            <optgroup v-for="(tagGroup, tagGroupIndex) in tagGroups"
                                      :label="tagGroup.name"
                                      :key="tagGroupIndex">
                                <option v-for="key in tagGroup.tags" :key="key" :value="key">{{ tags[key].name }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                </div>
                <div class="filter">
                    <label for="layout">Layout</label>
                    <div class="select">
                        <select id="layout" v-model="layout">
                            <option v-for="l in layoutsAvailable" :value="l.class" :key="l.class">{{ l.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <p class="has-text-centered" v-if="layout === 'compact'">Click an item to show its description.</p>
        <section :class="'layout-'+layout">
            <div class="item" v-for="(item, i) in searchItems" :key="i" :class="{'is-active': item.id === selectedItem}">
                <div class="item-img" @click="selectItem(item.id)">
                    <div class="img" :class="`img-${item.category}`">
                        <picture>
                            <source :srcset="`${publicPath}item/${item.id}.webp`" type="image/webp">
                            <img :src="`${publicPath}item/${item.id}.png`" :alt="item.name[lang]">
                        </picture>
                    </div>
                </div>
                <div class="item-content">
                    <div class="item-name">{{ item.name[lang] }}</div>
                    <div class="item-desc">{{ item.desc[lang] }}</div>
                </div>
            </div>
            <div class="no-results" v-if="searchItems.length === 0">No results :(</div>
        </section>
        <footer>
            <p>Made with ❤ by Jeremy Graziani.</p>
            <p>
                <a href="https://github.com/AcelisWeaven/AbyssExplorer">Source code</a> |
                <a href="https://github.com/AcelisWeaven/AbyssExplorer/issues/new">Suggest an improvement</a>
            </p>
            <p>Sprites and text are the property of Team 17 and Veewo.</p>
        </footer>
    </div>
</template>

<style lang="scss">
    $font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    $yellow: #feec1c;
    $cyan: #00e8e5;
    $red: #f1244f;
    $pink: #d200ee;
    $pink-light: #eb6afd;
    $purple: #6719ac;
    $blue: #27006e;
    $black: #000014;

    ::selection {
        background: rgba($pink, .5);
        color: white;
        text-shadow: 0 0 3px white, 0 0 3px white;
    }

    img::selection {
        background: none;
    }

    html {
        color: white;
        font-family: $font-family;
        text-shadow: 0 0 5px $pink;
    }

    .body {
        margin: 0;
    }

    //noinspection CssReplaceWithShorthandSafely
    .background {
        position: fixed;
        top: 0;
        right: 0;
        bottom: -60px;
        left: 0;
        z-index: -1;

        background-color: $pink;
        background: linear-gradient(80deg, transparent 20%, rgba(210, 0, 238, 0.3) 50%, transparent 80%),
        linear-gradient(120deg, $black 0%, $blue 30%, transparent 80%),
        linear-gradient(250deg, $black 0%, $blue 20%, $pink 60%);
        background-size: 100%;
        background-position: bottom center;
    }

    .button, select {
        background-color: transparent;
        padding: 5px 10px;
        box-shadow: 0 0 2px 1px rgba($cyan, 0.6), 0 0 5px 5px rgba($cyan, 0.3);
        border-radius: 3px;
        border: 1px solid white;
        color: white;
        appearance: none;

        &:hover {
            cursor: pointer;
            background: linear-gradient(to right, $purple, $black);
        }
    }

    .update-available {
        padding: 10px 0;
        text-align: center;
        text-shadow: 0 0 10px $pink, 0 0 6px $pink, 0 0 4px $pink, 0 0 2px $pink;

        .button {
            margin-left: 20px;
            text-shadow: 0 0 10px $cyan, 0 0 4px $cyan;
            animation: flicker 3000ms ease-in infinite;
            opacity: 1;
        }
    }

    @keyframes flicker {
        20%, 24%, 30%, 34% {
            opacity: 1;
        }
        22%, 32% {
            opacity: 0.7;
        }
    }

    .red-line {
        position: relative;

        &::after {
            position: absolute;
            content: '';
            bottom: -10px;
            left: 0;
            right: 0;
            height: 1px;
            border-radius: 999px;
            background-color: white;
            box-shadow: 0 0 1px rgba(255, 255, 255, 0.65), 0 0 5px 5px rgba($red, 0.7);
        }
    }

    h1 {
        display: inline-block;

        .pink {
            font-weight: 100;
            color: white;
            text-shadow: 0 0 15px $pink, 0 0 10px $pink, 0 0 5px $pink, 0 0 5px white;
        }
    }

    footer {
        margin-top: 50px;
    }

    a {
        color: $pink-light;
    }

    .select {
        position: relative;
        display: inline-block;

        select {
            padding-right: 20px;

            option {
                color: initial;
            }
        }

        &::after {
            content: '';
            display: block;
            position: absolute;
            right: 10px;
            top: 5px;
            bottom: 0;
        }
    }

    .select::after, .arrow-down {
        border: solid white;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        width: 0;
        height: 0;
        margin-top: 3px;
        margin-left: 10px;
        pointer-events: none;
    }

    .header {
        display: flex;

        .title {
            flex: 1;
        }

        .lang {
            flex: 0;
            padding-top: 30px;
        }
    }

    .dropdown {
        position: relative;
        text-align: right;

        .button {
            display: inline-flex;
            flex-direction: row;
        }

        &.active {
            .dropdown-options {
                display: block;
            }
        }
    }

    .dropdown-options {
        display: none;
        position: absolute;
        right: 0;
        min-width: 240px;
        padding-top: 10px;

        .option {
            padding: 5px 10px;
            border: 1px solid white;
            border-radius: 3px;
            background: linear-gradient(to right, $blue, $black);

            &:not(:first-child) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }

            &:not(:last-child) {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-bottom: none;
            }

            &:hover {
                cursor: pointer;
                box-shadow: 0 0 2px 1px $cyan, 0 0 5px 5px rgba($cyan, 0.4);
                border-radius: 3px;
                background: linear-gradient(to right, $purple, $black);
            }
        }

        .option.active {
            background: linear-gradient(to right, $purple, $black);
        }
    }

    .search {
        margin-bottom: 3rem;

        input[type="text"] {
            width: calc(100% - 32px);
            padding: 10px 15px;
            background-color: transparent;
            box-shadow: 0 0 2px 1px $cyan, 0 0 5px 5px rgba($cyan, 0.39);
            border-radius: 3px;
            border: 1px solid white;
            color: white;

            &::placeholder {
                // fix an issue where placeholder is barely visible in Chrome
                color: rgba(white, .7);
                opacity: 1;
            }
        }

        .more-options {
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .filters {
            display: flex;
            flex-direction: row;

            .filter {
                margin-right: 30px;

                label {
                    margin-right: 10px;
                }
            }
        }
    }

    .layout-list {
        .item {
            display: flex;
            margin-top: 1rem;
            margin-bottom: 1rem;
            align-items: center;

            .item-img {
                width: 50px;
                margin-right: 20px;
            }

            .item-content {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                align-items: center;

                .item-name {
                    width: max(15%, 280px);
                    font-weight: 600;
                }

                .item-desc {
                    flex: 1;
                }
            }
        }
    }

    .layout-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: space-between;

        .item {
            display: flex;
            padding: .5rem;
            align-items: center;
            flex-direction: column;
            width: 180px;
            background-color: rgba($pink, .2);
            box-shadow: 0 0 10px 5px rgba($pink-light, .075);

            .item-img {
                width: 50px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .item-content {
                flex-direction: column;
                align-items: center;
                padding: 0 1rem;

                .item-name {
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                .item-desc {
                    flex: 1;
                    margin-bottom: 20px;
                }
            }
        }
    }

    .layout-compact {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        justify-content: space-between;

        .item {
            display: flex;
            padding: .5rem;
            align-items: center;
            flex-direction: column;

            .item-img {
                width: 50px;

                &:hover {
                    cursor: pointer;

                    img {
                        transform: scale(3);
                    }
                }
            }

            .item-content {
                display: none;
            }


            &.is-active {
                background-color: rgba($pink, .2);

                .item-img {
                    margin-top: 20px;
                    margin-bottom: 20px;

                    img {
                        transform: scale(3);
                    }

                    &:hover img {
                        opacity: .9;
                    }
                }
                .item-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: 180px;

                    .item-name {
                        text-align: center;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }

                    .item-desc {
                        flex: 1;
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }

    .has-text-centered {
        text-align: center;
    }

    .img {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 35px;
        width: 60px;

        img {
            transform-origin: center center;
            transform: scale(2);
            image-rendering: pixelated;
        }
    }

    @mixin imgColor($color) {
        img {
            filter: drop-shadow(0 0 4px rgba($color, .5)) drop-shadow(0 0 1px rgba($color, .4));
        }
    }

    .img {
        &.img-weapon {
            @include imgColor($yellow);
        }

        &.img-powerup {
            @include imgColor($pink-light);
        }

        &.img-item, &.img-pet {
            @include imgColor($cyan);
        }
    }

    .no-results {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 5rem;
    }

    @media only screen and (min-width: 900px) {
        .body {
            padding: 0 150px;
        }
    }

    @media only screen and (max-width: 700px) {
        .item > div:nth-child(2) > div:nth-child(2) {
            flex: 0 0 100%;
        }
    }
</style>

<script>
    import * as items from './items.json';
    import * as languages from './languages.json';

    let processedItems = items.default;

    // preprocess strings for search, helps with performance

    function normalize(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    for (let item of processedItems) {
        item.search = {};
        for (let lang of languages.default) {
            item.search[lang.code] = normalize(item.name[lang.code] + " " + item.desc[lang.code]);
        }
    }

    export default {
        data() {
            return {
                filter: "",
                items: processedItems,
                isMenuOpen: false,
                lang: 'en-US',
                languages: languages.default,
                layout: 'list',
                layoutsAvailable: [
                    {
                        class: 'list',
                        name: 'List',
                    },
                    {
                        class: 'cards',
                        name: 'Cards',
                    },
                    {
                        class: 'compact',
                        name: 'Compact',
                    },
                ],
                publicPath: process.env.BASE_URL,
                search: '',
                selectedItem: null,
                swIsRefreshing: false,
                swRegistration: null,
                swUpdateExists: false,
                tagSingle: ["weapon", "powerup"],
                tagGroups: [
                    {
                        name: "Items",
                        tags: [
                            "item",
                            "player-stat",
                            "gun-stat",
                            "special",
                            "resource",
                            "hurt",
                            "attack",
                            "bullet",
                            "melee",
                            "bomb",
                            "egg",
                            "pet-effect",
                            "jump",
                            "pet-guard",
                            "pet",
                            "hero-skill",
                        ],
                    },
                ],
                tags: {
                    "weapon": {
                        name: "Weapon",

                    },
                    "powerup": {
                        name: "Power up",

                    },
                    "item": {
                        name: "All items",
                    },
                    "player-stat": {
                        name: "  Player stats",
                    },
                    "gun-stat": {
                        name: "Gun stats",

                    },
                    "special": {
                        name: "Special",

                    },
                    "resource": {
                        name: "Resource",

                    },
                    "hurt": {
                        name: "Hurt",

                    },
                    "attack": {
                        name: "Attack",

                    },
                    "bullet": {
                        name: "Bullet",

                    },
                    "melee": {
                        name: "Melee",

                    },
                    "bomb": {
                        name: "Bomb",

                    },
                    "egg": {
                        name: "Egg",

                    },
                    "pet-effect": {
                        name: "Pet effect",
                    },
                    "jump": {
                        name: "Jump",

                    },
                    "pet-guard": {
                        name: "Guardian",

                    },
                    "pet": {
                        name: "Pet",

                    },
                    "hero-skill": {
                        name: "Hero skill",
                    },
                },
                useAdvancedSearch: false,
            }
        },
        methods: {
            selectItem(id) {
                this.selectedItem = this.selectedItem === id ? null : id;
            },
            switchLanguage(lang) {
                this.lang = lang;
                this.isMenuOpen = false;
            },

            // Store the SW registration so we can send it a message
            // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
            // To alert the user there is an update they need to refresh for
            updateAvailable(event) {
                this.swRegistration = event.detail;
                this.swUpdateExists = true;
            },

            // Called when the user accepts the update
            refreshApp() {
                this.swUpdateExists = false;
                // Make sure we only send a 'skip waiting' message if the SW is waiting
                if (!this.swRegistration || !this.swRegistration.waiting) return;
                // send message to SW to skip the waiting and activate the new SW
                this.swRegistration.waiting.postMessage({type: 'SKIP_WAITING'});
            },
        },
        watch: {
            lang() {
                localStorage.setItem('lang', this.lang);
            },
            layout() {
                localStorage.setItem('layout', this.layout);
            },
            useAdvancedSearch() {
                localStorage.setItem('useAdvancedSearch', this.useAdvancedSearch);

                // when disabled, reset options
                this.filter = "";
            },
        },
        mounted() {
            const rememberedLanguage = localStorage.getItem('lang');
            if (rememberedLanguage !== null && this.languages.map(l => l.code).includes(rememberedLanguage))
                this.lang = rememberedLanguage;

            const rememberedLayout = localStorage.getItem('layout');
            if (rememberedLayout != null && this.layoutsAvailable.map(l => l.class).includes(rememberedLayout))
                this.layout = rememberedLayout;

            this.useAdvancedSearch = localStorage.getItem('useAdvancedSearch') === 'true';
        },
        computed: {
            searchItems() {
                const search = normalize(this.search);
                return this.items.filter(i => {
                    return i.search[this.lang].includes(search) && (this.filter === "" || i.tags.indexOf(this.filter) !== -1);
                })
            },
            langIcon() {
                return this.languages.filter(l => l.code === this.lang)[0].icon;
            }
        },
        created() {
            // Listen for our custom event from the SW registration
            document.addEventListener('swUpdated', this.updateAvailable, {once: true})

            // Prevent multiple refreshes
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (this.swIsRefreshing) return
                this.swIsRefreshing = true
                // Here the actual reload of the page occurs
                window.location.reload()
            })
        },
    }
</script>