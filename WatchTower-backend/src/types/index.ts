// User Interface
export interface User {
  id: string;
  email: string;
  password?: string; // Optional rakha hai taaki response mein password na jaye
  createdAt: Date;
}

// Monitor Interface
export interface Monitor {
  id: string;
  userId: string;
  url: string;
  interval: number; // Seconds mein (e.g., 30, 60)
  isActive: boolean;
  lastStatus?: number; // e.g., 200, 404, 500
  lastChecked?: Date;
}