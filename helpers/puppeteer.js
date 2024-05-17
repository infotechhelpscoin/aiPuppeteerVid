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

async function startBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return { browser: browser, page: page };
}

async function startRecording(page, id) {
  const recorder = new PuppeteerScreenRecorder(page, Config);
  await recorder.start(`${id}/${id}.mp4`);
  return recorder;
}

async function URLScrollScreenshot(page, URL, path, scrollCount = 3) {
  await page.goto(URL, { waitUntil: 'networkidle2' });
  let paths = [];
  let count = 0;

  async function delay(time) {
    return new Promise(function(resolve) { 
      setTimeout(resolve, time)
    });
  }

  while (count < scrollCount) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await delay(2000); // Wait for 2 seconds after each scroll
    await page.screenshot({ path: count + '_' + path });
    paths.push(count + '_' + path);
    count++;
  }

  return paths;
}

async function URLScreenshot(page, URL, path) {
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path });
  return path;
}

async function stopRecording(recorder) {
  await recorder.stop();
  return true;
}

async function stopBrowser(browser) {
  await browser.close();
  return true;
}

async function runContent(page, content) {
  for (let i = 0; i < content.length; i++) {
    const item = content[i];
    await page.goto(`file://${process.cwd()}/${item.screenshot}`);
    await page.evaluate((item) => {
      const audio = document.createElement('audio');
      audio.src = item.mp3;
      audio.controls = true;
      document.body.appendChild(audio);
    }, item);
    await page.waitForTimeout(5000); // Wait for 5 seconds before moving to the next item
  }
}

module.exports = {
  startRecording: startRecording,
  URLScreenshot: URLScreenshot,
  stopRecording: stopRecording,
  startBrowser: startBrowser,
  stopBrowser: stopBrowser,
  URLScrollScreenshot: URLScrollScreenshot,
  runContent: runContent,
};