export const environment = {
  production: true,
  apiBaseUrl: "https://api.koraki.io",
  analytics: "https://analytics.koraki.io",
  auth: {
    clientID: 'gn0sF3vg8ziAWNS3EzdHIYR26x5564Vn',
    domain: 'koraki.auth0.com',
    redirect: 'https://app.koraki.io/auth/callback',
    audience: 'https://koraki.auth0.com/userinfo',
    scope: 'openid email',
    namespace: 'http://koraki.io',
    autoRenewToken: true,
    dynamicRedirect: true
  }
};