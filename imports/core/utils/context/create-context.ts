export function createContext() {
  return { test: "Hello Context World!" }
}

export type Context = ReturnType<typeof createContext>
