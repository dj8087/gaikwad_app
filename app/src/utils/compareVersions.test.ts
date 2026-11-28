import { compareVersions } from "./compareVersions";

const cases: [string, string, number | null][] = [
  ["1.10.0", "1.2.0", 1],
  ["2.0.0", "1.99.99", 1],
  ["1.2.0", "1.2.0", 0],
  ["1.2", "1.2.0", 0],
  ["1", "1.0.1", -1],
  ["1.2.3", "1.2.4", -1],
  ["1.2.beta", "1.2.0", null],
  ["1.2.0.1", "1.2.0", null],
  ["9007199254740992.0.0", "1.0.0", null],
  ["", "1.0.0", null],
];

for (const [left, right, expected] of cases) {
  const actual = compareVersions(left, right);
  if (actual !== expected) {
    throw new Error(
      `compareVersions(${JSON.stringify(left)}, ${JSON.stringify(right)}) returned ${actual}; expected ${expected}`
    );
  }
}
