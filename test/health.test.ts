import request from "supertest";
const app = require("../src/application/index");

describe("Test API Health", () => {
  it("responds to /api/health", async () => {
    const res = await request(app)
      .get("/api/health")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "API is health!." });
  });
});
