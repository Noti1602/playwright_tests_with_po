/* eslint-disable import/prefer-default-export */
import { BaseSwagLabPage } from './BaseSwagLab.page';

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
}
