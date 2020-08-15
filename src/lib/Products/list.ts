import fs from 'fs';
import Path from 'path';
import util from 'util';
import Product from '../../Interfaces/Product';

export const asyncReadFile = util.promisify(fs.readFile);

/**
 * The path to the products file
 */
const productsFilePath = Path.join(__dirname, '../../../data/stock.json');

/**
 *
 */
export default async function listProducts():Promise<Array<Product>> {
  // I could require this json file but I figure that reading the file
  // is a better bet, as this is in theory meant to be a simulation of accessing
  // a database
  try {
    console.log(`Fetching Products from "${productsFilePath}"`);
    const productsText = await asyncReadFile(productsFilePath, 'utf8');
    const products = JSON.parse(productsText);
    console.log(`Fetched ${products.length} Products`);
    return products;
  } catch (e) {
    throw new Error(`Failed to fetch products with reason: ${e.message}`);
  }
}
