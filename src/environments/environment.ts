// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  version: "0.3.1",
  production: false,
  apiBaseUrl: "http://localhost:5000",
  baseUrl: "http://localhost:4200",
  analytics: "https://analytics.koraki.io",
  auth: {
    clientID: 'gn0sF3vg8ziAWNS3EzdHIYR26x5564Vn',
    domain: 'koraki.auth0.com',
    redirect: 'http://localhost:4200/auth/login',
    audience: 'https://koraki.auth0.com/userinfo',
    scope: 'openid email',
    namespace: 'http://koraki.io',
    autoRenewToken: true,
    dynamicRedirect: true
  },
  integrations: {
    mailchimp: {
      clientId: "708985200989"
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
      "All premium integrations",
      "Live analytics",
    ],
    tier1: [
      "3 websites",
      "Unlimited active notifications",
      "5K sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial for new users"
    ],
    tier2: [
      "Unlimited websites",
      "Unlimited active notifications",
      "Unlimited sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial for new users"
    ],
    tier1shopify: [
      "1 shopify store",
      "Unlimited active notifications",
      "Unlimited sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial"
    ],
    tier2shopify: [
      "Unlimited shopify stores",
      "Unlimited active notifications",
      "Unlimited sessions per website",
      "Live analytics",
      "All premium integrations",
      "~14 days free trial"
    ]
  },
  planIcons: {
    free: "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/basic-plan.png",
    tier1: "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/personal-plan.png",
    tier2: "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/enterprise-plan.png",
    tier1shopify: "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/personal-plan-shopify.png",
    tier2shopify: "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/enterprise-plan-shopify.png"
  },
  stripePublicKey : "pk_test_JMl4h4YIUrGfy66IluaI5dJo",
  ccIconPath : "https://koraki-adminui-assets.s3.us-east-2.amazonaws.com/"
};
