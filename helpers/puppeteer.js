const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const Config = {
    followNewTab: true,
    fps: 60,
    videoFrame: {
      width: 1024,
      height: 768,
    },
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 1000,
    autopad: {
      color: 'black' | '#35A5FF',
    },
    aspectRatio: '4:3',
  };
  async function startBrowser()
  {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return {browser:browser,page: page};
  }
  
  async function startRecording(page)
{
  const recorder = new PuppeteerScreenRecorder(page,Config);
  await recorder.start(`${id}/${id}.mp4`);
  return recorder;
}
async function URLScrollScreenshot(page,URL,path,scrollCount=3)
{
  await page.goto(URL, { waitUntil: 'networkidle2' });
  let paths=[];
  let count = 0; // Initialize a counter for the number of scrolls
    while (count < scrollCount) { 
      await page.evaluate(() => window.scrollBy(0, 100)); // Scroll down by 100 units
      //await delay(2000); // Wait for 2 seconds after each scroll
      await page.screenshot({path: count+'_'+path });
      paths.push(count+'_'+path);
      count++; // Increment the counter
    }
    return paths;
}
async function URLScreenshot(page, URL, path) {
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path });
  return path;
}
async function stopRecording(recorder,browser) {
  await recorder.stop();
  return true;
}
async function stopBrowser(recorder,browser) {
  await browser.close();
  return true;
}
  module.exports={startRecording:startRecording,
    URLScreenshot:URLScreenshot,
    stopRecording:stopRecording,
    startBrowser:startBrowser,
    stopBrowser:stopBrowser,
    URLScrollScreenshot:URLScrollScreenshot
};