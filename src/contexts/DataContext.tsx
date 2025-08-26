import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Company, 
  Vehicle, 
  Product, 
  Activity,
  Order,
  Transaction,
  SystemAlert,
  City,
  mockUsers, 
  mockCompanies, 
  mockVehicles, 
  mockProducts,
  mockOrders,
  mockTransactions,
  mockAlerts,
  getRecentActivities
} from '@/lib/data';

import { supabase } from "@/integrations/supabase/client";

interface DataContextType {
  users: User[];
  companies: Company[];
  vehicles: Vehicle[];
  products: Product[];
  activities: Activity[];
  orders: Order[];
  transactions: Transaction[];
  alerts: SystemAlert[];
  cities: City[];
  setUsers: (users: User[]) => void;
  setCompanies: (companies: Company[]) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setProducts: (products: Product[]) => void;
  setCities: (cities: City[]) => void;
  addUser: (user: User) => void;
  addCompany: (company: Company) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  addTransaction: (transaction: Transaction) => void;
  addAlert: (alert: SystemAlert) => void;
  addCity: (city: City) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  updateCompany: (id: number, company: Partial<Company>) => void;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  updateOrder: (id: number, order: Partial<Order>) => void;
  updateAlert: (id: number, alert: Partial<SystemAlert>) => void;
  updateCity: (id: number, city: Partial<City>) => void;
  deleteUser: (id: number) => void;
  deleteCompany: (id: number) => void;
  deleteVehicle: (id: number) => void;
  deleteProduct: (id: number) => void;
  deleteOrder: (id: number) => void;
  deleteCity: (id: number) => void;
  getMonthlyRevenue: () => number;
  getPendingOrdersCount: () => number;
  getRecentTransactionsCount: () => number;
  getSystemAlertsCount: () => number;
  getUsersGrowth: () => number;
  getCompaniesGrowth: () => number;
  getVehiclesGrowth: () => number;
  getProductsGrowth: () => number;
  generateDemoAlerts: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize all data from localStorage or use mock data
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    console.log('🚨 Initializing alerts from localStorage');
    const savedAlerts = localStorage.getItem('systemAlerts');
    console.log('🚨 Saved alerts from localStorage:', savedAlerts);
    
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        console.log('🚨 Successfully parsed alerts:', parsed.length, parsed);
        return parsed;
      } catch (error) {
        console.error('🚨 Error parsing saved alerts:', error);
        console.log('🚨 Using mock alerts as fallback');
        return mockAlerts;
      }
    }
    console.log('🚨 No saved alerts, using mock alerts:', mockAlerts.length);
    return mockAlerts;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (error) {
        console.error('Error parsing saved users:', error);
        return mockUsers;
      }
    }
    return mockUsers;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const savedCompanies = localStorage.getItem('companies');
    if (savedCompanies) {
      try {
        return JSON.parse(savedCompanies);
      } catch (error) {
        console.error('Error parsing saved companies:', error);
        return mockCompanies;
      }
    }
    return mockCompanies;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      try {
        return JSON.parse(savedVehicles);
      } catch (error) {
        console.error('Error parsing saved vehicles:', error);
        return mockVehicles;
      }
    }
    return mockVehicles;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        return mockProducts;
      }
    }
    return mockProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        console.error('Error parsing saved orders:', error);
        return mockOrders;
      }
    }
    return mockOrders;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        return JSON.parse(savedTransactions);
      } catch (error) {
        console.error('Error parsing saved transactions:', error);
        return mockTransactions;
      }
    }
    return mockTransactions;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('activities');
    console.log('Loading activities from localStorage:', savedActivities);
    console.log('localStorage keys:', Object.keys(localStorage));
    
    if (savedActivities && savedActivities !== 'null' && savedActivities !== 'undefined') {
      try {
        const parsed = JSON.parse(savedActivities);
        console.log('Successfully parsed activities from localStorage:', parsed.length, parsed);
        // If we have saved activities, return them
        if (parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('Error parsing saved activities:', error);
        localStorage.removeItem('activities'); // Clean up corrupted data
      }
    }
    
    // If no saved activities or empty array, start with some demo activities to show the feature works
    console.log('No valid saved activities found, starting with demo activities');
    const demoActivities = getRecentActivities();
    
    // Save demo activities to localStorage for consistency
    try {
      localStorage.setItem('activities', JSON.stringify(demoActivities));
      console.log('Demo activities saved to localStorage');
    } catch (error) {
      console.error('Error saving demo activities:', error);
    }
    
    return demoActivities;
  });

  const [cities, setCities] = useState<City[]>([]);

  // Save alerts to localStorage whenever alerts change
  const updateAlerts = (newAlerts: SystemAlert[] | ((prev: SystemAlert[]) => SystemAlert[])) => {
    setAlerts(prev => {
      const updated = typeof newAlerts === 'function' ? newAlerts(prev) : newAlerts;
      console.log('🚨 Updating alerts in localStorage:', updated.length, updated);
      localStorage.setItem('systemAlerts', JSON.stringify(updated));
      
      // Trigger cross-tab and same-tab sync events
      setTimeout(() => {
        console.log('🚨 DataContext: Dispatching sync events for alerts');
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'systemAlerts',
          newValue: JSON.stringify(updated),
          oldValue: JSON.stringify(prev)
        }));
        // Custom event for same-tab listeners
        window.dispatchEvent(new CustomEvent('systemAlertsUpdated', {
          detail: { count: updated.length }
        }));
        // BroadcastChannel for instant same-browser tab updates
        try {
          const bc = new BroadcastChannel('systemAlerts');
          bc.postMessage({ type: 'updated', count: updated.length, ts: Date.now() });
          bc.close();
        } catch (e) {
          console.warn('BroadcastChannel not available');
        }
      }, 50);
      
      return updated;
    });
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays <= 10) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    return 'More than 10 days ago';
  };

  // Helper function to generate activity
  const generateActivity = (type: Activity['type'], message: string, status: Activity['status'] = 'success') => {
    const now = new Date();
    const newActivity: Activity = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      message,
      time: "Just now",
      status,
      created_at: now.toISOString()
    };
    
    console.log('Generating new activity:', newActivity);
    
    setActivities(prev => {
      const updated = [newActivity, ...prev];
      // Filter activities to only show those within 10 days and limit to recent ones
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const filteredActivities = updated
        .filter(activity => {
          if (activity.created_at) {
            return new Date(activity.created_at) >= tenDaysAgo;
          }
          // For older activities without created_at, check if time indicates <= 10 days
          return !activity.time.includes('More than 10 days ago');
        })
        .slice(0, 20); // Keep maximum 20 recent activities
      
      console.log('Saving activities to localStorage:', filteredActivities.length, filteredActivities);
      
      // Robust localStorage saving with error handling
      try {
        const activitiesJson = JSON.stringify(filteredActivities);
        localStorage.setItem('activities', activitiesJson);
        console.log('Activities saved successfully to localStorage');
        
        // Verify the save worked
        const savedCheck = localStorage.getItem('activities');
        if (savedCheck) {
          console.log('Verification: Activities were saved successfully');
        } else {
          console.error('Verification failed: No activities found in localStorage after save');
        }
      } catch (error) {
        console.error('Error saving activities to localStorage:', error);
      }
      
      return filteredActivities;
    });
  };

  // Dynamic alert generation functions
  const checkLowInventoryAlert = (product: Product) => {
    // Check for low inventory (less than 100kg total weight)
    const inventoryThreshold = 100; // kg
    if (product.weight && product.weight < inventoryThreshold) {
      const lowInventoryAlert: SystemAlert = {
        id: Date.now() + Math.random(),
        type: 'warning',
        message: `Low inventory alert for Product ${product.slip_number} - ${product.weight}kg total weight`,
        created_at: new Date().toISOString(),
        resolved: false
      };
      updateAlerts(prev => [lowInventoryAlert, ...prev]);
    }
  };

  const generateVehicleApprovalAlert = (vehicle: Vehicle) => {
    const approvalAlert: SystemAlert = {
      id: Date.now() + Math.random(),
      type: 'warning',
      message: `Vehicle ${vehicle.number} status is inactive - requires approval for activation`,
      created_at: new Date().toISOString(),
      resolved: false
    };
    console.log('🚨 Generating vehicle approval alert:', approvalAlert);
    updateAlerts(prev => {
      const updated = [approvalAlert, ...prev];
      console.log('🚨 Updated alerts with new vehicle alert:', updated.length, updated);
      return updated;
    });
    
    // Trigger cross-tab sync by dispatching storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'systemAlerts',
      newValue: JSON.stringify([approvalAlert, ...alerts]),
      oldValue: JSON.stringify(alerts)
    }));
  };


  const addUser = (user: User) => {
    setUsers(prev => {
      const updated = [...prev, user];
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
    generateActivity('user', `New user ${user.user_name} registered`);
  };

  const addCompany = (company: Company) => {
    setCompanies(prev => {
      const updated = [...prev, company];
      localStorage.setItem('companies', JSON.stringify(updated));
      return updated;
    });
    generateActivity('company', `${company.name} registered as new trading partner`);
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => {
      const updated = [...prev, vehicle];
      localStorage.setItem('vehicles', JSON.stringify(updated));
      return updated;
    });
    generateActivity('vehicle', `Vehicle ${vehicle.number} registered`);
    
    // Generate pending approval alert for new vehicles with inactive status
    if (!vehicle.status) {
      generateVehicleApprovalAlert(vehicle);
    }
  };

  const addProduct = (product: Product) => {
    setProducts(prev => {
      const updated = [...prev, product];
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
    generateActivity('product', `New product ${product.slip_number} added by ${product.company_name}`);
    
    // Automatically activate the company if it's inactive when adding a product
    const relatedCompany = companies.find(company => company.id === product.company_id);
    if (relatedCompany && !relatedCompany.status) {
      updateCompany(relatedCompany.id, { status: true });
      generateActivity('company', `${relatedCompany.name} company automatically activated due to new product transaction`);
    }
    
    // Create a corresponding transaction for the product
    const newTransaction: Transaction = {
      id: Date.now() + Math.random(),
      type: 'sale',
      amount: product.final_price || 0,
      description: `Sale transaction for ${product.slip_number} from ${product.company_name} - ${product.weight}kg`,
      created_at: product.created_at || new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
    
    // Check for low inventory and generate alert
    checkLowInventoryAlert(product);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [...prev, order];
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => {
      const updated = [...prev, transaction];
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  };

  const addAlert = (alert: SystemAlert) => {
    updateAlerts(prev => [...prev, alert]);
    generateActivity('alert', alert.message, alert.type === 'error' ? 'error' : 'warning');
  };

  const addCity = (city: City) => {
    setCities(prev => {
      const updated = [...prev, city];
      localStorage.setItem('cities', JSON.stringify(updated));
      return updated;
    });
    generateActivity('company', `${city.name} added as city`);
  };

  const updateUser = (id: number, updatedUser: Partial<User>) => {
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === id) {
          const updatedUserData = { ...user, ...updatedUser };
          generateActivity('user', `User ${updatedUserData.user_name} profile updated`, 'info');
          return updatedUserData;
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCompany = (id: number, updatedCompany: Partial<Company>) => {
    setCompanies(prev => {
      const updated = prev.map(company => {
        if (company.id === id) {
          const updatedCompanyData = { ...company, ...updatedCompany };
          generateActivity('company', `${updatedCompanyData.name} company details updated`, 'info');
          return updatedCompanyData;
        }
        return company;
      });
      localStorage.setItem('companies', JSON.stringify(updated));
      return updated;
    });
  };

  const updateVehicle = (id: number, updatedVehicle: Partial<Vehicle>) => {
    setVehicles(prev => {
      const updated = prev.map(vehicle => {
        if (vehicle.id === id) {
          const updatedVehicleData = { ...vehicle, ...updatedVehicle };
          generateActivity('vehicle', `Vehicle ${updatedVehicleData.number} information updated`, 'info');
          
          // Generate alert if vehicle status changed to inactive
          if (updatedVehicle.status === false && vehicle.status === true) {
            const statusAlert: SystemAlert = {
              id: Date.now() + Math.random(),
              type: 'warning',
              message: `Vehicle ${vehicle.number} status changed to inactive - requires attention`,
              created_at: new Date().toISOString(),
              resolved: false
            };
            updateAlerts(prev => [statusAlert, ...prev]);
          }
          
          // Generate alert if vehicle status changed to active  
          if (updatedVehicle.status === true && vehicle.status === false) {
            const statusAlert: SystemAlert = {
              id: Date.now() + Math.random(),
              type: 'info',
              message: `Vehicle ${vehicle.number} has been activated and approved`,
              created_at: new Date().toISOString(),
              resolved: false
            };
            updateAlerts(prev => [statusAlert, ...prev]);
          }
          
          return updatedVehicleData;
        }
        return vehicle;
      });
      localStorage.setItem('vehicles', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id === id) {
          const updatedProductData = { ...product, ...updatedProduct };
          generateActivity('product', `Product ${updatedProductData.slip_number} details updated`, 'info');
          return updatedProductData;
        }
        return product;
      });
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteUser = (id: number) => {
    setUsers(prev => {
      const userToDelete = prev.find(user => user.id === id);
      const updated = prev.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(updated));
      
      if (userToDelete) {
        generateActivity('user', `User ${userToDelete.user_name} has been deleted`, 'warning');
      }
      
      return updated;
    });
  };

  const deleteCompany = (id: number) => {
    setCompanies(prev => {
      const companyToDelete = prev.find(company => company.id === id);
      const updated = prev.filter(company => company.id !== id);
      localStorage.setItem('companies', JSON.stringify(updated));
      
      if (companyToDelete) {
        generateActivity('company', `${companyToDelete.name} company has been removed`, 'warning');
      }
      
      return updated;
    });
  };

  const deleteVehicle = (id: number) => {
    setVehicles(prev => {
      const vehicleToDelete = prev.find(vehicle => vehicle.id === id);
      const updated = prev.filter(vehicle => vehicle.id !== id);
      localStorage.setItem('vehicles', JSON.stringify(updated));
      
      if (vehicleToDelete) {
        generateActivity('vehicle', `Vehicle ${vehicleToDelete.number} has been deleted`, 'warning');
      }
      
      return updated;
    });
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => {
      const productToDelete = prev.find(product => product.id === id);
      const updated = prev.filter(product => product.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      
      if (productToDelete) {
        generateActivity('product', `Product ${productToDelete.slip_number} has been deleted`, 'warning');
      }
      
      return updated;
    });

    // Note: Removed automatic order deletion to preserve static data as requested by user
  };

  const deleteOrder = (id: number) => {
    setOrders(prev => {
      const orderToDelete = prev.find(order => order.id === id);
      const updated = prev.filter(order => order.id !== id);
      localStorage.setItem('orders', JSON.stringify(updated));
      
      if (orderToDelete) {
        const product = products.find(p => p.id === orderToDelete.product_id);
        generateActivity('product', `Order #${orderToDelete.id} for ${product?.slip_number || 'Product'} has been deleted`, 'warning');
      }
      
      return updated;
    });
  };

  const deleteCity = (id: number) => {
    setCities(prev => {
      const updated = prev.filter(city => city.id !== id);
      localStorage.setItem('cities', JSON.stringify(updated));
      return updated;
    });
    
    // Clear location references for companies that used this city
    setCompanies(prev => {
      const updated = prev.map(company => 
        company.location_id === id ? { ...company, location_id: null, location_name: undefined } : company
      );
      localStorage.setItem('companies', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrder = (id: number, updatedOrder: Partial<Order>) => {
    setOrders(prev => {
      const updated = prev.map(order => order.id === id ? { ...order, ...updatedOrder } : order);
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAlert = (id: number, updatedAlert: Partial<SystemAlert>) => {
    updateAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, ...updatedAlert } : alert));
  };

  // Generate fresh demo alerts for cross-browser consistency
  const generateDemoAlerts = () => {
    console.log('🚨 generateDemoAlerts called');
    const currentTime = Date.now();
    const demoAlerts: SystemAlert[] = [
      {
        id: currentTime + 1,
        type: 'warning',
        message: `Low inventory alert for Product GNT-${Math.floor(Math.random() * 999)} - ${Math.floor(Math.random() * 50 + 20)}kg total weight`,
        created_at: new Date(currentTime - Math.random() * 2 * 60 * 1000).toISOString(), // Within last 2 minutes
        resolved: false
      },
      {
        id: currentTime + 2,
        type: 'info',
        message: `Vehicle TN${Math.floor(Math.random() * 99)}AB${Math.floor(Math.random() * 9999)} has been activated and approved`,
        created_at: new Date(currentTime - Math.random() * 60 * 60 * 1000).toISOString(), // Within last hour
        resolved: false
      },
      {
        id: currentTime + 3,
        type: 'error',
        message: 'System maintenance scheduled for tonight at 2:00 AM',
        created_at: new Date(currentTime - Math.random() * 3 * 60 * 60 * 1000).toISOString(), // Within last 3 hours
        resolved: false
      }
    ];
    
    console.log('🚨 Generated demo alerts:', demoAlerts);
    
    updateAlerts(prev => {
      console.log('🚨 Previous alerts before update:', prev.length);
      const updated = [...demoAlerts, ...prev.filter(alert => alert.id > 10000)]; // Keep existing non-demo alerts
      console.log('🚨 Updated alerts after demo generation:', updated.length, updated);
      return updated;
    });
  };

  const updateCity = (id: number, updatedCity: Partial<City>) => {
    setCities(prev => {
      const updated = prev.map(city => city.id === id ? { ...city, ...updatedCity } : city);
      localStorage.setItem('cities', JSON.stringify(updated));
      return updated;
    });
    
    // Update companies that reference this city
    if (updatedCity.name) {
      setCompanies(prev => {
        const updated = prev.map(company => 
          company.location_id === id ? { ...company, location_name: updatedCity.name } : company
        );
        localStorage.setItem('companies', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Dynamic calculation functions
  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.created_at);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.type === "sale";
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getPendingOrdersCount = () => orders.filter(order => order.status === "pending").length;

  const getRecentTransactionsCount = () => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    return transactions.filter(transaction => 
      new Date(transaction.created_at) >= twentyFourHoursAgo
    ).length;
  };

  const getSystemAlertsCount = () => alerts.filter(alert => !alert.resolved).length;

  // Helper function to calculate monthly growth percentage
  const calculateGrowthPercentage = (currentData: any[], type: 'users' | 'companies' | 'vehicles' | 'products') => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get last month's date
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Count current month additions
    const currentMonthCount = currentData.filter(item => {
      const createdDate = new Date(item.created_at);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    // Count last month's total (all items created up to last month)
    const lastMonthTotalCount = currentData.filter(item => {
      const createdDate = new Date(item.created_at);
      return createdDate < new Date(currentYear, currentMonth, 1);
    }).length;
    
    // Calculate percentage growth
    if (lastMonthTotalCount === 0) {
      return currentMonthCount > 0 ? 100 : 0;
    }
    
    return Math.round((currentMonthCount / lastMonthTotalCount) * 100);
  };

  const getUsersGrowth = () => calculateGrowthPercentage(users, 'users');
  const getCompaniesGrowth = () => calculateGrowthPercentage(companies, 'companies');
  const getVehiclesGrowth = () => calculateGrowthPercentage(vehicles, 'vehicles');
  const getProductsGrowth = () => calculateGrowthPercentage(products, 'products');

  // Generate alerts based on actual data conditions for cross-browser consistency
  const generateDataBasedAlerts = () => {
    console.log('🚨 Generating data-based alerts for cross-browser consistency');
    const newAlerts: SystemAlert[] = [];
    const now = new Date();
    
    // Check for active vehicles (these should always generate alerts)
    vehicles.forEach(vehicle => {
      if (vehicle.status) { // If vehicle is active
        newAlerts.push({
          id: 1000 + vehicle.id,
          type: 'info',
          message: `Vehicle ${vehicle.number} has been activated and approved`,
          created_at: new Date(now.getTime() - Math.random() * 60 * 60 * 1000).toISOString(), // Within last hour
          resolved: false
        });
      }
    });

    // Check for low inventory products
    products.forEach(product => {
      if (product.weight && product.weight < 100) {
        newAlerts.push({
          id: 2000 + product.id,
          type: 'warning',
          message: `Low inventory alert for Product ${product.slip_number} - ${product.weight}kg total weight`,
          created_at: new Date(now.getTime() - Math.random() * 60 * 60 * 1000).toISOString(), // Within last hour
          resolved: false
        });
      }
    });

    // Always add some system alerts for demo purposes
    newAlerts.push(
      {
        id: 9001,
        type: 'warning',
        message: 'System maintenance scheduled for tonight at 2:00 AM',
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        resolved: false
      },
      {
        id: 9002,
        type: 'info',  
        message: 'Database backup completed successfully',
        created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        resolved: false
      }
    );

    console.log('🚨 Generated data-based alerts:', newAlerts.length, newAlerts);
    return newAlerts;
  };

  // Auto-generate alerts based on actual data for cross-browser consistency
  useEffect(() => {
    console.log('🚨 useEffect triggered - generating data-based alerts');
    const dataBasedAlerts = generateDataBasedAlerts();
    
    if (dataBasedAlerts.length > 0) {
      updateAlerts(prev => {
        // Remove old system-generated alerts and add new ones
        const userAlerts = prev.filter(alert => alert.id < 1000 || alert.id > 10000);
        const updated = [...dataBasedAlerts, ...userAlerts];
        
        console.log('🚨 Setting alerts with data-based alerts:', updated.length);
        return updated;
      });
    }
  }, [vehicles, products]); // Re-run when vehicles or products change

  // Load initial data from Supabase once
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        console.info('🔗 Loading initial data from Supabase...');
        const [
          { data: citiesData },
          { data: companiesData },
          { data: vehiclesData },
          { data: productsData },
          { data: ordersData },
          { data: transactionsData },
          { data: usersData },
          { data: alertsData },
          { data: activitiesData },
        ] = await Promise.all([
          supabase.from('cities').select('*'),
          supabase.from('companies').select('*'),
          supabase.from('vehicles').select('*'),
          supabase.from('products').select('*'),
          supabase.from('orders').select('*'),
          supabase.from('transactions').select('*'),
          supabase.from('users').select('*'),
          supabase.from('alerts').select('*'),
          supabase.from('activities').select('*'),
        ]);

        console.info('📥 Merging Supabase data with existing demo data...');

        // UUID -> numeric id mappers (to fit current UI types)
        const cityIdMap = new Map<string, number>();
        const companyIdMap = new Map<string, number>();
        const vehicleIdMap = new Map<string, number>();
        const productIdMap = new Map<string, number>();
        const mkId = (map: Map<string, number>) => (uuid: string | null | undefined) => {
          if (!uuid) return null;
          if (!map.has(uuid)) map.set(uuid, map.size + 1_000_000);
          return map.get(uuid)!;
        };
        const mapCityId = mkId(cityIdMap);
        const mapCompanyId = mkId(companyIdMap);
        const mapVehicleId = mkId(vehicleIdMap);
        const mapProductId = mkId(productIdMap);

        const mappedCities = (citiesData || []).map((c: any) => ({
          id: mapCityId(c.id) || Date.now(),
          name: c.name,
          status: c.status ?? true,
          created_at: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedCities.length) {
          setCities(prev => {
            // Merge with existing, avoid duplicates by name
            const existing = prev.filter(city => 
              !mappedCities.some(newCity => newCity.name === city.name)
            );
            return [...existing, ...mappedCities];
          });
        }

        const mappedCompanies = (companiesData || []).map((co: any) => ({
          id: mapCompanyId(co.id) || Date.now(),
          name: co.name,
          location_id: mapCityId(co.location_id) ?? null,
          location_name: co.location_name ?? undefined,
          status: co.status ?? true,
          created_at: co.created_at ? new Date(co.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedCompanies.length) {
          setCompanies(prev => {
            // Merge with existing, avoid duplicates by name
            const existing = prev.filter(company => 
              !mappedCompanies.some(newCompany => newCompany.name === company.name)
            );
            return [...existing, ...mappedCompanies];
          });
        }

        const mappedVehicles = (vehiclesData || []).map((v: any) => ({
          id: mapVehicleId(v.id) || Date.now(),
          number: v.number,
          company_id: mapCompanyId(v.company_id) ?? 0,
          company_name: v.company_name ?? undefined,
          status: v.status ?? true,
          created_at: v.created_at ? new Date(v.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedVehicles.length) {
          setVehicles(prev => {
            // Merge with existing, avoid duplicates by number
            const existing = prev.filter(vehicle => 
              !mappedVehicles.some(newVehicle => newVehicle.number === vehicle.number)
            );
            return [...existing, ...mappedVehicles];
          });
        }

        const mappedProducts = (productsData || []).map((p: any) => ({
          id: mapProductId(p.id) || Date.now(),
          company_id: mapCompanyId(p.company_id) ?? 0,
          company_name: p.company_name,
          vehicle_id: mapVehicleId(p.vehicle_id) ?? 0,
          vehicle_number: p.vehicle_number,
          slip_number: p.slip_number,
          purchase_date: p.purchase_date,
          bag: Number(p.bag) || 0,
          price: Number(p.price) || 0,
          weight: Number(p.weight) || 0,
          net_weight: Number(p.net_weight) || 0,
          total_price: Number(p.total_price) || 0,
          final_price: Number(p.final_price) || 0,
          created_at: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedProducts.length) {
          setProducts(prev => {
            // Merge with existing, avoid duplicates by slip_number
            const existing = prev.filter(product => 
              !mappedProducts.some(newProduct => newProduct.slip_number === product.slip_number)
            );
            return [...existing, ...mappedProducts];
          });
        }

        const mappedOrders = (ordersData || []).map((o: any, idx: number) => ({
          id: idx + 1_000_000,
          product_id: mapProductId(o.product_id) ?? 0,
          status: (o.status as 'pending' | 'completed' | 'cancelled') || 'pending',
          amount: Number(o.amount) || 0,
          created_at: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedOrders.length) {
          setOrders(prev => [...prev, ...mappedOrders]);
        }

        const mappedTransactions = (transactionsData || []).map((t: any, idx: number) => ({
          id: idx + 1_000_000,
          type: (t.type as 'purchase' | 'sale' | 'payment') || 'sale',
          amount: Number(t.amount) || 0,
          description: t.description || '',
          created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        }));
        if (mappedTransactions.length) {
          setTransactions(prev => [...prev, ...mappedTransactions]);
        }

        const mappedUsers = (usersData || []).map((u: any, idx: number) => ({
          id: idx + 1_000_000,
          user_name: u.user_name,
          email_address: u.email_address,
          password: u.password || '',
          type: (String(u.type).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER') as 'ADMIN' | 'USER',
          mobile_number: u.mobile_number || '',
          country_code: u.country_code || '+91',
          status: u.status ?? true,
          created_at: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        if (mappedUsers.length) {
          setUsers(prev => {
            // Merge with existing, avoid duplicates by email
            const existing = prev.filter(user => 
              !mappedUsers.some(newUser => newUser.email_address === user.email_address)
            );
            return [...existing, ...mappedUsers];
          });
        }

        const mappedActivities = (activitiesData || []).map((a: any, idx: number) => ({
          id: idx + 1_000_000,
          type: a.type || 'info',
          message: a.message || '',
          status: (a.status as 'success' | 'warning' | 'info' | 'error') || 'info',
          time: 'Just now',
          created_at: a.created_at ? new Date(a.created_at).toISOString() : new Date().toISOString(),
        }));
        if (mappedActivities.length) {
          setActivities(prev => [...prev, ...mappedActivities]);
        }

        const mappedAlerts = (alertsData || []).map((al: any, idx: number) => ({
          id: 2_000_000 + idx,
          type: (al.type as 'warning' | 'error' | 'info') || 'info',
          message: al.message || '',
          created_at: al.created_at ? new Date(al.created_at).toISOString() : new Date().toISOString(),
          resolved: false,
        }));
        if (mappedAlerts.length) {
          updateAlerts(prev => [...prev, ...mappedAlerts]);
        }

        console.info('✅ Supabase data loaded into context.');
      } catch (e) {
        console.error('❌ Failed to load from Supabase:', e);
      }
    };
    loadFromSupabase();
  }, []);

return (
  <DataContext.Provider value={{
    users,
    companies,
    vehicles,
    products,
    activities,
    orders,
    transactions,
    alerts,
    cities,
    setUsers,
    setCompanies,
    setVehicles,
    setProducts,
    setCities,
    addUser,
    addCompany,
    addVehicle,
    addProduct,
    addOrder,
    addTransaction,
    addAlert,
    addCity,
    updateUser,
    updateCompany,
    updateVehicle,
    updateProduct,
    updateOrder,
    updateAlert,
    updateCity,
    deleteUser,
    deleteCompany,
    deleteVehicle,
    deleteProduct,
    deleteOrder,
    deleteCity,
    getMonthlyRevenue,
    getPendingOrdersCount,
    getRecentTransactionsCount,
    getSystemAlertsCount,
    getUsersGrowth,
    getCompaniesGrowth,
    getVehiclesGrowth,
    getProductsGrowth,
    generateDemoAlerts
  }}>
    {children}
  </DataContext.Provider>
);
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}