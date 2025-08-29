// Centralized mock data for the application
export interface User {
  id: string;
  supabase_id?: string;
  user_name: string;
  email_address: string;
  password: string;
  type: "ADMIN" | "USER";
  mobile_number: string;
  country_code: string;
  status: boolean;
  created_at: string;
}

export interface Company {
  id: number;
  name: string;
  location_id: number | null;
  location_name?: string;
  status: boolean;
  created_at: string;
}

export interface Vehicle {
  id: number;
  number: string;
  company_id: number;
  company_name?: string;
  status: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  company_name: string;
  vehicle_id: string;
  vehicle_number: string;
  slip_number: string;
  purchase_date: string;
  bag: number;
  price: number;
  weight: number;
  net_weight: number;
  total_price: number;
  final_price: number;
  created_at: string;
}

export interface Order {
  id: number;
  product_id: string;
  status: "pending" | "completed" | "cancelled";
  amount: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  type: "purchase" | "sale" | "payment";
  amount: number;
  description: string;
  created_at: string;
}

export interface SystemAlert {
  id: number;
  type: "warning" | "error" | "info";
  message: string;
  created_at: string;
  resolved: boolean;
}

export interface Activity {
  id: number | string;
  type: "product" | "company" | "vehicle" | "user" | "alert";
  message: string;
  time: string;
  status: "success" | "warning" | "info" | "error";
  created_at?: string;
}

export interface City {
  id: number;
  supabase_id?: string;
  name: string;
  status: boolean;
  created_at: string;
}

// Mock data
export const mockUsers: User[] = [];

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: "ABC Trading Co.",
    location_id: 1,
    location_name: "Chennai",
    status: true,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    name: "XYZ Enterprises",
    location_id: 2,
    location_name: "Bangalore",
    status: true,
    created_at: "2024-01-16",
  },
  {
    id: 3,
    name: "Global Groundnut Ltd",
    location_id: 3,
    location_name: "Mumbai",
    status: true,
    created_at: "2024-01-17",
  },
  {
    id: 4,
    name: "South India Traders",
    location_id: 4,
    location_name: "Delhi",
    status: false,
    created_at: "2024-01-18",
  },
  {
    id: 5,
    name: "Delhi Groundnut Corp",
    location_id: 5,
    location_name: "Delhi",
    status: true,
    created_at: "2024-02-12",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    number: "TN-01-AB-1234",
    company_id: 1,
    company_name: "ABC Trading Co.",
    status: true,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    number: "KA-05-XY-5678",
    company_id: 2,
    company_name: "XYZ Enterprises",
    status: true,
    created_at: "2024-01-16",
  },
  {
    id: 3,
    number: "MH-12-CD-9012",
    company_id: 3,
    company_name: "Global Groundnut Ltd",
    status: true,
    created_at: "2024-01-17",
  },
  {
    id: 4,
    number: "TN-11-EF-3456",
    company_id: 4,
    company_name: "South India Traders",
    status: false,
    created_at: "2024-01-18",
  },
  {
    id: 5,
    number: "KA-20-GH-7890",
    company_id: 1,
    company_name: "ABC Trading Co.",
    status: true,
    created_at: "2024-01-19",
  },
  {
    id: 6,
    number: "DL-01-XY-9999",
    company_id: 5,
    company_name: "Delhi Groundnut Corp",
    status: true,
    created_at: "2024-02-12",
  },
];

export const mockProducts: Product[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    company_id: "550e8400-e29b-41d4-a716-446655440011",
    company_name: "ABC Trading Co.",
    vehicle_id: "550e8400-e29b-41d4-a716-446655440021", 
    vehicle_number: "TN-01-AB-1234",
    slip_number: "SL001",
    purchase_date: "2024-01-15",
    bag: 100,
    price: 50.00,
    weight: 5000.00,
    net_weight: 4950.00,
    total_price: 247500.00,
    final_price: 260000.00,
    created_at: "2024-01-15",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    company_id: "550e8400-e29b-41d4-a716-446655440012",
    company_name: "XYZ Enterprises",
    vehicle_id: "550e8400-e29b-41d4-a716-446655440022",
    vehicle_number: "KA-05-XY-5678",
    slip_number: "SL002",
    purchase_date: "2024-02-10",
    bag: 150,
    price: 52.00,
    weight: 7500.00,
    net_weight: 7425.00,
    total_price: 386100.00,
    final_price: 405000.00,
    created_at: "2024-02-10",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    company_id: "550e8400-e29b-41d4-a716-446655440013",
    company_name: "Global Groundnut Ltd",
    vehicle_id: "550e8400-e29b-41d4-a716-446655440023",
    vehicle_number: "MH-12-CD-9012",
    slip_number: "SL003",
    purchase_date: "2024-02-15",
    bag: 200,
    price: 48.00,
    weight: 10000.00,
    net_weight: 9900.00,
    total_price: 475200.00,
    final_price: 500000.00,
    created_at: "2024-02-15",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    company_id: "550e8400-e29b-41d4-a716-446655440014",
    company_name: "Delhi Groundnut Corp",
    vehicle_id: "550e8400-e29b-41d4-a716-446655440024",
    vehicle_number: "DL-01-XY-9999",
    slip_number: "SL004",
    purchase_date: "2024-02-14",
    bag: 120,
    price: 55.00,
    weight: 6000.00,
    net_weight: 5940.00,
    total_price: 326700.00,  
    final_price: 350000.00,
    created_at: "2024-02-14",
  },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    product_id: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    amount: 260000.00,
    created_at: "2024-08-19",
  },
  {
    id: 2,
    product_id: "550e8400-e29b-41d4-a716-446655440002",
    status: "pending",
    amount: 405000.00,
    created_at: "2024-08-18",
  },
  {
    id: 3,
    product_id: "550e8400-e29b-41d4-a716-446655440003",
    status: "completed",
    amount: 500000.00,
    created_at: "2024-08-17",
  },
  {
    id: 4,
    product_id: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    amount: 150000.00,
    created_at: "2024-08-16",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "purchase",
    amount: 260000.00,
    description: "Purchase from ABC Trading Co. - SL001",
    created_at: "2024-08-19T10:30:00",
  },
  {
    id: 2,
    type: "sale",
    amount: 405000.00,
    description: "Sale to XYZ Enterprises - SL002",
    created_at: "2024-08-19T09:15:00",
  },
  {
    id: 3,
    type: "payment",
    amount: 500000.00,
    description: "Payment received from Global Groundnut Ltd",
    created_at: "2024-08-18T16:45:00",
  },
  {
    id: 4,
    type: "purchase",
    amount: 125000.00,
    description: "Purchase from South India Traders",
    created_at: "2024-08-18T14:20:00",
  },
];

export const mockAlerts: SystemAlert[] = [
  {
    id: 1,
    type: "warning",
    message: "Low inventory alert for Product GNT-001 - 45kg total weight",
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    resolved: false
  },
  {
    id: 2,
    type: "info", 
    message: "Vehicle MH12AB1234 has been activated and approved",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    resolved: false
  },
  {
    id: 3,
    type: "error",
    message: "System maintenance scheduled for tonight at 2:00 AM",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago  
    resolved: false
  },
  {
    id: 4,
    type: "warning",
    message: "Vehicle KA05CD5678 status changed to inactive - requires attention",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    resolved: false
  },
  {
    id: 5,
    type: "info",
    message: "New trading partner Maharashtra Traders registered successfully", 
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    resolved: false
  }
];

export const mockActivities: Activity[] = [
  {
    id: 1,
    type: "product",
    message: "New product added by ABC Trading Co.",
    time: "2 hours ago",
    status: "success",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    type: "company",
    message: "XYZ Enterprises updated their profile",
    time: "4 hours ago",
    status: "info",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: 3,
    type: "vehicle",
    message: "Vehicle TN-123-ABC registered",
    time: "6 hours ago",
    status: "success",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: 4,
    type: "alert",
    message: "Low inventory alert for Product ID: 456",
    time: "8 hours ago",
    status: "warning",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    id: 5,
    type: "user",
    message: "New user Alice Brown registered",
    time: "1 day ago",
    status: "success",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

// Utility functions to get counts
export const getUsersCount = () => mockUsers.length;
export const getCompaniesCount = () => mockCompanies.length;
export const getVehiclesCount = () => mockVehicles.length;
export const getProductsCount = () => mockProducts.length;

// Get active counts
export const getActiveUsersCount = () => mockUsers.filter(user => user.status).length;
export const getActiveCompaniesCount = () => mockCompanies.filter(company => company.status).length;
export const getActiveVehiclesCount = () => mockVehicles.filter(vehicle => vehicle.status).length;

// Dashboard metrics
export const getMonthlyRevenue = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return mockTransactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.type === "sale";
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getPendingOrdersCount = () => mockOrders.filter(order => order.status === "pending").length;

export const getRecentTransactionsCount = () => {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  return mockTransactions.filter(transaction => 
    new Date(transaction.created_at) >= twentyFourHoursAgo
  ).length;
};

export const getSystemAlertsCount = () => mockAlerts.filter(alert => !alert.resolved).length;

export const getRecentActivities = (): Activity[] => {
  // Create demo activities for fresh browser sessions (when localStorage is empty)
  const now = new Date();
  
  return [
    {
      id: "demo-1",
      type: "product",
      message: "Demo: Product SL001 added by ABC Trading Co.",
      time: "2 hours ago",
      status: "success",
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "demo-2", 
      type: "company",
      message: "Demo: XYZ Enterprises updated profile",
      time: "4 hours ago",
      status: "info",
      created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "demo-3",
      type: "vehicle",
      message: "Demo: Vehicle TN-01-AB-1234 registered",
      time: "6 hours ago",
      status: "success",
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Helper function to convert date to "time ago" format
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 10) {
    return 'More than 10 days ago';
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return "Just now";
  }
};

// Helper function to convert "time ago" back to date (for sorting)
const getDateFromTimeAgo = (timeAgo: string): Date => {
  const now = new Date();
  if (timeAgo === "Just now") return now;
  
  const match = timeAgo.match(/(\d+)\s+(hour|day)s?\s+ago/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === "hour") {
      return new Date(now.getTime() - value * 60 * 60 * 1000);
    } else if (unit === "day") {
      return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
    }
  }
  return now;
};

// Additional utility functions
export const getTotalRevenue = () => mockTransactions
  .filter(transaction => transaction.type === "sale")
  .reduce((total, transaction) => total + transaction.amount, 0);

export const getRecentTransactions = () => mockTransactions
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 5);

export const getUnresolvedAlerts = () => mockAlerts.filter(alert => !alert.resolved);