/**
 * A basic interface for a product
 */
export default interface ProductInterface {
  readonly sku: String, // Once set, we shouldn't be changing the sku
  stock: Number
}