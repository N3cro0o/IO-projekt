//import { test, expect } from '@playwright/test';

//test.describe('Course Deletion Tests', () => {
//    test.beforeEach(async ({ page }) => {
//        // Przejd� do aplikacji przed ka�dym testem
//        await page.goto('https://localhost:59127/#/CourseManagment'); // Zmie� URL na w�a�ciwy adres twojej aplikacji
//    });

//    test('should delete a course successfully', async ({ page }) => {
//        // Sprawd�, czy tabela kurs�w jest widoczna
//        const courseTable = page.locator('table');
//        await expect(courseTable).toBeVisible();

//        // Wybierz pierwszy kurs w tabeli
//        const firstCourseRow = courseTable.locator('tbody tr').first();
//        const courseName = await firstCourseRow.locator('td').first().textContent();

//        // Kliknij przycisk Delete dla pierwszego kursu
//        const deleteButton = firstCourseRow.locator('button:has-text("Delete")');
//        await deleteButton.click();

//        // Potwierd� okno dialogowe
//        await page.once('dialog', async (dialog) => {
//            expect(dialog.message()).toContain(`Are you sure about deleting course: "${courseName}"?`);
//            await dialog.accept();
//        });

//        // Sprawd�, �e kurs zosta� usuni�ty z tabeli
//        await expect(firstCourseRow).not.toBeVisible();

//        // Opcjonalne: Sprawd� komunikat o usuni�ciu
//        const deleteMessage = page.locator('div:has-text("Deleted course:")');
//        await expect(deleteMessage).toHaveText(`Deleted course: ${courseName}`);
//    });

//    test('should not delete course when dialog is cancelled', async ({ page }) => {
//        // Wybierz pierwszy kurs w tabeli
//        const firstCourseRow = page.locator('table tbody tr').first();
//        const deleteButton = firstCourseRow.locator('button:has-text("Delete")');
//        await deleteButton.click();

//        // Odrzu� okno dialogowe
//        await page.once('dialog', async (dialog) => {
//            await dialog.dismiss();
//        });

//        // Sprawd�, czy kurs nadal istnieje w tabeli
//        await expect(firstCourseRow).toBeVisible();
//    });
//});
