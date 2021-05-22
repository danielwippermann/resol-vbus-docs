export function assertValidUrlPart(urlPart) {
  if (!/^[0-9A-Za-z/.-]+$/.test(urlPart)) {
    throw new Error(`Invalid URL part ${JSON.stringify(urlPart)}`);
  }
}
