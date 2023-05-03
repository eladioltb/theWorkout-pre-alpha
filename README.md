# The Workout App

#### Description of the project

App oriented to personal tracking of activity in the gym with routine management and visualization of statistics on weights and other data.

The project is developed in NextJS to be able to manage everything in monorepo. If you have doubts about how it works check the [official documentation](https://nextjs.org/).

## Deployment on local environment

- #### Programs required to work locally:
    - [Visual Studio Code](https://code.visualstudio.com/)
    - [MongoDB Compass](https://www.mongodb.com/try/download/compass)
    - [Postman](https://www.postman.com/)
    - [Figma](https://www.figma.com/downloads/) (optional)
    - [Android Studio](https://developer.android.com/studio) (optional)
    - [xCode](https://apps.apple.com/es/app/xcode/id497799835?mt=12) (optional only on Mac's)

- #### Start working on the project

    Using the `npm run dev` command will raise both the Back-end and Front-end at   the path http://localhost:3000

- #### Exporting the app to mobile

    Run the command `npx cap add ios` or `npx cap add android` to create the base of the project on mobile after that run `npm run static` to make a build of the app an the importation to mobile.

    To finish run `npx cap sync` and `npx cap open ios` or `npx cap open android` to sync the changes of the app and open it on Android Studio or xCode

- #### Commands to know

    - `npx @capacitor/assets generate --ios` or `npx @capacitor/assets generate --android`: This command is used to declared the icon app and splash app on the project.

## IMPORTANT THINGS

#### MacOS users

If you try to run the capacitor commands maybe you got an error of `cocoapods`. To solve this error please throw this command on the terminal `sudo gem install cocoapods`.

if you use Homebrew you can use this command `brew install cocoapods`.

Here you can check the [Capacitor Documentation](https://capacitorjs.com/docs/getting-started/environment-setup).

