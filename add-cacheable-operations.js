const { readNxJson, createProjectGraphAsync } = require('@nx/devkit');
const { writeFileSync } = require('fs');

const nxJson = readNxJson();
console.log(nxJson.tasksRunnerOptions.default.options.cacheableOperations);

async function getAllTargetNames() {
  const foo = await createProjectGraphAsync();
  //   for (const [projectName, config] of Object.entries(foo)) {
  //     if (!projectName.startsWith('npm:')) {
  //       console.log(projectName);
  //       console.log(config);
  //     }
  //   }
  const targetsToMakeCacheable = new Set();
  for (const project of Object.values(foo.nodes)) {
    for (const targetName of Object.keys(project.data.targets)) {
      if (targetName.startsWith('e2e-')) {
        targetsToMakeCacheable.add(targetName);
      }
    }
  }
  return targetsToMakeCacheable;
}

getAllTargetNames().then((targets) => {
  const newCacheableOperations = new Set();
  for (const target of nxJson.tasksRunnerOptions.default.options
    .cacheableOperations) {
    newCacheableOperations.add(target);
  }
  for (const target of targets) {
    newCacheableOperations.add(target);
  }
  nxJson.tasksRunnerOptions.default.options.cacheableOperations = Array.from(
    newCacheableOperations
  );
  writeFileSync('./nx.json', JSON.stringify(nxJson, null, 2));
  process.exit(0);
});