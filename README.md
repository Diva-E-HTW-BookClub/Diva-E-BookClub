# BookClub App – Frontend

This Project is the Frontend part to our BookClub App. It is using TypeScript with the React and the Ionic Framework. 

## How to checkout the Repository

Run `git clone git@github.com:Diva-E-HTW-BookClub/Diva-E-BookClub.git` in the location where you want the project to be downloaded to.

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

### Install for Android Studio

**Note**: Development of Ionic Apps is not recommended in Android Studio! It should only be used to build and run for the native Android platform.

1. Download Android Studio [here](https://developer.android.com/studio/) and install it.
2. In a terminal `cd` into the project folder and run `ionic build`. This creates a new deployable build. You only need to run the command if you have changed the project.
3. Now run the command `npx cap open android` which automatically starts Android Studio.

#### Start

Run the App in Android Studio and it will be started on the emulator.

See [Development for Android](https://ionicframework.com/docs/developing/android) for more information.

## Documentations / Helpful Sources

- [Ionic Documentation](https://ionicframework.com/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Android Studio Installation Guide](https://developer.android.com/studio/install)

Some Helpful Tutorials

- [React Crash Course](https://youtu.be/Dorf8i6lCuk?t=2079)
- [Ionic + React Tutorial](https://www.youtube.com/watch?v=_03VKmdrxV8&t=9186s)


