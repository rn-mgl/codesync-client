export const normalizeString = (s: string) => {
  const SPACERS = ["_", ".", "-"];

  SPACERS.forEach((spacer) => {
    if (s.includes(spacer)) {
      s = s.replaceAll(spacer, " ");
    }
  });

  return s.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};
