//import { test, expect } from '@playwright/test';

//test.describe('Registration Page Tests', () => {
//    test('should display registration form correctly', async ({ page }) => {
//        // Otw�rz stron� rejestracji
//        await page.goto('https://localhost:59127/#/Registration');

//        // Sprawd�, czy formularz jest widoczny
//        await expect(page.locator('text=Register an account')).toBeVisible();
//        await expect(page.locator('input[name="login"]')).toBeVisible();
//        await expect(page.locator('input[name="firstName"]')).toBeVisible();
//        await expect(page.locator('input[name="lastName"]')).toBeVisible();
//        await expect(page.locator('input[name="email"]')).toBeVisible();
//        await expect(page.locator('input[name="password"]')).toBeVisible();
//        await expect(page.locator('button[type="submit"]')).toBeVisible();
//    });

//    test('should show validation errors for empty fields', async ({ page }) => {
//        // Otw�rz stron� rejestracji
//        await page.goto('https://localhost:59127/#/Registration');

//        // Kliknij przycisk rejestracji bez wype�niania p�l
//        await page.click('button[type="submit"]');

//        // Sprawd�, czy pojawiaj� si� b��dy walidacji
//        await expect(page.locator('text=Login is required')).toBeVisible();
//        await expect(page.locator('text=First name is required')).toBeVisible();
//        await expect(page.locator('text=Last name is required')).toBeVisible();
//        await expect(page.locator('text=Email is required')).toBeVisible();
//        await expect(page.locator('text=Password is required')).toBeVisible();
//    });

//    test('should show an error message for invalid email format', async ({ page }) => {
//        // Otw�rz stron� rejestracji
//        await page.goto('https://localhost:59127/#/Registration');

//        // Wprowad� niepoprawny email
//        await page.fill('input[name="login"]', 'sasasaas');
//        await page.fill('input[name="firstName"]', 'dsaadsadsads');
//        await page.fill('input[name="lastName"]', 'asdadsadssad');
//        await page.fill('input[name="email"]', 'invalid-email');
//        await page.fill('input[name="password"]', 'Password123#');
     

//        // Kliknij przycisk rejestracji
//        await page.click('button[type="submit"]');

//        // Sprawd�, czy pojawi� si� b��d formatu email
//        await expect(page.locator('text=Please enter a valid email (e.g. something@domain.com)')).toBeVisible();
//    });

//    test('should successfully submit the form and navigate to login page', async ({ page }) => {
//        // Otw�rz stron� rejestracji
//        await page.goto('https://localhost:59127/#/Registration');

//        // Wype�nij formularz danymi
//        await page.fill('input[name="login"]', 'newUser');
//        await page.fill('input[name="firstName"]', 'Przemyslaw');
//        await page.fill('input[name="lastName"]', 'Swierszcz');
//        await page.fill('input[name="email"]', 'john.doe@example.com');
//        await page.fill('input[name="password"]', 'Password123#');

//        // Kliknij przycisk rejestracji
//        await page.click('button[type="submit"]');

//        // Sprawd�, czy strona przekierowa�a na stron� logowania
//        await expect(page).toHaveURL('https://localhost:59127/#/loginPage');
//    });

//    test('should show an error message if registration fails', async ({ page }) => {
//        // Otw�rz stron� rejestracji
//        await page.goto('https://localhost:59127/#/Registration');

//        // Wype�nij formularz danymi, kt�re spowoduj� b��d (np. ju� istniej�cy login)
//        await page.fill('input[name="login"]', 'siema');
//        await page.fill('input[name="firstName"]', 'Jane');
//        await page.fill('input[name="lastName"]', 'Doe');
//        await page.fill('input[name="email"]', 'jane.doe@example.com');
//        await page.fill('input[name="password"]', 'Password123#');

//        // Kliknij przycisk rejestracji
//        await page.click('button[type="submit"]');

//        // Sprawd�, czy pojawi� si� komunikat o b��dzie
//        await expect(page.locator('text=Error during registration')).toBeVisible();
//    });
//});
