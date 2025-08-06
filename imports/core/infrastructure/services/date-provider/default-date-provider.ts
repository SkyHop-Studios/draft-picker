export type IDateProvider = () => Date

export function createDefaultDateProvider(): IDateProvider {
  return () => new Date()
}

export function registerDateProvider() {
  return createDefaultDateProvider();
}
