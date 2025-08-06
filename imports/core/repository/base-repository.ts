import {Mongo} from 'meteor/mongo'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {MongoServerError, isDuplicateKeyError} from '/imports/core/infrastructure/db/mongo-error'

type BaseDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type IRepository<TDoc extends BaseDocument> = {
  findAll: () => Mongo.Cursor<TDoc, TDoc>
  getAll: () => TDoc[]
  _list: (selector: Mongo.Selector<TDoc>, options?: PaginationOptions) => PaginatedResult<TDoc>
  list: (options?: PaginationOptions) => PaginatedResult<TDoc>
  create: (doc: NewDocument<TDoc>) => string
  set: (_id: string, doc: Partial<TDoc>) => number
  findOne: (selector: Mongo.Selector<TDoc>) => TDoc | undefined
  findByIdOrThrow: (_id: string) => Mongo.Cursor<TDoc, TDoc>
  getByIdOrThrow: (_id: string) => TDoc
  getById: (_id: string) => TDoc | undefined
  getAllByIdsOrThrow: (_ids: string[]) => TDoc[]
  remove: (_id: string) => number
  removeAll: () => number
  exists: (_id: string) => boolean
  existsOrThrow: (_id: string) => void
}

export type PaginationOptions = {
  page: number
  limit?: number
}

export type PaginatedResult<TDoc> = {
  count: number
  results: TDoc[]
}

export type NewDocument<TDoc extends BaseDocument> = Omit<TDoc, '_id' | 'createdAt' | 'updatedAt'>

export function createBaseRepositoryService<TDoc extends BaseDocument>(collection: Mongo.Collection<TDoc, TDoc>, dateProvider: IDateProvider): IRepository<TDoc> {
  const _list = (selector: Mongo.Selector<TDoc>, { limit = 100, page } = { page: 1 }) => {
    return {
      count: collection.find(selector).count(),
      results: collection.find(selector, { skip: (page - 1) * limit, limit }).fetch()
    };
  }

  return {
    findAll: () => {
      return collection.find();
    },

    getAll: () => {
      return collection.find().fetch();
    },

    _list,

    list: ({ limit = 100, page } = { page: 1 }) => {
      return _list({}, { limit, page });
    },

    create: (doc) => {
      try {
        return collection.insert({
          ...doc,
          createdAt: dateProvider(),
          updatedAt: dateProvider()
        } as Mongo.OptionalId<TDoc>);
      } catch (error) {

        if(isDuplicateKeyError(error)) {
          throw new DuplicateKeyError(error);
        }

        throw error;
      }
    },

    set: (_id, doc) => {
      return collection.update(_id, {
        $set: { ...doc }
      });
    },

    findOne: (selector) => {
      return collection.findOne(selector);
    },

    findByIdOrThrow: (_id) => {
      const cursor = collection.find({ _id } as any, { limit: 1 });
      if (!cursor.count()) {
        throw new DocumentNotFoundError(collection._name, _id);
      }
      return cursor;
    },

    getByIdOrThrow: (_id) => {
      const doc = collection.findOne(_id);
      if (!doc) {
        throw new DocumentNotFoundError(collection._name, _id);
      }

      return doc;
    },

    getById: (_id) => {
      return collection.findOne(_id);
    },

    getAllByIdsOrThrow: (_ids) => {
      const docs = collection.find({ _id: { $in: _ids } } as any).fetch();
      if(docs.length !== _ids.length) {
        throw new DocumentNotFoundError(collection._name, _ids.find(id => !docs.find(doc => doc._id === id))!);
      }
      // maintain order
      return _ids.map(_id => docs.find(doc => doc._id === _id)!);
    },

    remove: (_id) => {
      return collection.remove(_id);
    },

    removeAll: () => {
      return collection.remove({});
    },

    exists: (_id) => {
      return !!collection.findOne(_id, { fields: { _id: 1 } });
    },

    existsOrThrow: (_id) => {
      if(!collection.findOne(_id, { fields: { _id: 1 } })) {
        throw new DocumentNotFoundError(collection._name, _id);
      }
    }
  }
}

export class DocumentNotFoundError extends Error {
  name = "DocumentNotFoundError";

  constructor(collectionName: string, _id: string) {
    super(`${collectionName} document not found: ${_id}`);
  }
}

export class DuplicateKeyError extends Error {
  name = "DuplicateKeyError";

  constructor(serverError: MongoServerError) {
    const duplicateKey = Object.keys(serverError.keyPattern)[0];
    super(`Field '${duplicateKey}' with value '${serverError.keyValue[duplicateKey]}' already exists, please choose another.`);
  }
}
