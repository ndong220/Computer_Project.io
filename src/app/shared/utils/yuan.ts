/**
 * Converted into RMB meta string
 * @param digits When the number type is allowed to specify the number of digits after the decimal point, the default is 2 decimal places
 */
export function yuan(value: number | string, digits: number = 2): string {
  if (typeof value === 'number') {
    value = value.toFixed(digits);
  }
  return `&yen ${value}`;
}
