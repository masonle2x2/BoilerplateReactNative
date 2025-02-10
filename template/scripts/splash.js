/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

(function () {
  const { argv } = process;

  const actualArgv = argv.slice(2);

  const [path, bgColor, width, flavor] = actualArgv;
  execSync(
    `yarn react-native-bootsplash generate ${path} --background=${bgColor} --platforms=android,ios --project-type=bare --logo-width=${width}  --assets-output=assets/bootsplash --flavor=${flavor}`,
    { stdio: 'inherit' },
  );
})();
