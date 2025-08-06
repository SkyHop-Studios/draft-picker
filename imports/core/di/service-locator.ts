type TypeRegistry = Record<string, any>

export type DIContainer<T extends TypeRegistry, C = undefined> = {
  register: <K extends keyof T>(key: K, factory: (locate: <IK extends keyof T>(key: IK) => T[IK], context: C) => T[K]) => void
  locate: <K extends keyof T>(key: K, context?: C) => T[K]
}

export function createContainer<T extends TypeRegistry, C = undefined>(): DIContainer<T, C> {
  const _services = new Map();
  let _context: C;

  const locate = (key: keyof T) => {
    const service = _services.get(key);
    if (!service) {
      throw new Error(`Service ${key as string} not registered`);
    }

    return service.call(null, locate, _context);
  }

  return {
    register: (key, factory) => {
      _services.set(key, factory);
    },

    locate: (key, context) => {
      if(context) {
        _context = context;
      }
      return locate(key);
    }
  }
}
