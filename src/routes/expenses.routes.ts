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

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management endpoints
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: GROCERIES
 *               note:
 *                 type: string
 *                 example: Milk and bread
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-10
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Invalid request
 */
router.post("/", authMiddleware, createExpense);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses with optional filters
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/", authMiddleware, getExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Expense updated
 *       404:
 *         description: Expense not found
 */
router.put("/:id", authMiddleware, updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */
router.delete("/:id", authMiddleware, deleteExpense);

/**
 * @swagger
 * /expenses/range:
 *   get:
 *     summary: Get expenses by range (week, month, 3months)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         required: true
 *         schema:
 *           type: string
 *           enum: [week, month, 3months]
 *     responses:
 *       200:
 *         description: List of expenses in the range
 */
router.get("/range", authMiddleware, getExpensesByRange);

/**
 * @swagger
 * /expenses/stats:
 *   get:
 *     summary: Get aggregated expense stats by category
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories with total amounts
 */
router.get("/stats", authMiddleware, getExpenseStats);

/**
 * @swagger
 * /expenses/summary:
 *   get:
 *     summary: Get total expense for a specific month
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-03
 *     responses:
 *       200:
 *         description: Monthly total
 */
router.get("/summary", authMiddleware, getMonthlySummary);

/**
 * @swagger
 * /expenses/top-categories:
 *   get:
 *     summary: Get top expense categories by total
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: List of top categories
 */
router.get("/top-categories", authMiddleware, getTopCategories);

export default router;