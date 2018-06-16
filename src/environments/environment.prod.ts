export const environment = {
  production: true,
  apiBaseUrl: "https://koraki-api-backend.azurewebsites.net/",
  auth: {
    clientID: '[YOUR_AUTH0_CLIENT_ID]',
    domain: '[YOUR_AUTH0_DOMAIN]', // e.g., [you].auth0.com
    redirect: 'http://localhost:4200/callback',
    audience: '[YOUR_AUTH0_API]', // e.g., http://localhost:3001/api/
    scope: '[YOUR_AUTH0_SCOPES]', // e.g., openid profile email
    namespace: '[YOUR_AUTH0_NAMESPACE]', // e.g., http://myapp.com/roles,
    autoRenewToken: true, // boolean
    dynamicRedirect: true // boolean
  }
};
