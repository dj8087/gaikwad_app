export function compareVersions(
  leftVersion: string,
  rightVersion: string
): number | null {
  const parseVersion = (version: string): number[] | null => {
    if (
      version !== version.trim() ||
      !/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,2}$/.test(version)
    ) {
      return null;
    }

    const components = version.split(".").map(Number);
    if (!components.every(Number.isSafeInteger)) {
      return null;
    }
    return [...components, 0, 0].slice(0, 3);
  };

  const left = parseVersion(leftVersion);
  const right = parseVersion(rightVersion);
  if (!left || !right) {
    return null;
  }

  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] > right[index] ? 1 : -1;
    }
  }
  return 0;
}
