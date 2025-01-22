//import { test, expect } from '@playwright/test';

//test.describe('Add Course Form Tests', () => {
//    test.beforeEach(async ({ page }) => {
//        // Za³adowanie strony z formularzem dodawania kursu
//        await page.goto('https://localhost:59127/#/AddCourse'); // Zmiana URL w zale¿noœci od tego, gdzie formularz jest dostêpny
//    });

//    // Test sprawdzaj¹cy, czy formularz jest wyœwietlany
//    test('should display the add course form correctly', async ({ page }) => {
//        // Sprawdzenie, czy formularz jest wyœwietlany
//        await expect(page.locator('text=Create a Course')).toBeVisible();
//        await expect(page.locator('input[name="name"]')).toBeVisible();
//        await expect(page.locator('input[name="category"]')).toBeVisible();
//        await expect(page.locator('input[name="description"]')).toBeVisible();
//        await expect(page.locator('button[type="submit"]')).toBeVisible();
//    });

//    // Test walidacji pustych pól formularza
//    test('should show validation errors for required fields', async ({ page }) => {
//        await page.fill('input[name="name"]', '');
//        await page.fill('input[name="category"]', '');
//        await page.fill('input[name="description"]', '');

//        await page.click('button[type="submit"]'); // Wysy³anie formularza bez danych

//        // Sprawdzenie b³êdów walidacji
//        await expect(page.locator('text=Name is required')).toBeVisible();
//        await expect(page.locator('text=Category is required')).toBeVisible();
//        await expect(page.locator('text=Description is required')).toBeVisible();
//    });

//    // Test sprawdzaj¹cy, czy b³êdy na serwerze s¹ poprawnie obs³ugiwane
//    test('should show an error message when server request fails', async ({ page }) => {
//        // Symulujemy wprowadzenie poprawnych danych
//        await page.fill('input[name="name"]', 'Test Course2');
//        await page.fill('input[name="category"]', 'Science');
//        await page.fill('input[name="description"]', 'Course description');

//        // Symulujemy, ¿e backend zwróci b³¹d
//        page.on('response', (response) => {
//            if (response.url().includes('/api/AddCourse/addCourse')) {
//                response.status(500); // Mo¿esz zmieniæ kod statusu na taki, który symuluje b³¹d na backendzie
//            }
//        });

//        // Klikamy przycisk submit
//        await page.click('button[type="submit"]');

//        // Sprawdzamy, czy wyœwietlono komunikat o b³êdzie
//        await expect(page.locator('text=Error while creating the course')).toBeVisible(); // Dopasuj ten komunikat do tego, co wyœwietla Twoja aplikacja
//    });
//});
