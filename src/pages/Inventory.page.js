import { BaseSwagLabPage } from './BaseSwagLab.page';
import { test, expect } from '@playwright/test';
import { pickRandomItems } from './../utils/random_item';

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    headerTitle = this.page.locator('.title');

    inventoryItems = this.page.locator('.inventory_item');

    addItemToCartButton = this.page.locator('[id^="add-to-cart"]');

    selectContainer = this.page.locator('.select_container');

    productSortContainer = this.page.locator('.product_sort_container');

    itemName = this.page.locator('.inventory_item_name');

    itemDescription = this.page.locator('.inventory_item_desc');

    itemPrice = this.page.locator('.inventory_item_price');

    async getItemName(item) {
        return item.locator(this.itemName).textContent();
    }

    async getItemDescription(item) {
        return item.locator(this.itemDescription).textContent();
    }

    async getItemPrice(item) {
        return item.locator(this.itemPrice).textContent();
    }

    async addItemToCartById(id) {
        await this.addItemToCartButton.nth(id).click();
    }

    async selectOption(optionValue) {
        return this.productSortContainer.selectOption(optionValue);
    }

    async getItemNames() {
        return this.itemName.evaluateAll(items =>
            items.map(item => item.textContent.trim()));
    }

    async getItemPrices() {
        return this.itemPrice.evaluateAll(items =>
            items.map(item => parseFloat(item.textContent.replace('$', '')))
        );
    }

    async expectSortedProducts(sortBy, productNames, productPrices) {
        switch (sortBy) {
          case 'Name (A to Z)':
            const sortedNamesAZ = await this.getItemNames();
            const expectedNamesAZ = productNames.sort();
            expect(sortedNamesAZ).toEqual(expectedNamesAZ);
            break;
          case 'Name (Z to A)':
            const sortedNamesZA = await this.getItemNames();
            const expectedNamesZA = productNames.sort().reverse();
            expect(sortedNamesZA).toEqual(expectedNamesZA);
            break;
          case 'Price (low to high)':
            const sortedPricesLowHigh = await this.getItemPrices();
            const expectedPricesLowHigh = productPrices.sort((a, b) => a - b);
            expect(sortedPricesLowHigh).toEqual(expectedPricesLowHigh);
            break;
          case 'Price (high to low)':
            const sortedPricesHighLow = await this.getItemPrices();
            const expectedPricesHighLow = productPrices.sort((a, b) => b - a);
            expect(sortedPricesHighLow).toEqual(expectedPricesHighLow);
            break;
          default:
            throw new Error('Sort option is not correct');
        }
      }

      async addRandomProductsToCart(productCount) {
        const uniqueRandomNumbers = await pickRandomItems(3, productCount);
        const selectedProducts = [];

        for (const index of uniqueRandomNumbers) {
            const product = await this.inventoryItems.nth(index);

            const name = await this.getItemName(product);
            const description = await this.getItemDescription(product);
            const price = await this.getItemPrice(product);

            await test.info().attach('Selected product name', { body: JSON.stringify(name, null, 4) });
            await test.info().attach('Selected product description', { body: JSON.stringify(description, null, 4) });
            await test.info().attach('Selected product price', { body: JSON.stringify(price, null, 4) });
            console.log(`Selected product name: ${name}`);
            console.log(`Selected product description: ${description}`);
            console.log(`Selected product price: ${price}`);

            selectedProducts.push({ name, description, price });

           await product.locator('[id^="add-to-cart"]').click();
        }

        return selectedProducts;
    }
}
