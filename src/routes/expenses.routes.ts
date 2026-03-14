import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpensesByRange,
  updateExpense,
} from "../controllers/expense.controller";

const router = Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);
router.get("/range", getExpensesByRange);

export default router;