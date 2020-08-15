import sinon from 'sinon';
import test, { Test } from 'tape';
import * as listFile from '../src/lib/Products/list';
import getProduct from "../src/lib/Products/get";

test("Test that product get works as expected", async(assert:Test) => {
  assert.plan(2);

  const mockProducts = [
    {
      sku: 'LTV719449/39/39',
      stock: 8525,
    },
    {
      sku: 'CLQ274846/07/46',
      stock: 8414,
    }
  ];

  // We don't want to actually go to the file, so lets mock the listing function
  const productsMock = sinon.stub(listFile, "default")
    .returns(Promise.resolve(mockProducts));
  
  // Test that a none-existing product comes back with a stock of 0
  const nonExistantProduct = await getProduct("false/01");
  assert.deepEqual(
    nonExistantProduct,
    {
      sku: 'false/01',
      stock: 0
    },
    'A non existant product is returned with a stock of 0'
  );

  // Test that an existing product comes back with the correct information
  const product = await getProduct('LTV719449/39/39');
  assert.equal(
    product.stock,
    mockProducts[0].stock,
    `The correct product is returned if found (stock ${mockProducts[0].stock})`
  );


  productsMock.restore();
  assert.end();
})