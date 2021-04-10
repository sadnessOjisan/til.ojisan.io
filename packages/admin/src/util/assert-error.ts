export const assertError = (x: never) => {
  console.error(`${x} should not be called`);
};
