import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpensesByRange,
  getExpenseStats,
  getMonthlySummary,
  getTopCategories,
  updateExpense,
} from "../controllers/expense.controller";

const router = Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);
router.get("/range", getExpensesByRange);
router.get("/stats", getExpenseStats);
router.get("/summary", getMonthlySummary);
router.get("/top-categories", getTopCategories);

export default router;