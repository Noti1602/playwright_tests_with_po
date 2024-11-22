import { BasePage } from './Base.page';

export class CheckoutSummaryPage extends BasePage {
    pageTitle = this.page.locator('.title');

    checkoutItemName = this.page.locator('.inventory_item_name');

    checkoutItemDescription = this.page.locator('.inventory_item_desc');

    checkoutItemPrice = this.page.locator('.inventory_item_price');

    checkoutItemSelector = '.cart_item';

    totalPriceSelector = this.page.locator('.summary_subtotal_label');

    async getAllItemPrices() {
        const prices = await this.page.locator(this.checkoutItemPrice).allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async getTotalPrice() {
        const totalPriceText = await this.totalPriceSelector.textContent();
        return parseFloat(totalPriceText.match(/\$([\d.]+)/)[1]);
    }

    async getAllCheckoutItems() {
        return this.page.locator(this.checkoutItemSelector); // Returns a locator for all cart items
    }
    
    async getCheckoutItemByName(name) {
        return this.page.locator(this.checkoutItemSelector, { hasText: name });
    }
}