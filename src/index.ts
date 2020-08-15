import listProducts from './lib/Products/list';

async function fin() {
  const products = await listProducts();
  console.log(products);
}

fin();
