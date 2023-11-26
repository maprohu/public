#!/bin/env zx

const siteDir = `${__dirname}/site`;
const tfDir = `${__dirname}/modules/env`;

await $`yarn --cwd=${siteDir} --immutable`;
await $`yarn --cwd=${siteDir} build`;

await $`terraform -chdir=${tfDir} init`;
await $`terraform -chdir=${tfDir} apply -auto-approve`;

const { stdout: s3 } = await $`terraform -chdir=${tfDir} output -raw s3`;

if (!s3) {
  console.log("s3 unknown");
  process.exit(1);
}

const distDir = `${siteDir}/dist`

await $`aws s3 sync ${distDir} s3://${s3} --delete`;
