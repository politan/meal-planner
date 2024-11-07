export interface ShoppingListItem {
    ingredient: string;
    totalAmount: number;
    unit: string;
  }
  
  export interface ShoppingList {
    weekId: string;
    items: ShoppingListItem[];
  }