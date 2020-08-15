/**
 * A basic interface for a product
 */
export default interface Product {
  readonly sku: String, // Once set, we shouldn't be changing the sku
  stock: number
}
