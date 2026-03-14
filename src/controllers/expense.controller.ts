import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createExpense = async (req: Request, res: Response) => {
  const userId = req.userId;

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
};

export const getExpenses = async (req: Request, res: Response) => {
  const userId = req.userId;

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  res.json(expenses);
};

export const updateExpense = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  const { amount, category, note, date } = req.body;

  const expense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!expense || expense.userId !== userId) {
    return res.status(404).json({ message: "Expense not found" });
  }

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
};

export const deleteExpense = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  const expense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!expense || expense.userId !== userId) {
    return res.status(404).json({ message: "Expense not found" });
  }

  await prisma.expense.delete({
    where: { id },
  });

  res.json({ message: "Expense deleted" });
};