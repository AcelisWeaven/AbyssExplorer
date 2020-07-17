<template>
    <div class="body">
        <div class="background"></div>
        <div class="header">
            <div class="title">
                <h1>ABYSS <span class="pink">EXPLORER</span></h1>
                <p>Search tool for <strong>Neon Abyss</strong> items</p>
            </div>
            <div class="lang">
                <div class="dropdown">
                    <div class="button">{{ langIcon }} <i class="arrow-down"></i></div>
                    <div class="dropdown-options">
                        <div class="option" v-for="l in languages" :key="l.name" @click="lang = l.code"
                             :class="{'active': l.code === lang}">{{ l.icon }} {{ l.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="input">
            <input type="text" id="search" v-model="search" placeholder="Search an item here...">
        </div>
        <section>
            <div class="item" v-for="(item, i) in searchItems" :key="i">
                <div>
                    <div class="img" :class="`img-${item.category}`">
                        <img :src="`${publicPath}item/${item.id}.png`" :alt="item.name[lang]">
                    </div>
                </div>
                <div>
                    <div>{{ item.name[lang] }}</div>
                    <div>{{ item.desc[lang] }}</div>
                </div>
            </div>
            <div class="no-results" v-if="searchItems.length === 0">No results :(</div>
        </section>
        <footer>
            <p>Made with ❤ by Jeremy Graziani.
                <a href="https://github.com/AcelisWeaven/AbyssExplorer">Source code</a>
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
        background: $pink;
        color: white;
        text-shadow: 0 0 3px white, 0 0 3px white;
    }

    img {
        &::selection {
            background: none;
        }
    }

    html {
        color: white;
        font-family: $font-family;
        text-shadow: 0 0 5px $pink;
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

    h1 {
        position: relative;
        display: inline-block;

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

    .arrow-down {
        border: solid white;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        width: 0;
        height: 0;
        margin-top: 3px;
        margin-left: 10px;
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
            padding: 5px 10px;
            box-shadow: 0 0 2px 1px rgba($cyan, 0.6), 0 0 5px 5px rgba($cyan, 0.3);
            border-radius: 3px;
            border: 1px solid white;
            color: white;
        }

        &:hover {
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

    .input {
        margin-bottom: 3rem;

        input {
            width: calc(100% - 32px);
            padding: 10px 15px;
            background-color: transparent;
            box-shadow: 0 0 2px 1px $cyan, 0 0 5px 5px rgba($cyan, 0.39);
            border-radius: 3px;
            border: 1px solid white;
            color: white;
        }
    }

    .item {
        display: flex;
        margin-top: 1rem;
        margin-bottom: 1rem;
        align-items: center;

        > div {
            &:first-child {
                width: 50px;
            }

            &:nth-child(2) {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                align-items: center;

                > div {
                    &:nth-child(1) {
                        width: max(15%, 280px);
                        font-weight: 600;
                    }

                    &:nth-child(2) {
                        flex: 1;
                    }
                }
            }

            &:not(:last-child) {
                margin-right: 20px;
            }
        }
    }

    .img {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 3px black;
        height: 35px;
        width: 60px;

        img {
            transform-origin: center center;
            transform: scale(2);
            image-rendering: pixelated;
        }
    }

    .img {
        &.img-weapon {
            background-color: $yellow;
            box-shadow: 0 0 12px 2px #feec1c;
        }

        &.img-powerup {
            background-color: $pink-light;
            box-shadow: 0 0 12px 2px #eb6afd;
        }

        &.img-item {
            background-color: $cyan;
            box-shadow: 0 0 12px 2px #02fffb;
        }

        &.img-pet {
            background-color: $cyan;
            box-shadow: 0 0 12px 2px #02fffb;
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
                publicPath: process.env.BASE_URL,
                lang: 'en-US',
                languages: languages.default,
                items: processedItems,
                search: '',
            }
        },
        watch: {
            lang() {
                localStorage.setItem('lang', this.lang);
            }
        },
        mounted() {
            const rememberedLanguage = localStorage.getItem('lang');
            if (rememberedLanguage !== null && this.languages.map(l => l.code).includes(rememberedLanguage))
                this.lang = rememberedLanguage;
        },
        computed: {
            searchItems() {
                const search = normalize(this.search);
                return this.items.filter(i => {
                    return i.search[this.lang].includes(search);
                })
            },
            langIcon() {
                return this.languages.filter(l => l.code === this.lang)[0].icon;
            }
        }
    }
</script>