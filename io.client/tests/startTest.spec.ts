//import { test, expect } from '@playwright/test';

//test('should start a test successfully', async ({ page }) => {
//    // Otwórz stronê kursu z testami
//    await page.goto('https://localhost:59127/#/course/1/tests'); // Upewnij siê, ¿e `/course/1/tests` to poprawna œcie¿ka

//    // SprawdŸ, czy strona siê za³adowa³a
//    await expect(page.locator('h4')).toHaveText('Test Panel');

//    // ZnajdŸ pierwsz¹ kartê testu
//    const testCards = page.locator('.MuiCard-root'); // Klasa `MuiCard-root` u¿ywana przez Material-UI dla kart
//    const firstTestCard = testCards.first();
//    await expect(firstTestCard).toBeVisible();

//    // Pobierz nazwê testu
//    const testName = await firstTestCard.locator('h6').textContent();

//    // Kliknij przycisk "Start test"
//    const startButton = firstTestCard.locator('button:has-text("Start test")');
//    await expect(startButton).toBeVisible();
//    await startButton.click();

//    // SprawdŸ, czy pojawi³ siê komunikat o sukcesie
//    const successSnackbar = page.locator('div[role="alert"]');
//    await expect(successSnackbar).toHaveText(`Test "${testName}" started successfully!`);

//    // SprawdŸ, czy daty startu i koñca testu zosta³y zaktualizowane
//    const dateText = await firstTestCard.locator('text=Dates:').textContent();
//    expect(dateText).not.toContain('Not set');
//});

//import { test, expect } from '@playwright/test';

//test('should delete a test successfully', async ({ page }) => {
//    // Otwórz stronê kursu z testami
//    await page.goto('https://localhost:59127/#/course/1/tests'); // Upewnij siê, ¿e `/course/1/tests` to poprawna œcie¿ka

//    // SprawdŸ, czy strona siê za³adowa³a
//    await expect(page.locator('h4')).toHaveText('Test Panel');

//    // ZnajdŸ pierwsz¹ kartê testu
//    const testCards = page.locator('.MuiCard-root'); // Klasa `MuiCard-root` u¿ywana przez Material-UI dla kart
//    const firstTestCard = testCards.first();
//    await expect(firstTestCard).toBeVisible();

//    // Pobierz nazwê testu
//    const testName = await firstTestCard.locator('h6').textContent();

//    // Przechwyæ okno dialogowe i zaakceptuj je
//    page.on('dialog', async (dialog) => {
//        expect(dialog.message()).toContain(`Are you sure you want to delete the test "${testName}"?`);
//        await dialog.accept();
//    });

//    // Kliknij przycisk "Delete test"
//    const deleteButton = firstTestCard.locator('button:has-text("Delete test")');
//    await expect(deleteButton).toBeVisible();
//    await deleteButton.click();

//});
