import { CreateNodes, readJsonFile, ProjectConfiguration } from '@nx/devkit';
import { execSync } from 'child_process';
import { dirname } from 'path';

export const createNodes: CreateNodes = [
  '**/project.json',
  (filePath, context) => {
    const projectConfig = readJsonFile(filePath) as ProjectConfiguration;
    const cwd = filePath.replace('/project.json', '');
    const name = projectConfig.name;
    if (!name) {
      return {};
    }
    try {
      const testList = execSync(`npx playwright test --list`, {
        cwd,
      }).toString();
      if (!testList.includes(`Listing tests:`)) {
        return {};
      }
      const tests = testList
        .split(`\n`)
        .filter((_, i) => i > 0 && i < testList.split(`\n`).length - 2)
        .map((line) => line.split(` › `)[2]);
      const targets = {
        [`e2e-sharded`]: {
          command: `echo \"Running tests using sharding...\"`,
          dependsOn: tests.map(testNameToTargetName),
        },
      };
      for (const test of tests) {
        const targetName = testNameToTargetName(test);
        targets[targetName] = {
          command: `CI=true npx playwright test -g "${test}"`,
          options: { cwd },
        };
      }
      return { projects: { [name]: { targets, root: dirname(filePath) } } };
    } catch (e) {
      return {};
    }
  },
];

function testNameToTargetName(testName: string): string {
  return `e2e ${testName}`.split(' ').join('-');
}
