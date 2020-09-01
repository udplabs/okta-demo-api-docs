# okta-demo-api-docs

> Front End to the okta-demo-api

## Local development
* `cd` into `/okta-demo-api-docs` directory
* Run `npm install`
* Create a `.env` file with the following contents:
```
VUE_APP_API_URL="{ url where the api is deployed }"
VUE_APP_UDP_API="{ url where udp api is deployed }"
```
* Run `npm run dev` to serve locally
* Open a browser to `localhost:8080`

## Build Static Files
* Run `npm run build`
    (Build is in `/docs/.vuepress/dist`)

For more details, please head VuePress's [documentation](https://v1.vuepress.vuejs.org/).

