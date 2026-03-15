import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { amount, category, note, date } = req.body;

    const expense = await prisma.expense.create({
      data: {
        amount,
        category,
        note,
        date: new Date(date),
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid expense data" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const {
      page = "1",
      limit = "10",
      category,
      startDate,
      endDate,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const where: any = { userId };

    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.expense.count({ where });

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      data: expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cannot fetch expenses" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || expense.userId !== userId) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const { amount, category, note, date } = req.body;

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount,
        category,
        note,
        date: date ? new Date(date) : undefined,
      },
    });

    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cannot update expense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || expense.userId !== userId) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await prisma.expense.delete({ where: { id } });

    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cannot delete expense" });
  }
};

export const getExpensesByRange = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { range } = req.query;

    let startDate: Date;

    const today = new Date();
    switch (range) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      default:
        return res.status(400).json({ message: "Invalid range" });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: today },
      },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cannot fetch expenses by range" });
  }
};

export const getExpenseStats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const stats = await prisma.expense.groupBy({
      by: ["category"],
      where: { userId },
      _sum: { amount: true },
    });

    const result = stats.map((item: { category: string; _sum: { amount: number | null } }) => ({
      category: item.category,
      total: item._sum.amount || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expense statistics" });
  }
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required (YYYY-MM)" });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const result = await prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: startDate, lt: endDate },
      },
      _sum: { amount: true },
    });

    res.json({ month, total: result._sum.amount || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch monthly summary" });
  }
};

export const getTopCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { limit = "5" } = req.query;

    const limitNumber = parseInt(limit as string, 10);

    const stats = await prisma.expense.groupBy({
      by: ["category"],
      where: { userId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: limitNumber,
    });

    const result = stats.map((item: { category: string; _sum: { amount: number | null } }) => ({
      category: item.category,
      total: item._sum.amount || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top categories" });
  }
};