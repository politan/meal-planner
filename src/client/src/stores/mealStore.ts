// src/stores/mealStore.ts
import { defineStore } from 'pinia';
import { Meal, WeekPlan, ShoppingList, Ingredient, MealType, DayMeals } from '../types/meal';

interface MealState {
  weeks: Record<string, WeekPlan>;  // Key is startDate in ISO format
  currentDayMeals: Record<MealType, Meal | undefined>;
  favorites: Meal[];
  shoppingList: ShoppingList | null;
  currentWeekStartDate: string | null;
}

const STORAGE_KEY = 'meal-planner-data';

const getInitialState = (): MealState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  
  return {
    weeks: {},
    currentDayMeals: {
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined
    },
    favorites: [],
    shoppingList: null,
    currentWeekStartDate: null
  };
};

export const useMealStore = defineStore('meal', {
  state: (): MealState => getInitialState(),

  getters: {
    currentWeek: (state): WeekPlan | null => {
      if (!state.currentWeekStartDate) return null;
      return state.weeks[state.currentWeekStartDate] || null;
    },

    getMealsForDate: (state) => (date: Date): DayMeals => {
      const dateStr = date.toISOString().split('T')[0];
      
      // Szukaj w wszystkich tygodniach
      for (const week of Object.values(state.weeks)) {
        if (week.days[dateStr]) {
          return week.days[dateStr];
        }
      }
      
      // Zwróć pusty obiekt DayMeals
      return {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
        snack: undefined
      };
    },

    getWeekForDate: (state) => (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return Object.values(state.weeks).find(week => week.days[dateStr]) || null;
    }
  },

  actions: {
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
      } catch (error) {
        console.error('Error saving state to localStorage:', error);
      }
    },

    async fetchMealsForDate(date: Date) {
      const dateStr = date.toISOString().split('T')[0];
      const weekPlan = this.getWeekForDate(date);
      
      const emptyMeals: DayMeals = {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
        snack: undefined
      };
      
      this.currentDayMeals = weekPlan?.days[dateStr] || emptyMeals;
      this.saveState();
    },

    async fetchWeekMeals(startDate: Date) {
      const weekStartStr = startDate.toISOString().split('T')[0];
      this.currentWeekStartDate = weekStartStr;

      if (!this.weeks[weekStartStr]) {
        this.weeks[weekStartStr] = {
          id: weekStartStr,
          startDate: weekStartStr,
          days: {}
        };

        // Inicjalizuj dni tygodnia
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          
          this.weeks[weekStartStr].days[dateStr] = {
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined
          };
        }
      }
      
      this.saveState();
    },

    async addMeal(meal: Meal, date: Date, mealType: MealType) {
      const dateStr = date.toISOString().split('T')[0];
      const week = this.getWeekForDate(date);
      
      if (!week) {
        // Stwórz nowy tydzień jeśli nie istnieje
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        await this.fetchWeekMeals(startOfWeek);
      }
      
      // Aktualizuj posiłek w aktualnym dniu
      this.currentDayMeals[mealType] = meal;

      // Aktualizuj posiłek w tygodniu
      const updatedWeek = this.getWeekForDate(date);
      if (updatedWeek) {
        if (!updatedWeek.days[dateStr]) {
          updatedWeek.days[dateStr] = {
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined
          };
        }
        updatedWeek.days[dateStr][mealType] = meal;
      }
      
      this.saveState();
    },


    async updateMeal(meal: Meal) {
      // Aktualizuj w aktualnym dniu
      if (this.currentDayMeals[meal.type]?.id === meal.id) {
        this.currentDayMeals[meal.type] = meal;
      }

      // Aktualizuj we wszystkich tygodniach
      Object.values(this.weeks).forEach(week => {
        // Użyjmy tylko potrzebnych parametrów w forEach
        Object.values(week.days).forEach(dayMeals => {
          Object.entries(dayMeals).forEach(([type, existingMeal]) => {
            if (existingMeal?.id === meal.id) {
              dayMeals[type as MealType] = meal;
            }
          });
        });
      });

      // Aktualizuj w ulubionych
      const favoriteIndex = this.favorites.findIndex(f => f.id === meal.id);
      if (favoriteIndex !== -1) {
        this.favorites[favoriteIndex] = meal;
      }
      
      this.saveState();
    },

    async removeMeal(mealId: string) {
      // Usuń z aktualnego dnia
      Object.keys(this.currentDayMeals).forEach((type) => {
        const mealType = type as MealType;
        if (this.currentDayMeals[mealType]?.id === mealId) {
          this.currentDayMeals[mealType] = undefined;
        }
      });

      // Usuń ze wszystkich tygodni
      Object.values(this.weeks).forEach(week => {
        Object.entries(week.days).forEach(([date, dayMeals]) => {
          Object.entries(dayMeals).forEach(([type]) => {
            if (dayMeals[type as MealType]?.id === mealId) {
              dayMeals[type as MealType] = undefined;
            }
          });
        });
      });
      
      this.saveState();
    },

    async addFavoriteMeal(meal: Meal) {
      this.favorites.push({ ...meal, isFavorite: true });
      this.saveState();
    },

    async updateFavoriteMeal(meal: Meal) {
      const index = this.favorites.findIndex(f => f.id === meal.id);
      if (index !== -1) {
        this.favorites[index] = { ...meal, isFavorite: true };
      }
      this.saveState();
    },

    async removeFavoriteMeal(mealId: string) {
      const index = this.favorites.findIndex(f => f.id === mealId);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      }
      this.saveState();
    },

    async addMealToWeek(meal: Meal, date: Date, mealType: MealType) {
      const newMeal = { 
        ...meal, 
        id: crypto.randomUUID(),
        date: date.toISOString()
      };
      await this.addMeal(newMeal, date, mealType);
    },

    toggleFavorite(meal: Meal) {
      const index = this.favorites.findIndex(f => f.id === meal.id);
      if (index === -1) {
        this.favorites.push({ ...meal, isFavorite: true });
      } else {
        this.favorites.splice(index, 1);
      }
      this.saveState();
    },

    generateShoppingList() {
      if (!this.currentWeek) return;

      const ingredientMap = new Map<string, { amount: number; unit: string }>();

      Object.values(this.currentWeek.days).forEach(day => {
        Object.values(day).forEach(meal => {
          if (!meal?.ingredients) return;
          
          meal.ingredients.forEach((ingredient: Ingredient) => {
            const key = ingredient.name.toLowerCase();
            const existing = ingredientMap.get(key);
            
            if (existing && existing.unit === ingredient.unit) {
              existing.amount += ingredient.amount;
            } else {
              ingredientMap.set(key, {
                amount: ingredient.amount,
                unit: ingredient.unit,
              });
            }
          });
        });
      });

      this.shoppingList = {
        weekId: this.currentWeek.id,
        items: Array.from(ingredientMap.entries()).map(([name, details]) => ({
          ingredient: name,
          totalAmount: details.amount,
          unit: details.unit,
        })),
      };
      
      this.saveState();
    },

    clearAllData() {
      this.$reset();
      localStorage.removeItem(STORAGE_KEY);
    }
  },
});