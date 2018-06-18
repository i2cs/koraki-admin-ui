# Koraki Admin UI

Koraki admin UI Angular project. 

### Checkout

Checkout master branch
```git checkout https://github.com/i2cs/koraki-admin-ui.git```

### Build and run the project

```npm install```

```npm run serve```

### Changing environments

Environments are configured in ```src/environments``` path. By default the ```environment.ts``` file is used for configs

Change ```apiBaseUrl``` variable to point to the Koraki backend API

```
export const environment = {
  ...  
  apiBaseUrl: "http://localhost:5000",
  auth: {
    ...
  }
};
```

### Run production build

You can validate and build a production ready package with following command

```npm run prod```

Output package will be available on ```/dist``` location

