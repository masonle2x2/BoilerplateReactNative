# HelloWorld

# Setup

- Setup development environment [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Node version >= 20 (recommended use [fnm](https://github.com/Schniz/fnm))
- We recommended to use [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) or [bun](https://bun.sh/)
- Ruby version: 3.2.2 (recommended use [rbenv](https://github.com/rbenv/rbenv))

> Xcode run failed with status 127
>
> This error occurs when xcode cannot access node. Xcode use .bash_profile, so add PATH to .bash_profile.

Example `.bash_profile`:

```
  if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi
  PATH=$PATH:/opt/homebrew/bin
  export PATH=$PATH:/usr/local/bin
```

> Remember add `source ~/.bash_profile` to top of `Pre-actions` in xcode scheme

# Importance before commit

> ### <strong>You must fix all bug of ESLint </strong>

> ### <strong>You must config git Username/Email</strong>

# Command

> <strong>Before run script, you must navigate to your project</strong> :`cd <your_project_folder>`

- Install dependencies: `yarn`
- Run Android: `yarn android:dev` (dev/prod by default)
- Run IOS: `yarn ios:dev` (dev/prod by default)
- Start server: `yarn start`
- Install library then pods IOS: `yarn add <your_library>`
- Change splash logo
  - Step 1: Get file .PNG to change then rename it to splash.PNG
  - Step 2: Copy and pate to splash folder
  - Step 3: Run command: `yarn splash`
  -
- ...

> #### Detail command: Read script of package.json file

## Base config (Now u can config on env)

- Change App name `APP_DISPLAY_NAME` on `env/(dev.json/.prod)`
- Change App id `BUNDLE_IDENTIFIER` on `env/(dev.json/.prod)`
- Change App version `VERSION_NAME` on `env/(dev.json/.prod)`
- Change App build number `VERSION_CODE` on `env/(dev.json/.prod)`
- Change App URL `API_URL` on `env/(dev.json/.prod)`

### Gen app icon and Change app icon by env

Build with: [rn-ml](https://github.com/ngocle2497/cli-tools)

- Update app icon file from appicon folder
- Run: `yarn app-icon` or `yarn app-icon:dev`
  - Android: auto change flavor script
  - IOS: Change ASSETCATALOG_COMPILER_APPICON_NAME to your respective App Icon Assets (in respective env file)

# Environment

> ### Create new Environment

Ex: New Environment named: Demo

- ## Setup env

  - Create new env file in env folder (.demo)
  - Copy all value from `dev.json` to new env file
  - Update value in new env file

- ## Setup fastlane

  - Create new env file with name syntax: .env.<env_name> (.env.demo)
  - Copy app value from `.envdev.json` to new env file
  - Update value in new env file
  - Get new apple and gooogle api file then copy to `api-key` folder. ex:
    - `api-key/apple/demo.p8`
    - `api-key/google/demo.json`
  - More info to create api key for fastlane: [Google-Key](https://docs.fastlane.tools/actions/upload_to_play_store/), [Apple-Key](https://docs.fastlane.tools/app-store-connect-api/)
  - Create new script upload build: ex:
    - `"fastlane:demo": "node scripts/fastlane.js google_internal_test_flight env/.demo demo"`
      - `env/.demo`: path to env file
      - `demo`: env file of fastlane. correct env file name for fastlane is: `.env.demo`

- ## Setup splash, app icon, script build

- ### Splash

  - This project use [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash) to create splash file. Read the docs before continue
  - Get splash file then copy to `splash` folder named: `splash-<environment_name>.png`. ex: `splash-demo.png`
  - Create new script in `package.json` file. ex:
    - `"splash-demo": "node ./scripts/splash.js splash/splash-demo.png 0E1019 150 demo BootSplashDemo",`
      - `0E1019`: background color of splash screen
      - `150`: width of icon splash
      - `demo`: flavor folder for `android`
      - `BootSplashDemo`: story board file name for ios. It must be like `SPLASH_STORYBOARD_NAME` in env file
      - Open `HelloWorld.xcworkspace` via xcode then add `BootSplashDemo.storyboad` file to xcode.

- ### App icon

  - This project use [rn-ml](https://github.com/ngocle2497/cli-tools) to gen app icon automatically
    - App icon saved in `appicon` folder
    - Get new `png` file with dimension 1024x1024. <b>The file must not include transparent pixel.</b>
    - App icon named: `appicon-<environment_name>.png`. ex: `appicon-demo.pnd`
    - Create new script for gen app icon in `package.json` file. ex:
      - `"app-icon:demo": "npx rn-ml appicon -s appicon/appicon-demo.png -f demo -icn AppIcon-Demo"`
        - `-f demo`: flavor android
        - `AppIcon-Demo`: App icon image assets name for ios. It must be like `ASSETCATALOG_COMPILER_APPICON_NAME` in env file

- ## Setup Android/IOS

> ## This project use [react-native-keys](https://github.com/numandev1/react-native-keys) to switch env

- ### Android

  - Add new flavor `productFlavors` section in `android/app/build.gradle`
  - Add env path to `project.ext.keyFiles` section in `android/app/build.gradle`.
  - Gen new `google-services.json` from Firebase then copy to `android/app/src/<flavor_name>`. ex: `android/app/src/demo/google-services.json`.
  - If `android/app/src/<flavor_name>` not exits, create new folder for it

- ### IOS

  - Gen new `GoogleService-Info.plist` from Firebase
  - Create new folder with name like `SCHEME_SUFFIX` section in env file to `ios/GoogleService/<SCHEME_SUFFIX>`. Then copy file `GoogleService-Info.plist` to this. More info, u can read `Setup Firebase Environment GoogleService-Info.plist` section in `Build Phase` in workspace file
  - Open Open `HelloWorld.xcworkspace` via xcode
  - Select `HelloWorld-Dev` scheme then click edit scheme
  - Click Duplicate scheme.
  - Rename Scheme like: `HelloWorld-<SCHEME_SUFFIX>`. `SCHEME_SUFFIX` in env file
  - Check `Shared` checkbox on the dialog
  - Select `Pre-actions`
  - On the first script, change env to load when xcode build. ex:
    - `ENV_PATH="env/dev.json"` to `ENV_PATH="env/.demo"`
  - Complete script like:

    ```
      rm "${CONFIGURATION_BUILD_DIR}/${INFOPLIST_PATH}"
      source ~/.bash_profile
      ENV_PATH="env/dev.json"
      export KEYSFILE=$ENV_PATH

      "${SRCROOT}/../node_modules/react-native-keys/keysIOS.js"

      "${SRCROOT}/../scripts/prepare.js" "$ENV_PATH"

    ```

## Caution

- With gooogle play, u must publish .aab first time manually. Then, u can upload aab via fastlane. [fastlane/fastlane#14686](https://github.com/fastlane/fastlane/issues/14686)

## [Gitlab CI Runner config](./GITLABRUNNER.MD)
