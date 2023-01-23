export const generateShareUrl = (params: Record<string, string>) => {
  const { origin, pathname } = window.location;

  const url = new URL(origin + pathname);
  Object.entries(params).forEach(([name, value]) => {
    url.searchParams.set(name, value);
  });

  return url.toString();
};
