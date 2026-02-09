import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5177";

test.describe("Collapse/expand paragraphs", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(BASE_URL);
		await page.evaluate(() => localStorage.clear());
		await page.reload();

		// Load demo content
		await page.getByRole("button", { name: "Try demo" }).click();

		// Wait for source paragraphs to render
		await expect(page.locator("[data-paragraph-id]").first()).toBeVisible();
	});

	test.describe("Given a source paragraph is expanded", () => {
		test("Then it should show the ⊟ collapse button", async ({ page }) => {
			const collapseBtn = page
				.locator("[data-paragraph-id]")
				.first()
				.getByRole("button", { name: "Collapse" });
			await expect(collapseBtn).toBeVisible();
			await expect(collapseBtn).toHaveText("⊟");
		});

		test("Then the paragraph text should be visible", async ({ page }) => {
			const paragraph = page.locator("[data-paragraph-id]").first();
			const textContent = await paragraph.innerText();
			expect(textContent.length).toBeGreaterThan(5);
		});
	});

	test.describe("When a source paragraph is collapsed", () => {
		test.beforeEach(async ({ page }) => {
			await page
				.locator("[data-paragraph-id]")
				.first()
				.getByRole("button", { name: "Collapse" })
				.click();
		});

		test("Then only the ⊞ expand button should be visible", async ({ page }) => {
			const paragraph = page.locator("[data-paragraph-id]").first();
			const expandBtn = paragraph.getByRole("button", { name: "Expand" });
			await expect(expandBtn).toBeVisible();
			await expect(expandBtn).toHaveText("⊞");
		});

		test("Then no paragraph text should be visible", async ({ page }) => {
			const paragraph = page.locator("[data-paragraph-id]").first();
			const textContent = await paragraph.innerText();
			expect(textContent.trim()).toBe("⊞");
		});

		test("Then no triangle icons should be present", async ({ page }) => {
			const paragraph = page.locator("[data-paragraph-id]").first();
			const text = await paragraph.innerText();
			expect(text).not.toContain("▶");
			expect(text).not.toContain("▼");
		});
	});

	test.describe("When a collapsed paragraph is expanded again", () => {
		test("Then the full text should reappear", async ({ page }) => {
			const paragraph = page.locator("[data-paragraph-id]").first();

			// Capture original text
			const originalText = await paragraph.innerText();

			// Collapse
			await paragraph.getByRole("button", { name: "Collapse" }).click();
			const collapsedText = await paragraph.innerText();
			expect(collapsedText.trim()).toBe("⊞");

			// Expand
			await paragraph.getByRole("button", { name: "Expand" }).click();
			const restoredText = await paragraph.innerText();
			expect(restoredText).toBe(originalText);
		});
	});

	test.describe("Given no triangles are used anywhere", () => {
		test("Then all collapse buttons should use ⊟ not ▼", async ({ page }) => {
			const allButtons = page.getByRole("button", { name: "Collapse" });
			const count = await allButtons.count();
			expect(count).toBeGreaterThan(0);

			for (let i = 0; i < count; i++) {
				await expect(allButtons.nth(i)).toHaveText("⊟");
			}
		});
	});
});
