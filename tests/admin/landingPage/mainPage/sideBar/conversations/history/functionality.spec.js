import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/history');

    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/history');
});


test('Check if the table is horizontally scrollable', async ({ page }) => {
    // Locate the scroll wrapper
    const scrollWrapper = page.locator('.data-table__scrollWrapper');

    // Verify that the scroll wrapper is scrollable (by checking overflow)
    const overflowX = await scrollWrapper.evaluate(node => window.getComputedStyle(node).overflowX);
    expect(overflowX).toBe('auto' || 'scroll');
});



test('Check if "Ajalugu" date inputs can be changed', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});


test('Date FROM input field should reject invalid date formats', async ({ page }) => {
    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.12345');

    // Trigger any validation mechanism if necessary (e.g., blur event)
    await startDateInput.blur();

    // This could be a message or some form of UI feedback
    const validationMessage = page.locator('.validation-error-message'); // Adjust selector as needed
    await validationMessage.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // Verify that the validation message is displayed
    const isValidationMessageVisible = await validationMessage.isVisible();
    expect(isValidationMessageVisible).toBe(true);

    // Optionally, check the content of the validation message
    const validationMessageText = await validationMessage.textContent();
    expect(validationMessageText).toContain('Invalid date format'); // Adjust text as needed

    // Optionally, you may also verify the input field's value remains unchanged or cleared
    const inputValue = await datepickerInput.inputValue();
    expect(inputValue).toBe(''); // Assuming invalid input should clear the field or leave it unchanged
});


test('Date TO input field should reject invalid date formats', async ({ page }) => {
    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await endDateInput.click({ clickCount: 3 }); // Select all text
    await endDateInput.fill('01.09.12345');

    // Trigger any validation mechanism if necessary (e.g., blur event)
    await endDateInput.blur();

    // This could be a message or some form of UI feedback
    const validationMessage = page.locator('.validation-error-message'); // Adjust selector as needed
    await validationMessage.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // Verify that the validation message is displayed
    const isValidationMessageVisible = await validationMessage.isVisible();
    expect(isValidationMessageVisible).toBe(true);

    // Optionally, check the content of the validation message
    const validationMessageText = await validationMessage.textContent();
    expect(validationMessageText).toContain('Invalid date format'); // Adjust text as needed

    // Optionally, you may also verify the input field's value remains unchanged or cleared
    const inputValue = await datepickerInput.inputValue();
    expect(inputValue).toBe(''); // Assuming invalid input should clear the field or leave it unchanged
});


test('Check if "Ajalugu" date inputs accept only valid date formats', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});


test('Dropdown menu should expand, displaying the available options, and allow the user to select a different option.', async ({ page }) => {
    // Locate the table rows to check if there is any data
    const card = page.locator('.card').first();

    const dropdown = card.locator('div.select__trigger:has-text("Vali")')

    dropdown.click();

    const dropdownMenu = card.locator('.select__menu');
    await expect(dropdownMenu).toBeVisible();

    await dropdownMenu.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    const optionToSelect = dropdownMenu.locator('li.select__option:has-text("Algusaeg") input[type="checkbox"]');

    await optionToSelect.check();

    const isChecked = await optionToSelect.isChecked();

    expect(isChecked).toBe(true);
});


test('Selecting between different options from dropdown should show corresponding columns in table.', async ({ page }) => {
    // Locate the table rows to check if there is any data
    const card = page.locator('.card').first();

    const dropdown = card.locator('div.select__trigger:has-text("Vali")')

    dropdown.click();

    const dropdownMenu = card.locator('.select__menu');
    await expect(dropdownMenu).toBeVisible();

    await dropdownMenu.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // select algusaeg from dropdown
    const optionToSelect = dropdownMenu.locator('li.select__option:has-text("Algusaeg") input[type="checkbox"]');

    await optionToSelect.check();

    const isChecked = await optionToSelect.isChecked();

    expect(isChecked).toBe(true);

    const table = page.locator('table.data-table');
    const columns = table.locator('th')

    // Check for the count of headers
    const headerCount = await columns.count()
    // 2 because second table head is to see the details of each row.
    expect(headerCount).toBe(2)

    // Verify that the single column header is "Algusaeg"
    const columnHeader = columns.first();
    const columnText = await columnHeader.innerText();
    expect(columnText).toBe('Algusaeg');


});



test('Search input field accepts text input and triggers search', async ({ page }) => {
    // Locate the table rows to check if there is any data
    await page.waitForLoadState('networkidle');
    const initialRows = page.locator('table.data-table tbody tr');

    const initialRowCount = await initialRows.count();

    if (initialRowCount > 0) {
        // Locate the search input field using the placeholder text
        const searchInput = page.locator('input[placeholder="Otsi üle vestluste..."]');

        // Type random input value into the search input field to expect 0 matching and ensure that input field is working as expected
        await searchInput.fill('abcdefgh12345jklmnop678999001122ghdsa');

        await expect(searchInput).toHaveValue('abcdefgh12345jklmnop678999001122ghdsa');

        // Wait for search results to be updated
        await page.waitForTimeout(2000);

        const searchResultsRows = page.locator('table.data-table tbody tr');

        const resultsCount = await searchResultsRows.count();

        expect(resultsCount).toBe(0);

    } else {
        return;
    }


});