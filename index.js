const puppeteer = require("puppeteer");
require("dotenv").load();

var myArgs = process.argv.slice(2);

const strengths = {'gh0Vi _2SbBh': 1, '_3VX71 _2SbBh': 2, '_3NjYP _2SbBh': 3, '_6s8NZ _2SbBh': 4};

(async () => {
  let loginUsingGoogle = process.env.USE_GOOGLE_AUTH;
  let username = process.env.AUTH_USERNAME;
  let password = process.env.AUTH_PASSWORD;
  let plateNumber = process.env.PLATE_NUM;
  let notificationEmail = process.env.NOTIFICATION_EMAIL;

  const browser = await puppeteer.launch({ headless: false, sloMo: 500 });
  const page = await browser.newPage();
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
  const wordRowEHs = await page.$$('tr.VjtrX');

let wordRowEH = wordRowEHs[7];

  wordRowEH.click();

  let spanishWordSpanEH = await wordRowEH.$('td > span');
  let spanishWord = await page.evaluate(s => s.innerText, spanishWordSpanEH);
  console.log(spanishWord);

  let partOfSpeachEH = await wordRowEH.$('td:nth-child(2)');
  let partOfSpeach = await page.evaluate(s => s.innerText, partOfSpeachEH);
  console.log(partOfSpeach);

  let strengthEH = await wordRowEH.$('td:nth-child(4) > span');
  let strengthJH = await strengthEH.getProperty('className');//await page.evaluate(s => s.getProperty('className'), strengthEH);
  let strengthClass = await strengthJH.jsonValue();
  
  console.log(strengths[strengthClass]);
  
  //await wordRowEH.waitForSelector('._1ekdE');
  console.log(await page.evaluate(s => s.outerHTML, wordRowEH));
console.log(await wordRowEH.$eval('._1ekdE', x => x.textContent));


console.log(await wordRowEH.$$eval('._1ekdE', nodes => nodes.map(n => n.textContent)));



 

  await page.waitForSelector("._2LQp9 > a", { visible: true });
  let wordDetailSkillValuesEH = await page.$("._2LQp9 > a");

  //***********
  let skill = await page.evaluate(
    skillValEH => skillValEH.innerText,
    wordDetailSkillValuesEH
  );
  console.log(skill);

  await page.click(".qlupP");//back button



  //wordSpans.forEach(wordSpanElement => {

  //});

  //         await navigationPromise;
})();

//     if (loginUsingGoogle) {
//         const navigationPromise = page.waitForNavigation()
//         await page.waitForSelector('#google-login')
//         await page.click('#google-login');

//         await navigationPromise;
//         await page.waitForSelector('input[type="email"]');
//         await page.type('input[type="email"]', username);
//         await page.click('#identifierNext');

//         await page.waitForSelector('input[type="password"]', {visible: true});
//         await page.type('input[type="password"]', password);

//         await page.waitForSelector('#passwordNext', {visible: true});
//         await page.click('#passwordNext');

//         await navigationPromise;

//     }
//     else {
//         //login using the username and password
//         await page.waitForSelector('#login')
//         await page.type('#login', username);
//         await page.type('#password', password);
//         await page.click('#login-submit');
//     }

// //   const browser = await puppeteer.launch({ headless: true, sloMo: 0 });
// //   const page = await browser.newPage();
// //   await page.setViewport({ width: 1280, height: 800 });
// //   await page.goto("http://localhost:1337/ElectronicPermitSystem.html");

//   //click the first address
//   await page.waitForSelector("#addressList > li > a.clickable");
//   await page.click("#addressList > li > a.clickable");

//   let foundExistingSession = false;
//   let doCreateNewSession = true;
//   await page.waitForSelector("#sessionTable table tr td");
//   let sessionTrEHArray = await page.$$("#sessionTable table tr");

//   //looping over the session rows
//   for (let i = 0; i < sessionTrEHArray.length; i++) {
//     let sessionTdEHRowArray = await sessionTrEHArray[i].$$("td");
//     console.log(sessionTdEHRowArray);

//     if (sessionTdEHRowArray.length == 7) {
//       let sessionPlateValue = await page.evaluate(
//         tdEh => tdEh.innerHTML,
//         sessionTdEHRowArray[1]
//       );
//       console.log(sessionPlateValue);

//       if (sessionPlateValue === plateNumber) {
//         console.log("found existing session");
//         foundExistingSession = true;
//         let sessionExpireDateStr = await page.evaluate(
//           tdEh => tdEh.innerHTML,
//           sessionTdEHRowArray[4]
//         );
//         console.log(sessionExpireDateStr);

//         let sessionExpireDate = new Date(sessionExpireDateStr);
//         let sessionExpireDateWithBuffer = new Date(sessionExpireDate.getTime());
//         sessionExpireDateWithBuffer.setDate(
//           sessionExpireDateWithBuffer.getDate() -
//             process.env.RENEW_WITH_N_DAYS_REMAINING
//         );

//         if (sessionExpireDateWithBuffer < Date.now()) {
//           console.log("existing session needs to be renewed");

//           let sessionStopButton = await sessionTdEHRowArray[5].$("button");
//           sessionStopButton.click();
//           doCreateNewSession = true;
//         } else {
//           console.log("existing session doesnt need to be renewed");
//           doCreateNewSession = false;
//         }
//       }
//     }
//   }

//   if(!foundExistingSession){
//     console.log("no existing session found");
//   }

//   //start new session

//   //enter the plate number and start the session
//   if (doCreateNewSession) {
//     console.log("creating new session");
//     await page.waitForSelector("#plateEntry");
//     await page.type("#plateEntry", plateNumber);
//     await page.click("#start");
//   }

//   //take screenshot of current session
//   await page.waitForSelector("#sessionTable table tr td");
//   await new Promise(resolve => setTimeout(resolve, 2000));
// let screenshotBuffer = await page.screenshot({path: "cpa.png"});
//   //email screenshot to me

//   await browser.close();
