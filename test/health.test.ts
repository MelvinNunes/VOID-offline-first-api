import request from "supertest";
const app = require("../src/application/index");

describe("Test API Health", () => {
  it("responds to /api/v1/health", async () => {
    const res = await request(app)
      .get("/api/v1/health")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
  });
});
