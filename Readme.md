# Gatsby Source Square Catalog

Gatsby source that pulls data from the Square Catalog.

## Install

Install from NPM.

```
npm install --save gatsby-source-square-catalog
```

Add to your `gatsby-config.js` plugins config.

```js
plugins: [
  {
    resolve: `gatsby-source-square-catalog`,
    options: {
      token: 'YOUR_SQUARE_TOKEN'
    }
  }
]
```

## Usage

Through graphql you can now query for `SquareCategory`, `SquareItem` and `SquareModifierList` with the normal methods.

