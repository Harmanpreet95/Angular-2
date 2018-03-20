// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrls: {
    base: 'https://services.myreserv.com/',
    api: 'https://services.myreserv.com/api/',
      // base: 'http://localhost:51035/',
      // api: 'http://localhost:51035/api/',
    },
    dwolla_url: 'https://uat.dwolla.com',
    dwolla_environment: 'sandbox',
    facebook_id: '634579893367426'
};
