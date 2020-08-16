import readline from 'readline';

import getProduct from './lib/Products/get';
import recalculateStock from './lib/Products/recalculateStock';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function handleInput(sku:string) {
  let product = await getProduct(sku);
  console.log(`Product ${sku} has an existing stock of ${product.stock}. Calculating change`);
  product = await recalculateStock(product);
  console.log(`Updated Stock value for product ${sku} is: ${product.stock}`);
  rl.close();
}

function start() {
  rl.question('Please enter an SKU: ', handleInput);
}

start();
