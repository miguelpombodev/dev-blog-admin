export function TrimObjectValues(obj: object) {
  Object.values(obj).forEach((v) => {
    if (typeof obj !== "string") return;

    return v.trim();
  });

  return obj;
}
