const { execSync } = require('child_process');

const TARGET = 1000;

for (let i = 0; i < TARGET; i++) {
  console.log(`================ RUN ${i} of ${TARGET} ================`);
  //   console.log(`Removing node_modules...`);
  //   execSync(`rm -rf ./node_modules`, { stdio: 'inherit' });
  //   console.log(`Done!`);
  console.log(`Installing dependencies...`);
  execSync(`pnpm install --frozen-lockfile`, { stdio: 'inherit' });
  console.log(`Done!`);
  console.log(`=======================================================`);
}
