const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001');

  // Wait for preloader to complete and disappear
  console.log('Waiting for preloader calibration to complete...');
  await page.waitForFunction(() => {
    return !document.getElementById('preloader') && window.__STUDIO?.laptopHinge;
  }, { timeout: 20000 });
  console.log('Preloader finished! Studio scene is live.');

  if (!fs.existsSync('test-shots')) fs.mkdirSync('test-shots');

  const testPoints = [
    { p: 0.00, name: '01_intro_atmosphere' },
    { p: 0.08, name: '02_medallion_in_focus' },
    { p: 0.22, name: '03_phone_pagelit' },
    { p: 0.34, name: '04_phone_ar_system' },
    { p: 0.46, name: '05_phone_battlecows' },
    { p: 0.65, name: '06_laptop_closed_arrival' },
    { p: 0.73, name: '07_laptop_lid_swinging_open' },
    { p: 0.80, name: '08_laptop_open_desktop_slide1' },
    { p: 0.88, name: '09_laptop_open_desktop_slide3' }
  ];

  for (const item of testPoints) {
    await page.evaluate((progress) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.lenis) {
        window.lenis.scrollTo(maxScroll * progress, { immediate: true });
      } else {
        window.scrollTo(0, maxScroll * progress);
      }
      if (window.useExperienceStore) {
        window.useExperienceStore.getState().setScrollProgress(progress);
      }
    }, item.p);

    // Dwell for smooth camera lerp (1.5 seconds)
    await page.waitForTimeout(1500);

    const metrics = await page.evaluate(() => {
      const studio = window.__STUDIO;
      const cam = window.__THREE_CAMERA;
      return {
        hingeRotX: studio?.laptopHinge ? studio.laptopHinge.rotation.x : null,
        camPos: cam ? [cam.position.x.toFixed(2), cam.position.y.toFixed(2), cam.position.z.toFixed(2)] : null,
      };
    });

    console.log(`[Snapshot] ${item.name} at p=${item.p}: HingeRotX=${metrics.hingeRotX?.toFixed(3)}, CamPos=${metrics.camPos}`);
    await page.screenshot({ path: `test-shots/${item.name}.png` });
  }

  await browser.close();
  console.log('Verification finished! All snapshots captured.');
})();
