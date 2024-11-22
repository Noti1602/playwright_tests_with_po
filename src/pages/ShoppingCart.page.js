import { BaseSwagLabPage } from './BaseSwagLab.page';

// eslint-disable-next-line import/prefer-default-export
export class ShoppingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    headerTitle = this.page.locator('.title');

    cartItems = this.page.locator(this.cartItemSelector);

    cartItemName = this.page.locator('.inventory_item_name');

    cartItemDescription = this.page.locator('.inventory_item_desc');

    cartItemPrice = this.page.locator('.inventory_item_price');

    checkOutButton = this.page.locator('#checkout');

    async getAllCartItems() {
        return this.page.locator(this.cartItemSelector); // Returns a locator for all cart items
    }
    
    // async below added to show the function returns a promise
    async getCartItemByName(name) {
        return this.page.locator(this.cartItemSelector, { hasText: name });
    }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    async clickCheckoutButton() {
        console.log('Attempting to click the checkout button...');
        await this.checkOutButton.click();
        console.log('Clicked the checkout button.');
    }
}
