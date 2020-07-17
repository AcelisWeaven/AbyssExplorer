module.exports = {
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
        assetsVersion: 1,
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
        }
    }
};