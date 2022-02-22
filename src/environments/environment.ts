// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `./`,
  FE_URL: 'http://localhost:4200',
  BASE_API_URL: 'http://localhost:8310/',
  BASE_UPLOAD_URL: 'https://localhost:44375/api/server-upload/upload',
  BASE_FILE_URL: 'http://localhost:8003/Resources/Images/',
  ClientPayPalId: 'AfprWRRqkGWWLp-rI7rqducrD0aZ0Cy6Y_WnHTTI824vpjnrtijcGUM4qSRidTVZZdIIHg6uhI8coHur',
  API_RATE_MONEY_KEY: '3479f9b5af3d82af0e54',
  API_RATE_MONEY: 'https://free.currconv.com/',
  ALLOW_ANONYMOUS: '?_allow_anonymous=true',
  production: false,
  useHash: false,
  hmr: false,
  pro: {
    theme: 'light',
    menu: 'side',
    contentWidth: 'fluid',
    fixedHeader: true,
    autoHideHeader: true,
    fixSiderbar: true,
    onlyIcon: false,
    colorWeak: false,
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
