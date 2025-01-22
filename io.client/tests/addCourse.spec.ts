//import { test, expect } from '@playwright/test';

//test.describe('Add Course Form Tests', () => {
//    test.beforeEach(async ({ page }) => {
//        // Za�adowanie strony z formularzem dodawania kursu
//        await page.goto('https://localhost:59127/#/AddCourse'); // Zmiana URL w zale�no�ci od tego, gdzie formularz jest dost�pny
//    });

//    // Test sprawdzaj�cy, czy formularz jest wy�wietlany
//    test('should display the add course form correctly', async ({ page }) => {
//        // Sprawdzenie, czy formularz jest wy�wietlany
//        await expect(page.locator('text=Create a Course')).toBeVisible();
//        await expect(page.locator('input[name="name"]')).toBeVisible();
//        await expect(page.locator('input[name="category"]')).toBeVisible();
//        await expect(page.locator('input[name="description"]')).toBeVisible();
//        await expect(page.locator('button[type="submit"]')).toBeVisible();
//    });

//    // Test walidacji pustych p�l formularza
//    test('should show validation errors for required fields', async ({ page }) => {
//        await page.fill('input[name="name"]', '');
//        await page.fill('input[name="category"]', '');
//        await page.fill('input[name="description"]', '');

//        await page.click('button[type="submit"]'); // Wysy�anie formularza bez danych

//        // Sprawdzenie b��d�w walidacji
//        await expect(page.locator('text=Name is required')).toBeVisible();
//        await expect(page.locator('text=Category is required')).toBeVisible();
//        await expect(page.locator('text=Description is required')).toBeVisible();
//    });

//    // Test sprawdzaj�cy, czy b��dy na serwerze s� poprawnie obs�ugiwane
//    test('should show an error message when server request fails', async ({ page }) => {
//        // Symulujemy wprowadzenie poprawnych danych
//        await page.fill('input[name="name"]', 'Test Course2');
//        await page.fill('input[name="category"]', 'Science');
//        await page.fill('input[name="description"]', 'Course description');

//        // Symulujemy, �e backend zwr�ci b��d
//        page.on('response', (response) => {
//            if (response.url().includes('/api/AddCourse/addCourse')) {
//                response.status(500); // Mo�esz zmieni� kod statusu na taki, kt�ry symuluje b��d na backendzie
//            }
//        });

//        // Klikamy przycisk submit
//        await page.click('button[type="submit"]');

//        // Sprawdzamy, czy wy�wietlono komunikat o b��dzie
//        await expect(page.locator('text=Error while creating the course')).toBeVisible(); // Dopasuj ten komunikat do tego, co wy�wietla Twoja aplikacja
//    });
//});
