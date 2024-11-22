import { BasePage } from './Base.page';

export class CheckoutInfoPage extends BasePage {
    pageTitle = this.page.locator('.title');

    firstNameInput = this.page.locator('#first-name');

    lastNameInput = this.page.locator('#last-name');

    postalCodeInput = this.page.locator('#postal-code');

    cancelButton = this.page.locator('#cancel');

    continueButton = this.page.locator('#continue');

    async performCheckout(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }
}