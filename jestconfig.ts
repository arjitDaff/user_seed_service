
export default {
  preset: "ts-jest",
  collectCoverage: true,
  coverageReporters: ["html", "json-summary"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["./src/**/*.ts"],
  reporters: ["default", "jest-html-reporter"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
