require('dotenv').config();
const puppeteer = require('puppeteer');

const totalLoop = 2;
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1366, height: 768 },
  });
  const page = await browser.newPage();
  await page.goto('https://anyway.fm/member.php');

  await page.$eval('div.login-box', el => el.classList.add('show'));
  await page.$eval('input[name=email]', (el, un) => el.value = un, process.env.USERNAME);
  await page.$eval('input[name=password]', (el, pw) => el.value = pw, process.env.PASSWORD);
  await page.click('button[type=submit]');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    // why should click twice?
    page.click('button[type=submit]'),
  ]);

  await page.goto('https://anyway.fm/profile.php?tab=cuigeng');

  for (let x = 0; x < totalLoop; x++) {
    for (let i = 0; i < 5; i++) {
      await page.click('div.cuigeng-btn');
      // await page.waitForSelector('div.cuigeng-btn');
      console.log('Clicked', i + 1);
      await sleep(2500);
    }
    await page.reload({ waitUntil: 'load' });
  }


  await browser.close();
})();
