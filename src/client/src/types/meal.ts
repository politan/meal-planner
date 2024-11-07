// src/types/meal.ts
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  type: MealType;
  ingredients: Ingredient[];
  date: string;
  isFavorite: boolean;
  nutrition?: Nutrition;
}

export interface DayMeals {
  breakfast: Meal | undefined;
  lunch: Meal | undefined;
  dinner: Meal | undefined;
  snack: Meal | undefined;
}

export interface WeekPlan {
  id: string;
  startDate: string;
  days: Record<string, DayMeals>;
}

export interface ShoppingListItem {
  ingredient: string;
  totalAmount: number;
  unit: string;
}

export interface ShoppingList {
  weekId: string;
  items: ShoppingListItem[];
}