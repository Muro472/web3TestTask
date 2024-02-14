export const hashShortener = (hash: string, length: number) => {
  if (hash.length <= length) return hash;

  const firstPart = hash.slice(0, length / 2);
  const lastPart = hash.slice(-length / 2);
  return firstPart + '...' + lastPart;
};
