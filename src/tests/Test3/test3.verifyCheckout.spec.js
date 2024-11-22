/* eslint-disable no-await-in-loop */
/* eslint-disable indent */
import { expect } from '@playwright/test';
import { test } from '../../fixtures/base';

test.describe('Test3 => Add several random Products to Cart, checkout, verify products and total price', () => {
    test('should login successfully, add products to cart, checkout, verify products and total price', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin('standard_user', 'secret_sauce');

        await expect(app.inventory.headerTitle).toBeVisible();

        const productCount = await app.inventory.inventoryItems.count();

        const randomNumbers = new Set();
        while (randomNumbers.size < Math.min(2, productCount)) {
            randomNumbers.add(Math.floor(Math.random() * productCount));
        }

        const uniqueRandomNumbers = Array.from(randomNumbers);
        console.log(uniqueRandomNumbers);

        const selectedProducts = [];

        for (const index of uniqueRandomNumbers) {
            const product = await app.inventory.inventoryItems.nth(index);

            const name = await app.inventory.getItemName(product);
            const description = await app.inventory.getItemDescription(product);
            const price = await app.inventory.getItemPrice(product);

            console.log(`Selected product name: ${name}`);
            console.log(`Selected product description: ${description}`);
            console.log(`Selected product price: ${price}`);

            selectedProducts.push({ name, description, price });

           await product.locator('[id^="add-to-cart"]').click();
        }
         
        await app.baseSwagLab.clickShoppingCartLink();

        await app.shoppingCart.clickCheckoutButton();

        await app.page.waitForURL('/checkout-step-one.html');

        await expect(app.checkoutInfo.pageTitle).toBeVisible();
       
        await app.checkoutInfo.performCheckout('Nataliya', 'Ignatova', '88000');

        await expect(app.checkoutSummary.pageTitle).toBeVisible();


        // ------------------------------------
         
        const checkoutItems = await app.checkoutSummary.getAllCheckoutItems();

        const checkoutItemsCount = await checkoutItems.count();
        console.log(`Number of items on checkout: ${checkoutItemsCount}`);

        await expect(checkoutItemsCount).toBe(selectedProducts.length);

        let calculatedTotalPrice = 0;

        for (const product of selectedProducts) {
           const checkoutItem = await app.checkoutSummary.getCheckoutItemByName(product.name);
    
           console.log(`Verifying checkout item for product: ${product.name}`);
           console.log(`Checkout Item Name: ${await checkoutItem.textContent()}`);
           console.log(`Checkout Item Description: ${await checkoutItem.locator(app.checkoutSummary.checkoutItemDescription).textContent()}`);
           console.log(`Checkout Item Price: ${await checkoutItem.locator(app.checkoutSummary.checkoutItemPrice).textContent()}`);

           const itemName = await checkoutItem.locator(app.checkoutSummary.checkoutItemName);
           const itemDescription = await checkoutItem.locator(app.checkoutSummary.checkoutItemDescription);
           const itemPrice = await checkoutItem.locator(app.checkoutSummary.checkoutItemPrice);
    
           await expect(itemName).toHaveText(product.name);
           await expect(itemDescription).toHaveText(product.description);
           await expect(itemPrice).toHaveText(product.price);


           const priceText = await itemPrice.textContent();

           const price = await parseFloat(priceText.replace('$', ''));

           calculatedTotalPrice += price;
        }
        
        console.log(`Calculated total price => ${calculatedTotalPrice}`);

        const displayedTotalPrice = await app.checkoutSummary.getTotalPrice();

        console.log(`Displayed total price => ${displayedTotalPrice}`)

        await expect(displayedTotalPrice).toBe(calculatedTotalPrice);
    });
});