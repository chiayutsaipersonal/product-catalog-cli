const {Content} = require('storyblok-ts-client')

const ProductAsset = require('../ProductAsset')
const ProductAssetFolder = require('../ProductAssetFolder')

module.exports = class ProductContent extends Content {
  constructor(
    credentials,
    data,
    parent,
    contentStoryFolders,
    userData,
    productData
  ) {
    super(credentials, data, parent)
    this.contentStoryFolders = contentStoryFolders
    this.userData = userData
    this.productData = productData
    this.assetFolder = new ProductAssetFolder(credentials, {
      name: this.productData.model,
    })
    this.assets = this.productData.photos.map(filePath => {
      return new ProductAsset(credentials, filePath, this.assetFolder)
    })
  }

  async generate() {
    try {
      await this.assetFolder.generate()
      await Promise.all(this.assets.map(a => a.generatePhoto()))
      this.data.content.photoUrls = this.assets.map(asset => {
        return {name: '', filename: asset.prettyUrl}
      })
      await super.generate()
    } catch (error) {
      throw error
    }
  }
}