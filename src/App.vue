<template>
    <div class="body" ref="body">
        <div class="background"></div>
        <div class="update-available red-line" v-if="swUpdateExists">
            An update is available
            <span class="button" @click="refreshApp">Update</span>
        </div>
        <div class="columns">
            <div class="large">
                <h1 class="red-line">ABYSS <span class="pink">EXPLORER</span></h1>
            </div>
            <div class="aside narrow padded">
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
        <div class="columns">
            <div class="large margin">Search tool for <strong>Neon Abyss</strong> items</div>
            <div class="aside narrow">
                <button class="button-pink" @click="promptAppInstall" v-if="!isAppInstalled && appDeferredPrompt !== null">Add to home screen</button>
            </div>
        </div>
        <div class="search">
            <input type="text" id="search" v-model="search"
                   placeholder="Search an item here. Use a comma to search multiple terms.">
            <div class="more-options">
                <input type="checkbox" id="more-options" v-model="useAdvancedSearch">
                <label for="more-options">More options</label>
            </div>

            <div class="filters" v-if="useAdvancedSearch">
                <div class="filter">
                    <label for="layout">Layout</label>
                    <div class="select">
                        <select id="layout" v-model="layout">
                            <option v-for="l in layoutsAvailable" :value="l.class" :key="l.class">{{ l.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="filter">
                    <label for="filter">Filter by</label>
                    <div class="select">
                        <select id="filter" v-model="tagFilter">
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
                    <label for="sort">Sort by</label>
                    <div class="select">
                        <select id="sort" v-model="sort">
                            <option v-for="l in sortsAvailable" :value="l.property" :key="l.property">{{ l.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <p class="has-text-centered" v-if="layout === 'compact'">Click an item to show its description.</p>
        <section :class="'layout-'+layout">
            <div class="item" v-for="(item, i) in searchItems" :key="i"
                 :class="{
                    'is-active': item.slug === selectedItem,
                    'is-hover': item.slug === hoverItem,
                }"
            >
                <div class="item-img"
                     @click="selectItem(item.slug)"
                     @mouseover="adjustHoverItem(item.slug, $event.target)"
                     @mouseleave="hoverItem = null"
                >
                    <div class="img">
                        <img
                                :src="`${publicPath}spritesheet-${item.sprite.sheet}.png`"
                                :style="{
                                    'width': `${item.sprite.width}px`,
                                    'height': `${item.sprite.height}px`,
                                    'object-position': `-${item.sprite.x}px -${item.sprite.y}px`,
                                }"
                                :alt="item.name[lang]"
                        >
                    </div>
                </div>
                <div class="item-content" :style="hoverItem === item.slug ? tooltipStyle : {}">
                    <div class="item-name">{{ item.name[lang] }}</div>
                    <div class="item-desc">
                        <span>{{ item.desc[lang] }}</span>
                        <div class="bullets" v-if="item.category === 'weapon'">
                            <div class="bullet" v-for="(bullet, j) in item.bulletTypes" :key="j">{{ bullet }}</div>
                            <div class="bullet-speed" v-if="item.rpm !== 300">{{ rpmToText(item.rpm) }}</div>
                        </div>
                        <div class="variants"
                             v-if="item.category === 'weapon' && item.variants.length > 0 && item.variants[0].secSkill !== null"
                        >
                            <p class="text text-strike" v-if="item.variants.length > 1">VARIANTS</p>
                            <div v-for="(variant, j) in item.variants" :key="j" class="variant-wrapper">
                                <div class="variant"
                                     :class="{'no-effect': variant.desc[lang] === 'No effect'}"
                                >
                                    <p>{{ variant.desc[lang] }}</p>
                                    <div class="costs">
                                        <span v-for="(cost, k) in variant.secSkillCosts" :key="k" class="cost">
                                            <span>{{ cost.count }}</span>
                                            <img :src="`${publicPath}cost/${cost.type}.png`" :alt="cost.type">
                                        </span>
                                    </div>
                                </div>
                                <div class="text" v-if="j !== item.variants.length - 1">OR</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-results" v-if="searchItems.length === 0">No results :(</div>
        </section>
        <footer>
            <p>
                Made with ❤ by Jeremy Graziani.
                <a class="link-orange" href="https://www.buymeacoffee.com/jeremygr" target="_blank">Buy me a coffee!</a>
            </p>
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
        overflow-x: hidden;
    }

    .body {
        margin: 0;
    }

    @mixin tag {
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        padding: 3px 6px;
        margin: 3px;
        border-radius: 5px;
    }

    .variants {
        .variant {
            display: flex;
            flex-wrap: wrap;
            padding: 10px;
            margin: 10px -10px;
            background-color: rgba(black, .2);
            border-radius: 3px;
            align-items: center;
            gap: .5rem;

            &.no-effect {
                opacity: .7;
                font-style: italic;
            }

            p {
                flex-grow: 1;
                font-size: .9rem;
                margin: 0;
                color: rgba(white, .8)
            }
        }

        .text {
            margin: 20px 0;
            text-align: center;
            font-size: 11px;
            line-height: 10px;
            letter-spacing: .15rem;
            opacity: .7;

            &.text-strike {
                position: relative;

                &::before, &::after {
                    content: '';
                    display: block;
                    height: 1px;
                    position: absolute;
                    background-color: white;
                    top: 6px;
                }

                &::before {
                    left: 0;
                    right: calc(100% - 30px);
                }

                &::after {
                    left: calc(100% - 30px);
                    right: 0;
                }
            }
        }

        .costs {
            display: inline-flex;

            .cost {
                @include tag;
                background-color: rgba($pink, .3);

                img {
                    width: 24px;
                    height: 24px;
                    image-rendering: crisp-edges;
                }
            }
        }
    }

    .bullets {
        display: flex;
        justify-content: space-evenly;
        margin-top: 10px;
        font-size: .7rem;

        .bullet {
            @include tag;
            background-color: rgba($cyan, .2);
        }

        .bullet-speed {
            @include tag;
            background-color: rgba($red, .5);
        }
    }

    //noinspection CssReplaceWithShorthandSafely
    @mixin bgNeon {
        background-color: $pink;
        background: linear-gradient(80deg, transparent 20%, rgba($pink, 0.1) 50%, transparent 80%),
        linear-gradient(120deg, $black 0%, $blue 30%, transparent 80%),
        linear-gradient(250deg, $black 0%, $blue 20%, $pink 60%);
        background-position: top right;
    }

    .background {
        position: fixed;
        top: 0;
        right: 0;
        bottom: -60px;
        left: 0;
        z-index: -1;
        background-size: 100%;

        @include bgNeon;
    }

    .search {
        @include bgNeon;
        background-attachment: fixed;
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 10px 0;

        @media only screen and (min-width: 900px) {
            // some items overflow below the .search when it's stickied, making this section larger hides the issue
            margin-right: -20px;
            margin-left: -20px;
            padding: 10px 20px;
        }
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

    .columns {
        display: flex;

        .large {
            flex: 1;

            &.margin {
                margin-bottom: 20px;
            }
        }

        .narrow {
            flex: 0;
        }

        .button-pink {
            position: relative;
            padding: 5px 5px 5px 25px;
            margin-bottom: 20px;
            background: transparent;
            border: 1px solid white;
            border-radius: 2px;
            color: rgba(white, .9);
            box-shadow: 0 0 4px $pink, 0 0 4px $pink inset, 0 0 10px $pink, 0 0 10px $pink inset;
            cursor: pointer;
            white-space: nowrap;

            &:hover {
                background: rgba($pink, .3);
            }

            &::after {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                content: '+';
                left: 5px;
                top: 0;
                bottom: 2px;
                font-size: 1.3rem;
                font-weight: 800;
            }
        }

        .aside {
            flex: 0;

            &.padded {
                padding-top: 30px;
            }
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
        z-index: 10;

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
                    display: inline-block;
                    padding: 5px;
                    margin-right: 10px;
                }
            }
        }
    }

    .layout-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: space-evenly;

        .item {
            display: flex;
            padding: .5rem;
            align-items: center;
            flex-direction: column;
            width: 180px;
            background-color: rgba($pink, .1);
            margin-bottom: 10px;

            @media only screen and (min-width: 900px) {
                width: 260px;
            }

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
                }
            }
        }
    }

    .layout-compact {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        justify-content: space-evenly;

        .item {
            display: flex;
            padding: .5rem;
            align-items: center;
            flex-direction: column;

            .item-img {
                width: 50px;
            }

            .item-content {
                display: none;

                .item-name {
                    text-align: center;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
            }

            &.is-hover {
                .item-img {
                    cursor: pointer;

                    img {
                        transform: scale(3);
                    }
                }
            }

            &:not(.is-active).is-hover {
                // creating a tooltip
                position: relative;
                font-size: .7rem;
                text-align: justify;

                .item-content {
                    display: flex;
                    position: absolute;
                    flex-direction: column;
                    z-index: 100;
                    top: calc(100% + 10px);
                    left: -60px;
                    right: -60px;
                    pointer-events: none;
                    background-color: $blue;
                    padding: 10px;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 15px rgba(black, .5);
                    /*border: 1px solid white;*/

                    .variants {
                        margin-top: 15px;

                        .variant-wrapper {
                            &:first-of-type .variant {
                                margin-top: 10px;
                                border-top: 1px solid rgba(white, .5);
                            }

                            &:not(:last-child) .variant {
                                border-bottom: 1px solid rgba(white, .5);
                            }

                            .variant {
                                margin-top: 0;
                                margin-bottom: 0;
                            }

                            p {
                                font-size: .7rem;
                            }

                            .costs {
                                display: none;
                            }
                        }

                        margin-bottom: -10px;
                    }

                    .text:not(.text-strike) {
                        display: none;
                    }

                    .text {
                        font-size: 10px;
                        margin: 0;
                    }

                    .bullets {
                        display: inline;
                        margin: 2px;

                        .bullet, .bullet-speed {
                            display: inline;
                            padding: 2px 4px;
                        }
                    }
                }
            }

            &.is-active {
                // creating a modal
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 100;
                overflow-y: auto;
                @include bgNeon;

                .item-img {
                    margin-top: 10vh;
                    margin-bottom: 20px;
                    pointer-events: none;

                    img {
                        transform: scale(3);
                    }

                    &:hover::after {
                        background-color: $red;
                    }

                    &::after {
                        $height: 40px;
                        pointer-events: initial;
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        content: '×';
                        font-size: $height;
                        padding: 10px;
                        width: $height;
                        height: $height;
                        display: flex;
                        justify-content: center;
                        line-height: $height - 10px;
                        background-color: rgba($red, .8);
                        box-shadow: 0 0 3px white, 0 0 3px white inset, 0 0 20px $red, 0 0 20px $red inset;
                        text-shadow: 0 0 6px white, 0 0 10px $red;
                        border-radius: 2px;
                        border: 1px solid white;

                        @media only screen and (max-width: 900px) {
                            // put it at the bottom on mobile (and smaller)
                            right: 10px;
                            bottom: 10px;
                            top: initial;
                        }
                    }
                }

                .item-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    max-width: calc(100vw - 100px);

                    @media only screen and (max-width: 900px) {
                        // bigger bottom padding on mobile, so the close button doesn't overlap with descriptions
                        padding-bottom: 60px;
                    }

                    .item-desc {
                        flex: 1;
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }

    .layout-list {
        .bullets {
            display: inline;
            margin-top: 0;
            margin-left: 1rem;
        }

        .variants .text {
            margin: 10px 0;
        }

        .item {
            display: flex;
            margin-top: 1rem;
            margin-bottom: 1rem;
            padding: 1rem 1.5rem;
            align-items: center;
            background-color: rgba($pink, .1);

            .item-img {
                width: 50px;
                margin-right: 20px;
                @media only screen and (max-width: 700px) {
                    margin-right: 2rem;
                    margin-left: -1rem;
                }
            }

            .item-content {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                align-items: center;

                @media only screen and (max-width: 700px) {
                    justify-content: center;

                    .item-name {
                        margin-bottom: 10px;
                    }

                    .item-name, .item-desc {
                        flex: 0 0 100%;
                    }
                }

                .item-name {
                    text-align: center;
                    padding-right: .5rem;
                    width: max(15%, 170px);
                    font-weight: 600;
                }

                .item-desc {
                    flex: 1;
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
            object-fit: none;
            pointer-events: none;
            transform-origin: center center;
            transform: scale(2);
            image-rendering: pixelated;
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

    .link-orange {
        color: orange;
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
            let desc = item.desc[lang.code];
            if (item.category === 'weapon') {
                desc += ' ' + item.variants.map(v => v.desc[lang.code]).join(' ');
            }
            item.search[lang.code] = normalize(item.name[lang.code] + " " + desc);
        }
    }

    export default {
        data() {
            return {
                appDeferredPrompt: null,
                items: processedItems,
                isMenuOpen: false,
                isAppInstalled: false,
                hoverItem: null,
                lang: 'en-US',
                languages: languages.default,
                layout: 'compact',
                layoutsAvailable: [
                    {
                        class: 'compact',
                        name: 'Compact',
                    },
                    {
                        class: 'cards',
                        name: 'Cards',
                    },
                    {
                        class: 'list',
                        name: 'List',
                    },
                ],
                sort: 'id',
                sortsAvailable: [
                    {
                        property: 'id',
                        name: 'ID',
                    },
                    {
                        property: 'name',
                        name: 'A-Z',
                    },
                    {
                        property: 'colorOrder',
                        name: 'Color',
                    },
                ],
                publicPath: process.env.BASE_URL,
                search: '',
                selectedItem: null,
                swIsRefreshing: false,
                swRegistration: null,
                swUpdateExists: false,
                tagFilter: "",
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
                        ],
                    },
                ],
                tagSingle: ["weapon"],
                tags: {
                    "weapon": {
                        name: "Weapon",
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
                },
                tooltipStyle: {},
                useAdvancedSearch: false,
            }
        },
        methods: {
            adjustHoverItem(id, elem) {
                this.hoverItem = id;
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
            selectItem(id) {
                // only possible in compact mode
                if (this.layout !== 'compact') return;

                const newSelectedItem = this.selectedItem === id ? null : id;

                // avoids body scroll when modal is open
                if (newSelectedItem !== null) {
                    const scrollY = window.scrollY;
                    this.$refs.body.style.position = 'fixed';
                    this.$refs.body.style.top = `-${scrollY}px`;
                } else {
                    const scrollY = this.$refs.body.style.top;
                    this.$refs.body.style.position = '';
                    this.$refs.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }

                this.selectedItem = newSelectedItem;
                this.hoverItem = null;
            },
            rpmToText(rpm) {
                if (rpm < 200)
                    return 'very slow'
                else if (rpm < 300)
                    return 'slow'
                else
                    return 'fast'
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
            promptAppInstall() {
                this.appDeferredPrompt.prompt();
                this.appDeferredPrompt.userChoice.then(choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        this.isAppInstalled = true;
                        this.appDeferredPrompt = null;
                    }
                })
            },
        },
        watch: {
            lang() {
                localStorage.setItem('lang', this.lang);
            },
            layout() {
                localStorage.setItem('layout', this.layout);
            },
            sort() {
                localStorage.setItem('sort', this.sort);
            },
            useAdvancedSearch() {
                localStorage.setItem('useAdvancedSearch', this.useAdvancedSearch);

                // when disabled, reset options
                this.tagFilter = "";
            },
        },
        mounted() {
            const rememberedLanguage = localStorage.getItem('lang');
            if (rememberedLanguage !== null && this.languages.map(l => l.code).includes(rememberedLanguage))
                this.lang = rememberedLanguage;

            const rememberedLayout = localStorage.getItem('layout');
            if (rememberedLayout != null && this.layoutsAvailable.map(l => l.class).includes(rememberedLayout))
                this.layout = rememberedLayout;

            const rememberedSort = localStorage.getItem('sort');
            if (rememberedSort != null && this.sortsAvailable.map(l => l.property).includes(rememberedSort))
                this.sort = rememberedSort;

            this.useAdvancedSearch = localStorage.getItem('useAdvancedSearch') === 'true';
        },
        computed: {
            searchItems() {
                const search = normalize(this.search).split(',')
                    .map(term => term.trim())
                    .filter(term => term.length > 0);

                return this.items
                    .filter(i => {
                        return (this.tagFilter === "" || i.tags.indexOf(this.tagFilter) !== -1) &&
                            search.length === 0 || search.some(term => i.search[this.lang].includes(term));
                    })
                    .sort((a, b) => {
                        if (this.sort === 'name') {
                            return a.search[this.lang].localeCompare(b.search[this.lang])
                        }

                        let aValue = a[this.sort];
                        let bValue = b[this.sort];

                        if (aValue > bValue)
                            return 1;
                        if (aValue < bValue)
                            return -1;
                        return 0;
                    })
            },
            langIcon() {
                return this.languages.filter(l => l.code === this.lang)[0].icon;
            }
        },
        created() {
            // Listen for our custom event from the SW registration
            document.addEventListener('swUpdated', this.updateAvailable, {once: true})
            window.addEventListener('beforeinstallprompt', e => {
                e.preventDefault();
                this.appDeferredPrompt = e;
            })
            window.addEventListener('appinstalled', () => {
                this.isAppInstalled = true;
            });

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
