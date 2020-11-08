# Abyss Explorer

An app to search for Neon Abyss items.

Sprites and texts are the property of Team 17 and Veewo.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Build and deploy to gh-pages
```
yarn deploy
```

## Contributing

There are a few ways to contribute to this project.

### You found a bug? An item has the wrong sprite?

You can open an issue, please include a much details as possible: which browser do you use, your platform, whether you are using the Steam beta or not, ...
If your issue is about a weapon, please include its description. Some weapons have variants and it can help identifying the proper item.

### An item description doesn't really help understand what it does?

A few items have wacky in-game descriptions (like the Lidless Eye). You can either help the project by opening an issue or making a pull-request on the `src/contributed-helpers.json` file.
The contributed descriptions are translatable, please feel free to contribute.

### You have a cool idea?

Please make a pull-request, I'll gladly look into it.

I don't have much free time for this project, but if you're looking to contribute, here are some features I didn't have time to implement:
- make the UI translatable in every language
- find a way to pack the item icons during the build, to ease maintenance