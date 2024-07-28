/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync, spawnSync } = require('child_process');

const { readFileSync, writeFileSync } = require('fs');

const { join } = require('path');

const padStart = number => {
  if (number.toString().length < 2) {
    return `0${number}`;
  }

  return String(number);
};

const getEnvJsonFromPath = envPath => {
  const data = readFileSync(
    join(__dirname.replace('scripts', ''), envPath),
    'utf8',
  );

  if (data) {
    return JSON.parse(data);
  }

  throw new Error('ENV file not found');
};

const setupEnv = envPath => {
  let infoJsEnv = `// This file was generated by current env while u run application.
// Do not edit this file as changes may cause incorrect behavior and will be lost
// once the code is regenerated.

import Keys from 'react-native-keys';

`;

  const envJson = getEnvJsonFromPath(envPath);

  console.log({ envJson });

  const todayDate = new Date();

  const year = todayDate.getFullYear();

  const month = todayDate.getMonth() + 1;

  const date = todayDate.getDate();

  const hours = todayDate.getHours();

  const minutes = todayDate.getMinutes();

  const APP_BUILD_VERSION = `${year}.${padStart(month)}.${padStart(
    date,
  )}.${padStart(hours)}.${padStart(minutes)}`;

  infoJsEnv += `export const APP_BUILD_VERSION = '${envJson.public.VERSION_NAME.replace(
    '"',
    '',
  ).replace('"', '')}.${APP_BUILD_VERSION}';`;

  // loop to add variable to env-config.ts
  Object.keys(envJson?.public ?? {}).forEach(key => {
    infoJsEnv += `\n\nexport const { ${key} } = Keys;`;
  });

  Object.keys(envJson?.secure ?? {}).forEach(key => {
    infoJsEnv += `\n\nexport const ${key} = Keys.secureFor('${key}');`;
  });

  infoJsEnv += '\n';

  // remove cache
  spawnSync('rm -rf $TMPDIR/metro-*');

  spawnSync('rm -rf node_modules/.cache/babel-loader/*');

  // write env-config.ts
  writeFileSync(
    join(__dirname.replace('scripts', ''), 'env-config.ts'),
    infoJsEnv,
    'utf8',
  );

  console.log('✨✨✨✨✨ SET UP Env done ✨✨✨✨✨');

  return envJson;
};

const getRubyVersion = () => {
  try {
    return Number(
      execSync('ruby -e "puts RUBY_VERSION"')
        .toString()
        .trim()
        .split('.')
        .join(''),
    );
  } catch {
    return 0;
  }
};

const getAndroidHome = () => {
  try {
    return (
      execSync('echo $ANDROID_HOME').toString().trim() ||
      execSync('echo $ANDROID_SDK_ROOT').toString().trim()
    );
  } catch {
    return '';
  }
};

module.exports = {
  getAndroidHome,
  getEnvJsonFromPath,
  getRubyVersion,
  setupEnv,
};
