export const validURL = (url: string): boolean => {
  const pattern = new RegExp(
    '^(https:\\/\\/)' // only with https
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}\\/$)',
    'i',
  ); // fragment locator
  return Boolean(pattern.test(url));
};
