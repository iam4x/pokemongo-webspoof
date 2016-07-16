# ![pikachu](./pikachu.gif) Pokémon GO - WebSpoof
> Spoof your iOS device GPS location for Pokémon Go
>
> Don't forget to star the project for frequent updates 🙏

![Example](./example.gif)

:arrow_right: Download last release [pokemongo-webspoof.app.tar.gz (v1.0.2)](https://github.com/iam4x/pokemongo-webspoof/releases/download/v1.0.2/pokemongo-webspoof.app.tar.gz)

## Features

* Jump to places with [Algolia Places](https://community.algolia.com/places/) search :rocket:
* Switch between different speed presets
* Total distance counter (it differs from Pokémon Go incubator counter?)
* Current speed counter
* Include Pokémon spots from a [collaborative map](https://www.google.com/maps/d/u/0/viewer?mid=1vsj869Axn9JdWairc4xU6E_0DhE&hl=en_US) (might not be accurate, will update)

## Requirements

* Xcode installed
* An iOS device with Pokémon Go connected to your Mac

## How-to

1. Start Pokémon Go on your iOS device & connect to your Mac
2. Start the `pokemongo-webspoof` app, it will start also Xcode
3. Build & run Xcode project on your connected iPhone
4. Check the `Auto update Xcode location` in the app when everything is running
5. Go back to Xcode, click into menu Debug -> Simulate Location -> pokemonLocation
6. And voilà, you can move with the arrows key and see your character move

## Known issues

`osascript is not allowed assistive access . (-1719) [...]`

* https://github.com/iam4x/pokemongo-webspoof/issues/5#issuecomment-233106899

`Can't get menu item "pokemonLocation" of menu 1 of menu item "Simulate Location" [...]`
* https://github.com/iam4x/pokemongo-webspoof/issues/5#issuecomment-233124626

## Credits

* [Pokemon-Go-Controller](https://github.com/kahopoon/Pokemon-Go-Controller) for first proof of concept
* @Kampfgnom for [his applescript](https://github.com/kahopoon/Pokemon-Go-Controller/issues/29#issue-165194926)
