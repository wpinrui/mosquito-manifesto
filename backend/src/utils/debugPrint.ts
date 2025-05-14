/* eslint-disable @typescript-eslint/no-explicit-any */
export const debugPrint = (obj: any, label?: string) => {
  console.log(`${label ? label + ": " : ""}`);
  console.log(obj);
  return obj;
};
