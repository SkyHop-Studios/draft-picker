import * as path from 'path'
import * as fs from 'fs'
import {createFileWithDirs} from '../utils/create-file-with-dirs'
import {kebabToCamel, kebabToPascal} from '../utils/strings'

const args = process.argv.slice(2);

const collectionPath = args[0];
const collectionName = collectionPath.split("/").pop()!;

const collectionFilePath = path.join(process.cwd(), "imports/core/infrastructure/db", collectionPath + ".ts");
const modelFilePath = path.join(process.cwd(), "imports/core/domain/entities", collectionPath + ".ts");
const repoFilePath = path.join(process.cwd(), "imports/core/repository", collectionPath + ".ts");

if(fs.existsSync(collectionFilePath)) {
  throw new Error(`File already exists: ${collectionFilePath}`);
}
if(fs.existsSync(modelFilePath)) {
  throw new Error(`File already exists: ${modelFilePath}`);
}
if(fs.existsSync(repoFilePath)) {
  throw new Error(`File already exists: ${repoFilePath}`);
}

const collectionFileContents =
`import {Mongo} from 'meteor/mongo'
import {${kebabToPascal(collectionName)}Document} from '/imports/core/domain/entities/${collectionPath}'

export const ${kebabToPascal(collectionName)}Collection = new Mongo.Collection<${kebabToPascal(collectionName)}Document>('${kebabToCamel(collectionName)}');
`
createFileWithDirs(collectionFilePath, collectionFileContents);

const modelFileContents =`
export type ${kebabToPascal(collectionName)}Document = {
  _id: string
  createdAt: Date
  updatedAt: Date
}
`
createFileWithDirs(modelFilePath, modelFileContents);

const repoFileContents =
`import {${kebabToPascal(collectionName)}Document} from '/imports/core/domain/entities/${collectionPath}'
import {${kebabToPascal(collectionName)}Collection} from '/imports/core/infrastructure/db/${collectionPath}'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type I${kebabToPascal(collectionName)}Repository = IRepository<${kebabToPascal(collectionName)}Document>

export function create${kebabToPascal(collectionName)}Repository(_dateProvider: IDateProvider): I${kebabToPascal(collectionName)}Repository {
  const service = createBaseRepositoryService(${kebabToPascal(collectionName)}Collection);
  return {
    ...service
  }
}

export function register${kebabToPascal(collectionName)}Repository(locate: LocateFunction): I${kebabToPascal(collectionName)}Repository {
  return create${kebabToPascal(collectionName)}Repository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
`
createFileWithDirs(repoFilePath, repoFileContents);
