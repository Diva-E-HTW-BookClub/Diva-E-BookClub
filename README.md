# BookClub App – Frontend

This Project is the Frontend part to our BookClub App. It is using TypeScript with the React and the Ionic Framework.

## How to checkout the Repository

Run `git clone git@github.com:Diva-E-HTW-BookClub/Diva-E-BookClub.git` in the location where you want the project to be downloaded to.

## Documentation

- Project Documentation (https://docs.google.com/document/d/1R817B2lcFqlVNvU6E1Da_vil-_8D892GBTSQCyfOS4Y/edit?usp=sharing)

## Requirements

The complete installation including the following requirements is explained under **Installation**. Click on the requirement to download (if necessary) or to get more information.

- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/tutorial/tutorial.html)
- [Ionic](https://ionicframework.com/docs/intro/cli)

## Installation

### Install with npm (for VSCode, IntelliJ, etc.)

**Note**: This is the recommended way for development.

1. Download Node.js [here](https://nodejs.org/en/download/) or using the link under **Requirements**.
2. Run the Node.js Installer and follow the installation wizard. After the installation is complete you can close the installation wizard and type `node -v` and `npm -v` in your terminal to see the versions and proof of installation.
3. Install Ionic CLI with npm by using the following command: `npm install -g @ionic/cli`.
4. If the previous step throws an error: try to update npm to the latest version using `npm update -g npm@latest` (if on windows follow the instructions on [this](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) website to update npm correctly) and then do step 3 again.

#### Start

`cd` into the project folder and run the command `ionic serve`.

If there is a problem with running this command on Windows try [this](https://techoverflow.net/2020/06/11/was-tun-bei-angular-ng-die-datei-cusers-appdataroamingnpmng-ps1-kann-nicht-geladen-werden-da-die-ausfuehrung-von-skripts-auf-diesem-system-deaktiviert-ist/?lang=de).

If yor get the message "waiting for scripts" run the command `npm run start` instead of `ionic serve`.

### Install for Android Studio

**Note**: Development of Ionic Apps is not recommended in Android Studio! It should only be used to build and run for the native Android platform.

1. Download Android Studio [here](https://developer.android.com/studio/) and install it.
2. In a terminal `cd` into the project folder and run `ionic build`. This creates a new deployable build.
3. Now run the command `npx cap open android` which automatically starts Android Studio.

#### Start

Run the App in Android Studio and it will be started on the emulator.

See [Development for Android](https://ionicframework.com/docs/developing/android) for more information.

### Run App on iOS

#### Requirements:

- Mac (& iPhone if you want to install on external device)
- Xcode (with version compatible with your iPhones iOS version if wanted to start on external device. Check versions [here](https://developer.apple.com/support/xcode/) under "Minimum requirements and supported SDKs")
- Developer Mode on iPhone enabled. See further down for a tutorial on how to enable the developer mode on your iPhone.

**Note**: DON'T update or install Xcode through the App Store as it won't ever finish and possibly shut down your Mac due to overheating. Use this [website](https://developer.apple.com/download/all/?q=xcode) instead, download the version you need and install it manually.

#### Preparing for iOS

1. `cd` into project folder.
2. If directory called "ios" exists, delete this first.
3. Run `ionic build`. This creates a new build of the current state of the app (changes after that require a new build to be created).
4. Run `ionic capacitor add ios`. This creates the capacitor app files for the iOS Platform from the previously created build in a new directory called "ios" (automatically instantiated).
5. Run `ionic capacitor open ios` to open Xcode with the capacitor app. It takes some time to index all the files.
6. Once the Project had been opened once with the current build, you can simply select the project in Xcode to open it again. Although if you would like to change the used build the above steps have to be repeated.

#### Run in the Simulator

In Xcode press the "Run" Button to start the App (if needed select a device for the Simulator in the centered bar next to the project name). This opens the Simulator and starts the app (can take some time!). 

For a quick view of the app in the simulator you can skip opening Xcode and just run `ionic capacitor run ios` after you completed Step 3 of the preparation.

#### Enable Developer Mode on your iPhone, Install and run on external device

1. Sign in [here](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Faccount%2F&rv=1) on your Apple Developer Account with the Apple ID used on your iPhone and Mac. DON'T click on "Enroll"! Just log in, thats it. (You can close it afterwards, you just need to have been logged in once)
2. Connect your iPhone to your Mac and open the project in Xcode.
3. Select to run the App on your iPhone and run the building process. A pop up will inform you, that you are not a developer.
4. On your iPhone you can now go into Settings > Privacy & Security > Developer Mode > Enable
5. Clicking on Enable will have you to restart your iPhone.
6. Try to run the project through Xcode again on your phone, if prompted with an error in Xcode, click on it and select your personal Team and change the bundle identifier to one lower case word (can be anything you want).
7. Run it once more. The App should get installed on your phone but wait for Xcode to try to open the App on your device  → It might require you to trust the App Developer (us).
8. To trust the App, go to Settings > General > VPN & Device Managment. There Click on your Developer App and select Trust.
9. When you Run the app again (or just start it from the homescreen) everything should be working fine.

Please contact me (Sönke) if you run into any problems (there can be many, it's Apple...)

## Formatting

This projects uses Prettier with ESLint. To manually format a single file use

`npx prettier --write src/directory/filename`

to format all files run `npx prettier --write .`

If you are using VSCode you may want to install the prettier eslint extension or
use prettier as the standard formatter for an on save formatting.

**Please format the code before committing!**
By that we will only be seeing the necessary changes in the pull requests providing an easier time for reviewing.

## Helpful Sources

- [Ionic Documentation](https://ionicframework.com/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Android Studio Installation Guide](https://developer.android.com/studio/install)

Some Helpful Tutorials

- [React Crash Course](https://youtu.be/Dorf8i6lCuk?t=2079)
- [Ionic + React Tutorial](https://www.youtube.com/watch?v=_03VKmdrxV8&t=9186s)
