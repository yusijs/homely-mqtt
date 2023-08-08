/* eslint-disable @typescript-eslint/no-explicit-any */

// a function that gets a value from an object based on the path
// e.g. get({a: {b: {c: 1}}}, 'a.b.c') === 1
export function getValueByPath<T, K extends keyof T>(
  obj: T,
  path: string
): T[K] {
  const parts = path.split('.');
  const firstPart = parts.shift();
  if (firstPart === undefined) {
    return obj as any;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const next = obj[firstPart];
  if (next === undefined) {
    return undefined as any;
  }
  if (parts.length === 0) {
    return next as any;
  }
  return getValueByPath(next, parts.join('.'));
}
