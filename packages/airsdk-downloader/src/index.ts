import puppeteer, { Browser, Page } from 'puppeteer';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { DownloaderHelper } from 'node-downloader-helper';

const BASE_URL = 'https://airsdk.harman.com/download';
const URL = 'https://airdownload.adobe.com/air/win/download/32.0/AIRSDK_Compiler.zip';

export async function Downloader(target: string): Promise<void> {
  const dest = resolve(target, 'dist');
  console.log(dest);
  const downloader = new DownloaderHelper(URL, dest);
  await downloader.start();
}

export async function AIRSDKDownloader2(target: string): Promise<void> {
  const browser = await createBrowser();
  const page = await createPage(browser);
  await page.goto(BASE_URL);

  await acceptTerms(page);

  const link = await getLink(page);
  console.log(link);

  target = resolve(target, 'dist');

  if (!existsSync(target)) {
    mkdirSync(target);
  }

  const init = await page.target().createCDPSession().then((client) => {
    return client.send(
      'Page.setDownloadBehavior',
      { behavior: 'allow', downloadPath: target,  }
    );
  });

  const download = async (url: string) => {
    await init;

    try {
      await page.goto(url);
    } catch (error) {
      console.log(error.message);
    }

    return Promise.resolve();
  }

  await download(link);
/*
  const res = await page.evaluate(async () => {
    return await fetch(link).then(r => r.text());
  });//*/

  //writeFileSync(resolve(target, 'dist', 'AIRSDK_Windows.zip'), res);

  await page.screenshot({ path: resolve(target, 'screenshot.png') });

  await browser.close();
}

async function createBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(10 * 60 * 1000);
  await page.setViewport({ width: 800, height: 1000 });
  return page;
}

async function acceptTerms(page: puppeteer.Page): Promise<void> {
  await page.$eval('input', el => {
    el.removeAttribute('class');
  });

  const [checkBox] = await page.$$('input');
  await checkBox.click();
}

async function getLink(page: puppeteer.Page): Promise<any> {
  const [as] = await page.$$('.downloadLinks a');
  const href = await as.getProperty('href');
  return await href?.jsonValue();
}