// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCX6buzIdhdGFRkjv3NFpjLb2vyQbW_LBk",
    authDomain: "amal-77e51.firebaseapp.com",
    projectId: "amal-77e51",
    storageBucket: "amal-77e51.appspot.com",
    messagingSenderId: "266024955423",
    appId: "1:266024955423:web:f24ba7e9caa674a915ef2a",
    measurementId: "G-VTSDPRFYPF"
  },
  apiURL: 'https://us-central1-loyalty-apps-staging.cloudfunctions.net/restApi'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
