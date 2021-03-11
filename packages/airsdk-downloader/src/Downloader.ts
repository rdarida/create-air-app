import { DownloaderHelper } from 'node-downloader-helper';
import logUpdate from 'log-update';
import rimraf from 'rimraf';
import { unzipSync } from 'cross-zip';
import { unlinkSync } from 'fs';

const URL = 'https://airdownload.adobe.com/air/win/download/32.0/AIRSDK_Compiler.zip';

export class Downloader extends DownloaderHelper {
  private readonly sdkPath: string;
  private readonly file: string;

  constructor(sdkPath: string) {
    super(URL, sdkPath);

    this.sdkPath = sdkPath;

    const url = URL.split('/');
    this.file = [this.sdkPath, url[url.length - 1]].join('\\');

    this.on('progress', (stats) => {
      logUpdate('Downloading: ', stats.progress);
    });

    this.on('end', () => {
      console.log('Unzipping...');
      unzipSync(this.file, this.sdkPath);
      unlinkSync(this.file);
    });
  }
}