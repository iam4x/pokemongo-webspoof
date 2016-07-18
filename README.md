# ![pikachu](./pikachu.gif) Pokémon GO - WebSpoof
> Spoof your iOS device GPS location for Pokémon Go
>
> Don't forget to star the project for frequent updates 🙏

![Example](./example.gif)

* :arrow_right: Download last release [pokemongo-webspoof.app.tar.gz (v1.0.2)](https://github.com/iam4x/pokemongo-webspoof/releases/download/v1.0.2/pokemongo-webspoof.app.tar.gz)
* :arrow_right: Changelog is available [here](https://github.com/iam4x/pokemongo-webspoof/releases)

## Features

* Jump to places with [Algolia Places](https://community.algolia.com/places/) search :rocket:
* Switch between different speed presets
* Total distance counter (it differs from Pokémon Go incubator counter?)
* Current speed counter
* Include Pokémon spots from a [collaborative map](https://www.google.com/maps/d/u/0/viewer?mid=1vsj869Axn9JdWairc4xU6E_0DhE&hl=en_US) (might not be accurate, will update)

## Requirements

* Xcode installed
* An iOS device with Pokémon Go connected to your Mac

## How-to run

1. Start Pokémon Go on your iOS device & connect to your Mac
2. Start the `pokemongo-webspoof` app, it will start also Xcode
3. Rename the Bundle Indentifer to something unique and different 
4. Build & run Xcode project on your connected iPhone
5. Check the `Auto update Xcode location` in the app when everything is running
6. Go back to Xcode, click into menu Debug -> Simulate Location -> pokemonLocation
7. And voilà, you can move with the arrows key and see your character move

## How-to Update

1. Delete `pokemongo-webspoof.app` from your computer
2. Remove `pokemongo-webspoof.app` from authorized app to Accessibility
  * (System Preferences -> Security & Privacy -> Privacy Tab -> Accessibility)
3. Download latest release
4. Add back new `pokemongo-webspoof.app` to authorized app to Accessibility
  * (System Preferences -> Security & Privacy -> Privacy Tab -> Accessibility)

## Known issues

`osascript is not allowed assistive access . (-1719) [...]`

* https://github.com/iam4x/pokemongo-webspoof/issues/5#issuecomment-233106899
* https://github.com/iam4x/pokemongo-webspoof/issues/5#issuecomment-233140361

`Can't get menu item "pokemonLocation" of menu 1 of menu item "Simulate Location" [...]`
* https://github.com/iam4x/pokemongo-webspoof/issues/5#issuecomment-233124626

`"Failed to code sign "pokemon-webspoof.`
`No non–expired provisioning profiles were found.`
`Xcode can attempt to fix this issue. This will reset your code signing and provisioning settings to recommended values and` `resolve issues with signing identities and provisioning profiles."`
* https://github.com/iam4x/pokemongo-webspoof/issues/16#issuecomment-233197020

`Application has finished running`
`Message from debugger: Terminated due to memory issue`

* https://github.com/iam4x/pokemongo-webspoof/issues/31


## Credits

* [Pokemon-Go-Controller](https://github.com/kahopoon/Pokemon-Go-Controller) for first proof of concept
* @Kampfgnom for [his applescript](https://github.com/kahopoon/Pokemon-Go-Controller/issues/29#issue-165194926)
