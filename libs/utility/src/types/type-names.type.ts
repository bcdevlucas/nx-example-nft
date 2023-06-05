export type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends Function
  ? 'function'
  : 'object';
