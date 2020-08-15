import Product from '../../Interfaces/Product';
import listProducts from './list';

/**
 *
 * @param sku A product SKU code
 */
export default async function getProduct(sku:String): Promise<Product> {
  const productList:Array<Product> = await listProducts();

  const foundProduct = productList.find((product) => product.sku === sku);

  // In the event that a product with that sku could not be found
  // return a new product with the given sku and zero stock
  return foundProduct || {
    sku,
    stock: 0,
  };
}
