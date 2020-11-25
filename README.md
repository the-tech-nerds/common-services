## Common Services

This is the common hub for all our reusable code/scripts. This
is a must to include in any microservices before starting work.

## Installations in other microservices

Add the following dependencies in your package.json

```
"@technerds/common-services": "git@github.com:the-tech-nerds/common-services.git#73ccca6",
```

We can see the commit number is added at last (after # sign) to 
make sure the version of this package we are using.

As it is a shared package all services that will use 
this package must have some common dependencies. This 
common dependencies must be added both as `peerDependencies`
and `devDependencies` in this package and as `devDependencies`
for the host services.

For example: this service requires `nest-common` and other 
dependencies, but all our services are also using nest-common.
So, we can add this as `peerDepenecy` so that whenever it is 
installed in a host service, it can resolve the dependencies
from the host services:

```json
// package.json of common-service
"peerDependencies": {
    "@nestjs/common": "^7.0.0",
    "@nestjs/core": "^7.0.0",
    "@nestjs/platform-express": "^7.0.0",
    "cache-manager": "^3.4.0",
    "cache-manager-redis-store": "^2.0.0",
    "reflect-metadata": "^0.1.13"
}

"devDependencies": {
    "@nestjs/common": "^7.0.0",
    "@nestjs/core": "^7.0.0",
    "@nestjs/platform-express": "^7.0.0",
    "cache-manager": "^3.4.0",
    "cache-manager-redis-store": "^2.0.0",
    "reflect-metadata": "^0.1.13",
    ...other dependencies
}
```


```json
// package.json of host service
"devDependencies": {
    "@nestjs/common": "^7.0.0",
    "@nestjs/core": "^7.0.0",
    "@nestjs/platform-express": "^7.0.0",
    "cache-manager": "^3.4.0",
    "cache-manager-redis-store": "^2.0.0",
    "reflect-metadata": "^0.1.13",
    ...other dependencies
}
```

## Publishing Common Service

As we are using this service as a git npm dependency,
we have to build this each time before we commit this. 
To do so, build it buy:

```
    npm run build
```

Also dont forget to add the latest commit hash in the `package
-json` to use the latest version of this package.