// -234b3,abscd5 -> 23435

export const removeNonDigit = (str: string) =>
  str.replace(/\D/g, '').replace(/^0+/, '');
