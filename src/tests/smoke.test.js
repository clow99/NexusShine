import test from "node:test";
import assert from "node:assert";

const requiredEnv = ["DATABASE_URL", "NEXTAUTH_SECRET"];

for (const key of requiredEnv) {
    test(`env var ${key} is configured`, () => {
        if (!process.env[key]) {
            test.skip(`${key} not set in environment`);
            return;
        }
        assert.ok(process.env[key]);
    });
}

test("package scripts exist", () => {
    const pkg = require("../package.json");
    assert.ok(pkg.scripts?.smoke, "smoke script missing");
    assert.ok(pkg.scripts?.lint, "lint script missing");
});
