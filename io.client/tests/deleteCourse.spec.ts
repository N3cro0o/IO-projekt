//import { test, expect } from '@playwright/test';

//test.describe('Course Deletion Tests', () => {
//    test.beforeEach(async ({ page }) => {
//        // Przejdü do aplikacji przed kaødym testem
//        await page.goto('https://localhost:59127/#/CourseManagment'); // ZmieÒ URL na w≥aúciwy adres twojej aplikacji
//    });

//    test('should delete a course successfully', async ({ page }) => {
//        // Sprawdü, czy tabela kursÛw jest widoczna
//        const courseTable = page.locator('table');
//        await expect(courseTable).toBeVisible();

//        // Wybierz pierwszy kurs w tabeli
//        const firstCourseRow = courseTable.locator('tbody tr').first();
//        const courseName = await firstCourseRow.locator('td').first().textContent();

//        // Kliknij przycisk Delete dla pierwszego kursu
//        const deleteButton = firstCourseRow.locator('button:has-text("Delete")');
//        await deleteButton.click();

//        // Potwierdü okno dialogowe
//        await page.once('dialog', async (dialog) => {
//            expect(dialog.message()).toContain(`Are you sure about deleting course: "${courseName}"?`);
//            await dialog.accept();
//        });

//        // Sprawdü, øe kurs zosta≥ usuniÍty z tabeli
//        await expect(firstCourseRow).not.toBeVisible();

//        // Opcjonalne: Sprawdü komunikat o usuniÍciu
//        const deleteMessage = page.locator('div:has-text("Deleted course:")');
//        await expect(deleteMessage).toHaveText(`Deleted course: ${courseName}`);
//    });

//    test('should not delete course when dialog is cancelled', async ({ page }) => {
//        // Wybierz pierwszy kurs w tabeli
//        const firstCourseRow = page.locator('table tbody tr').first();
//        const deleteButton = firstCourseRow.locator('button:has-text("Delete")');
//        await deleteButton.click();

//        // OdrzuÊ okno dialogowe
//        await page.once('dialog', async (dialog) => {
//            await dialog.dismiss();
//        });

//        // Sprawdü, czy kurs nadal istnieje w tabeli
//        await expect(firstCourseRow).toBeVisible();
//    });
//});
