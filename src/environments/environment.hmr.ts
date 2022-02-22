// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `./`,
  BASE_API_URL: 'http://localhost:8310/',
  BASE_UPLOAD_URL: 'https://localhost:44375/api/server-upload/upload',
  BASE_FILE_URL: 'http://localhost:8003/Resources/Images/',
  ALLOW_ANONYMOUS: '?_allow_anonymous=true',
  production: true,
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
