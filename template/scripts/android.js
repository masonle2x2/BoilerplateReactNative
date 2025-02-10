/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const { existsSync, readdirSync } = require('fs');
const { join } = require('path');

const { createInterface } = require('readline');

const { getEnvJsonFromPath } = require('./common');

const run = ({ buildType, envPath }) => {
  const envJson = getEnvJsonFromPath(envPath);

  // uninstall android app with adb
  const devicesString = execSync('adb devices').toString().trim();

  const variant = envJson.public.FLAVOR + buildType;

  if (devicesString.split('\n').length > 1) {
    try {
      execSync(`adb uninstall ${envJson.public.BUNDLE_IDENTIFIER}`);
    } catch {
      console.log('Old App not found');
    }
  }
  execSync(
    `npx expo run:android --variant ${variant} --app-id=${envJson.public.BUNDLE_IDENTIFIER}`,
    { stdio: 'inherit' },
  );
};

const getHashCommand = ({ keyStorePath, keyStorePass, alias }) => {
  return `keytool -exportcert -alias ${alias} -keystore ${keyStorePath} -storepass ${keyStorePass} | openssl sha1 -binary | openssl base64`;
};

const getHash = () => {
  console.log('🔑🔑🔑🔑🔑🔑🔑 Key hash for debug 🔑🔑🔑🔑🔑🔑🔑');

  execSync(
    getHashCommand({
      alias: 'androiddebugkey',
      keyStorePass: 'android',
      keyStorePath: 'android/app/debug.keystore',
    }),
    { stdio: 'inherit' },
  );

  console.log('');

  readdirSync('env').forEach(r => {
    const envJson = getEnvJsonFromPath(join('env', r));

    console.log('🔑🔑🔑🔑🔑🔑🔑 Key hash for env => ', r, '🔑🔑🔑🔑🔑🔑🔑');

    execSync(
      getHashCommand({
        alias: envJson.public.ANDROID_KEY_STORE_KEY_ALIAS,
        keyStorePass: envJson.public.ANDROID_KEY_STORE_KEY_PASSWORD,
        keyStorePath: `fastlane/release-keystore/${envJson.public.ANDROID_KEY_STORE_FILE}`,
      }),
      { stdio: 'inherit' },
    );

    console.log('');
  });
};

const getReportCommand = ({ alias, keyStorePass, keyStorePath }) => {
  return `keytool -list -v -keystore ${keyStorePath} -alias ${alias} -storepass ${keyStorePass} -keypass ${keyStorePass}`;
};

const signingReport = () => {
  console.log('🔑🔑🔑🔑🔑🔑🔑 Signing report for debug🔑🔑🔑🔑🔑🔑🔑');

  execSync(
    getReportCommand({
      alias: 'androiddebugkey',
      keyStorePass: 'android',
      keyStorePath: 'android/app/debug.keystore',
    }),
    {
      stdio: 'inherit',
    },
  );

  readdirSync('env').forEach(r => {
    const envJson = getEnvJsonFromPath(join('env', r));

    console.log(
      '🔑🔑🔑🔑🔑🔑🔑 Signing report for env => ',
      r,
      '🔑🔑🔑🔑🔑🔑🔑',
    );

    execSync(
      getReportCommand({
        alias: `${envJson.public.ANDROID_KEY_STORE_KEY_ALIAS}`,
        keyStorePass: `${envJson.public.ANDROID_KEY_STORE_KEY_PASSWORD}`,
        keyStorePath: `fastlane/release-keystore/${envJson.public.ANDROID_KEY_STORE_FILE}`,
      }),
      {
        stdio: 'inherit',
      },
    );

    console.log('');
  });
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = query =>
  new Promise(resolve => {
    rl.question(query, resolve);
  });

const genKeyStore = async () => {
  const keyName = await prompt("What's your keystore name?: ");

  rl.close();

  const keyStorePath = `fastlane/release-keystore/${keyName}.keystore`;

  const exist = existsSync(keyStorePath);

  if (exist) {
    console.log('A keystore already exists. Please make another one');

    genKeyStore();

    return;
  }

  execSync(
    `keytool -genkeypair -v -storetype PKCS12 -keystore ${keyStorePath} -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`,
    { stdio: 'inherit' },
  );
};

(() => {
  const { argv, platform } = process;

  const actualArgv = argv.slice(2);

  const [nameFunc, envPath, buildType] = actualArgv;

  switch (nameFunc) {
    case 'run':
      run({ buildType, envPath, platform });

      break;
    case 'hash':
      getHash();

      break;
    case 'report':
      signingReport();

      break;
    case 'keystore':
      genKeyStore();

      break;

    default:
      break;
  }
})();
