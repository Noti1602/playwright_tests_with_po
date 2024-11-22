/* eslint-disable indent */
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

        const originalPrices = await app.inventory.itemPrice.evaluateAll(
            items => items.map(item => parseFloat(item.textContent.replace('$', '')))
        );

        await app.inventory.selectOption('lohi');

        const sortedPrices = await app.inventory.itemPrice.evaluateAll(
            items => items.map(item => parseFloat(item.textContent.replace('$', '')))
        );

          expect(sortedPrices).toEqual([...originalPrices].sort((a, b) => a - b));
    });
});
