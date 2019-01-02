const puppeteer = require("puppeteer");
require("dotenv").load();

const fs = require('fs');

var myArgs = process.argv.slice(2);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const strengths = {
  "gh0Vi _2SbBh": 1,
  "_3VX71 _2SbBh": 2,
  "_3NjYP _2SbBh": 3,
  "_6s8NZ _2SbBh": 4
};

(async () => {

let data = [];


  let loginUsingGoogle = process.env.USE_GOOGLE_AUTH;
  let username = process.env.AUTH_USERNAME;
  let password = process.env.AUTH_PASSWORD;
  let plateNumber = process.env.PLATE_NUM;
  let notificationEmail = process.env.NOTIFICATION_EMAIL;

  const browser = await puppeteer.launch({ headless: false, sloMo: 500 });
  const page = await browser.newPage();

  function waitForScopedSelector(selector, scopeElement) {
    return page.waitForFunction(
      (selector, scopeElement) => scopeElement.querySelector(selector),
      {},
      selector,
      scopeElement
    );
  }

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://www.duolingo.com");

  //click the login button
  await page.waitForSelector("button#sign-in-btn");
  await page.click("button#sign-in-btn");

  let navigationPromise = page.waitForNavigation();
  await page.waitForSelector('button[data-test="google-button"]');
  navigationPromise = new Promise(res => browser.on("targetcreated", res));
  await page.click('button[data-test="google-button"]');

  await navigationPromise;
  const pages = await browser.pages();
  const popup = pages[pages.length - 1];
  console.log(popup);

  await popup.waitForSelector('input[type="email"]');
  console.log("found email input");
  await popup.type('input[type="email"]', username);
  await popup.click("#identifierNext");

  await popup.waitForSelector('input[type="password"]', { visible: true });
  await popup.type('input[type="password"]', password);

  await popup.waitForSelector("#passwordNext", { visible: true });
  await popup.click("#passwordNext");

  //login complete

  navigationPromise = page.waitForNavigation();
  await page.waitForSelector('a[data-test="vocab-nav"]');
  await page.click('a[data-test="vocab-nav"]');
  await navigationPromise;

  await page.waitForSelector('span[data-test="hint-token"]', { visible: true });
  const wordRowEHs = await page.$$("tr.VjtrX");

  for (let x = 0; x < 100; x++) {
    let wordDetail = [];
    let wordRowEH = wordRowEHs[x];
    let spanishWord =  await wordRowEH.$eval("td > span", eh => eh.innerText);
    console.log("SPANISH WORD", spanishWord);
    wordDetail.push(spanishWord);

    let partOfSpeech = await wordRowEH.$eval("td:nth-child(2)", eh => eh.innerText);
    console.log("PART OF SPEECH", partOfSpeech);
    wordDetail.push(partOfSpeech);

    let strengthEH = await wordRowEH.$("td:nth-child(4) > span");
    let strengthJH = await strengthEH.getProperty("className");
    let strengthClass = await strengthJH.jsonValue();

    console.log("STRENGTH", strengths[strengthClass]);
    wordDetail.push(strengths[strengthClass]);

    let clickit = await wordRowEH.$("._10knO");
    clickit.click();

    await waitForScopedSelector("._1ekdE", wordRowEH);
    let translations = await wordRowEH.$$eval("._1ekdE", nodes => nodes.map(n => n.textContent));
    console.log("TRANSLATIONS", translations.join("|"));
    wordDetail.push(translations.join("|"));


    await page.waitForSelector("._2LQp9 > a", { visible: true });
    let skill = await page.$eval("._2LQp9 > a", eh => eh.innerText);
    console.log("SKILL", skill);
    wordDetail.push(skill);
    data.push(wordDetail.join(","));

    await page.click(".qlupP"); //back button
  }

var csvContent = data.join("\n");

fs.writeFile('wordList.csv', csvContent, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else{
    console.log('It\'s saved!');
  }
});

console.log("!!!DONE!!!");

})();

//   await browser.close();
