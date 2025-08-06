import * as path from 'path'
import * as fs from 'fs'
import {createFileWithDirs} from '../utils/create-file-with-dirs'
import {kebabToPascal} from '../utils/strings'

const args = process.argv.slice(2);

const servicePath = args[0];
const serviceName = servicePath.split("/").pop()!;

const validTopLevelDirectories = {
  "application": "/imports/core/application/services",
  "infrastructure": "/imports/core/infrastructure/services",
  "domain": "/imports/core/domain/services",
}

const dirs = servicePath.split("/");
const topLevelDirectory = dirs.shift()!;
if(!Object.keys(validTopLevelDirectories).includes(topLevelDirectory)) {
  throw new Error(`Invalid top level directory: ${topLevelDirectory}`);
}

const filePath = path.join(
  process.cwd(),
  validTopLevelDirectories[topLevelDirectory as keyof typeof validTopLevelDirectories],
  dirs.join("/") + ".ts"
);

if(fs.existsSync(filePath)) {
  throw new Error(`File already exists: ${filePath}`);
}

const contents =
`import {LocateFunction} from '/imports/core/di/registry'

export type I${kebabToPascal(serviceName)}Service = {

}

type Dependencies = {

}

export function create${kebabToPascal(serviceName)}Service(
  {

  }: Dependencies): I${kebabToPascal(serviceName)}Service {

  return {

  }
}

export function register${kebabToPascal(serviceName)}Service(_locate: LocateFunction): I${kebabToPascal(serviceName)}Service {
  return create${kebabToPascal(serviceName)}Service({

  });
}
`

createFileWithDirs(filePath, contents);


