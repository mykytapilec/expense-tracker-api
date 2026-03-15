import request from "supertest";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/jwt";
import app from "../server";

let token: string;
let expenseId: string;

beforeAll(async () => {
  await prisma.expense.deleteMany({});
  await prisma.user.deleteMany({ where: { email: "test@example.com" } });

  let user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashedpassword",
      },
    });
  }

  token = generateToken(user.id);
});

afterAll(async () => {
  await prisma.expense.deleteMany({});
  await prisma.user.deleteMany({ where: { email: "test@example.com" } });
});

describe("Expenses API", () => {
  it("should create an expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        category: "GROCERIES",
        note: "Lunch",
        date: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(100);
    expect(res.body.category).toBe("GROCERIES");
    expenseId = res.body.id;
  });

  it("should get expenses with pagination and filtering", async () => {
    const res = await request(app)
      .get("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1, limit: 10, category: "GROCERIES" });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].category).toBe("GROCERIES");
  });

  it("should update an expense", async () => {
    const res = await request(app)
      .put(`/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 150, note: "Updated lunch" });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(150);
    expect(res.body.note).toBe("Updated lunch");
  });

  it("should delete an expense", async () => {
    const res = await request(app)
      .delete(`/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Expense deleted");
  });
});