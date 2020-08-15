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

  const productsMock = sinon.stub(listFile, "default")
    .returns(Promise.resolve(mockProducts));
  
  const nonExistantProduct = await getProduct("false/01");
  assert.deepEqual(
    nonExistantProduct,
    {
      sku: 'false/01',
      stock: 0
    },
    'A non existant product is returned with a stock of 0'
  );

  const product = await getProduct('LTV719449/39/39');
  assert.deepEqual(product, mockProducts[0], "The correct product is returned if found");


  productsMock.restore();
  assert.end();
})