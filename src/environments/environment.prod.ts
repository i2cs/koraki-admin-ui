export const environment = {
  version: "0.2.0",
  production: true,
  apiBaseUrl: "https://api.koraki.io",
  baseUrl: "https://app.koraki.io",
  analytics: "https://analytics.koraki.io",
  auth: {
    clientID: 'gn0sF3vg8ziAWNS3EzdHIYR26x5564Vn',
    domain: 'koraki.auth0.com',
    redirect: 'https://app.koraki.io/auth/login',
    audience: 'https://koraki.auth0.com/userinfo',
    scope: 'openid email',
    namespace: 'http://koraki.io',
    autoRenewToken: true,
    dynamicRedirect: true
  },
  integrations: {
    mailchimp: {
      clientId: "592621747124"
    },
    facebook: {
      clientId: "1710573302367584"
    },
    shopify: {
      appInstallUrl: "https://apps.shopify.com/koraki-io"
    }
  },
  plans: {
    free: [
      "1 website",
      "8 active notifications",
      "1K sessions per website",
      "Basic integrations",
      "!Live analytics",
    ],
    tier1: [
      "3 websites",
      "Unlimited active notifications",
      "5K sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial"
    ],
    tier2: [
      "Unlimited websites",
      "Unlimited active notifications",
      "Unlimited sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial"
    ]
  },
  planIcons: {
    free: "https://s3.us-east-2.amazonaws.com/koraki-adminui-assets/basic-plan.png",
    tier1: "https://s3.us-east-2.amazonaws.com/koraki-adminui-assets/personal-plan.png",
    tier2: "https://s3.us-east-2.amazonaws.com/koraki-adminui-assets/enterprise-plan.png",
  },
  stripePublicKey : "pk_live_TXj3ceup0EX871fvvPkGNIJz",
  ccIconPath : "https://s3.us-east-2.amazonaws.com/koraki-adminui-assets/"
};