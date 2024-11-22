/* eslint-disable no-await-in-loop */
/* eslint-disable indent */
import { expect } from '@playwright/test';
import { test } from '../../fixtures/base';

test.describe('Test2 => Add several random Products to Cart and verify them', () => {
    test('should login successfully, add products to cart and verify them', async (
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

        await expect(app.shoppingCart.headerTitle).toBeVisible();
         
        const cartItems = await app.shoppingCart.getAllCartItems();

        const cartItemsCount = await cartItems.count();
        console.log(`Number of items in the shopping cart: ${cartItemsCount}`);

        for (const product of selectedProducts) {
           const cartItem = await app.shoppingCart.getCartItemByName(product.name);
    
           console.log(`Verifying cart item for product: ${product.name}`);
           console.log(`Cart Item Name: ${await cartItem.textContent()}`);
           console.log(`Cart Item Description: ${await cartItem.locator(app.shoppingCart.cartItemDescription).textContent()}`);
           console.log(`Cart Item Price: ${await cartItem.locator(app.shoppingCart.cartItemPrice).textContent()}`);

    
           await expect(cartItem.locator(app.shoppingCart.cartItemName)).toHaveText(product.name);
           await expect(cartItem.locator(app.shoppingCart.cartItemDescription)).toHaveText(product.description);
           await expect(cartItem.locator(app.shoppingCart.cartItemPrice)).toHaveText(product.price);
        }

        await expect(cartItemsCount).toBe(selectedProducts.length);
    });
});