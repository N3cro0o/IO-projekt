//import { test, expect } from '@playwright/test';

//test.describe('Login page tests', () => {
//    test('should display login form correctly', async ({ page }) => {

//        await page.goto('https://localhost:59127/#/loginPage');

//        await expect(page.locator('text=Login to your account')).toBeVisible();
//        await expect(page.locator('input[name="login"]')).toBeVisible();
//        await expect(page.locator('input[name="password"]')).toBeVisible();
//        await expect(page.locator('button[type="submit"]')).toBeVisible();
//    });

//    test('should show error message for empty login or password', async ({ page }) => {
//        await page.goto('https://localhost:59127/#/loginPage');
//        await page.click('button[type="submit"]');
//        await expect(page.locator('text=Enter login')).toBeVisible();
//        await expect(page.locator('text=Enter password')).toBeVisible();
//    });

//    test('should show error for incorrect login details', async ({ page }) => {

//        await page.goto('https://localhost:59127/#/loginPage');


//        await page.fill('input[name="login"]', 'wronguser');
//        await page.fill('input[name="password"]', 'wrongpassword');


//        await page.click('button[type="submit"]');


//        await expect(page.locator('text=Incorrect login details')).toBeVisible();
//    });

//    test('should navigate to UserPanel after successful login', async ({ page }) => {

//        await page.goto('https://localhost:59127/#/loginPage');

//        await page.fill('input[name="login"]', 'siema');
//        await page.fill('input[name="password"]', 'Siema123#');

//        await page.click('button[type="submit"]');


//        await expect(page).toHaveURL('https://localhost:59127/#/UserPanel');
//    });
//});