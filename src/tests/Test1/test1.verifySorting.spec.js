import { expect } from '@playwright/test';
import { test } from '../../fixtures/base';

test.describe('Test1 => Perform and verify sorting on the Inventory page', () => {
    test('should login successfully, perform and verify sorting', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin('standard_user', 'secret_sauce');

        await expect(app.inventory.headerTitle).toBeVisible();

        expect(await app.inventory.inventoryItems.count()).toBeGreaterThanOrEqual(1);

        const originalPrices = await app.inventory.getItemPrices();
        const productNames = await app.inventory.getItemNames();

        console.log(originalPrices);
        console.log(productNames);

        await app.inventory.selectOption('az');

        await app.inventory.expectSortedProducts('Name (A to Z)', productNames, originalPrices);

        await app.inventory.selectOption('za');

        await app.inventory.expectSortedProducts('Name (Z to A)', productNames, originalPrices);

        await app.inventory.selectOption('lohi');

        await app.inventory.expectSortedProducts('Price (low to high)', productNames, originalPrices);

        await app.inventory.selectOption('hilo');

        await app.inventory.expectSortedProducts('Price (high to low)', productNames, originalPrices);
    });
});
