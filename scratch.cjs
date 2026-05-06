const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  } catch (err) {
    console.log('GOTO ERROR:', err);
  }

  await browser.close();
})();
