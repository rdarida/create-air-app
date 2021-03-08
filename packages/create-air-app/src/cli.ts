#!/usr/bin/env node

import { log } from './index';

((cwd, argv) => {
  try {
    log(cwd, ...argv);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  process.exit();
})(process.cwd(), process.argv.slice(2));
