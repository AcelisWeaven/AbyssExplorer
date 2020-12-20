const SpritesmithPlugin = require('webpack-spritesmith')
const path = require('path')

module.exports = {
    configureWebpack: {
        plugins: [
            new SpritesmithPlugin({
                src: {
                    cwd: path.resolve(__dirname, 'src/sprites'),
                    glob: '**/*.png'
                },
                target: {
                    image: path.resolve(__dirname, 'src/generated/spritesheet.png'),
                    css: [
                        [path.resolve(__dirname, 'src/generated/spritesheet.css'), {
                            format: 'icons'
                        }]
                    ],
                },
                customTemplates: {
                    'icons': function (data) {
                        const shared = '.icon { background-image: url("I") }'
                            .replace('I',
                                path.relative('src/generated', data.sprites[0].image)
                                    .replace(/\\/g, "/")
                            );

                        const perSprite = data.sprites.map(function (sprite) {
                            return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
                                .replace('N', sprite.name)
                                .replace('W', sprite.width)
                                .replace('H', sprite.height)
                                .replace('X', sprite.offset_x)
                                .replace('Y', sprite.offset_y);
                        }).join('\n');

                        return shared + '\n' + perSprite;
                    },
                }
            })
        ],
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/AbyssExplorer/'
        : '/',
    productionSourceMap: false,
    pwa: {
        name: 'Abyss Explorer',
        themeColor: '#000014',
        msTileColor: '#000014',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // configure the workbox plugin
        workboxPluginMode: 'GenerateSW',
        assetsVersion: 2,
        manifestOptions: {
            icons: [{
                'src': './icon/192.png',
                'sizes': '192x192',
                'type': 'image/png'
            }, {
                'src': './icon/512.png',
                'sizes': '512x512',
                'type': 'image/png'
            }, {
                'src': './icon/192-mask.png',
                'sizes': '192x192',
                'type': 'image/png',
                'purpose': 'maskable'
            }, {
                'src': './icon/512-mask.png',
                'sizes': '512x512',
                'type': 'image/png',
                'purpose': 'maskable'
            }]
        },
        iconPaths: {
            favicon32: './icon/32.png',
            favicon16: './icon/16.png',
            appleTouchIcon: './icon/152.png',
            msTileImage: './icon/144.png'
        }
    }
};