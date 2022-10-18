# `dependency-alias-resolve-plugin`

Webpack resolve plugin that will resolve alias for dependency packages


## Usage

```js
const { DependencyAliasResolvePlugin } = require('dependency-alias-resolve-plugin');

module.exports = {
    //...
    resolve: {
        plugins: [
            new DependencyAliasResolvePlugin()
        ]
    }
}
```
