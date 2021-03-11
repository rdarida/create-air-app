#!/usr/bin/env node

import { AIRSDKDownloader } from './index';

(async (cwd: string): Promise<void> => {
  try {
    await AIRSDKDownloader(cwd);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  process.exit();
})(process.cwd());