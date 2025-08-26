import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
} from "lucide-react";
import { SystemAlert } from '@/lib/data';
import realTimeAlertsLogo from '@/assets/real-time-alerts-logos.png';
import lowIcon from '@/assets/low.png';
import monthlyIcon from '@/assets/monthly.png';
import paymentIcon from '@/assets/payment.png';
import newVehicleIcon from '@/assets/New vehicle.png';

interface RealTimeAlertsProps {
  alerts: SystemAlert[];
  onResolveAlert?: (alertId: number) => void;
}

// Helper function to format time dynamically
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays <= 10) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return 'More than 10 days ago';
  }
};

export default function RealTimeAlerts({ alerts, onResolveAlert }: RealTimeAlertsProps) {
  const [displayAlerts, setDisplayAlerts] = useState<SystemAlert[]>([]);

  // Sync with localStorage and cross-tab changes
  useEffect(() => {
    console.log('📢 RealTimeAlerts: useEffect triggered - Props alerts:', alerts.length);
    console.log('📢 RealTimeAlerts: Current displayAlerts:', displayAlerts.length);
    
    const syncAlerts = () => {
      // Always get the latest alerts from localStorage first
      const savedAlerts = localStorage.getItem('systemAlerts');
      console.log('📢 RealTimeAlerts: localStorage raw data:', savedAlerts ? savedAlerts.substring(0, 100) + '...' : 'null');
      
      let latestAlerts = [];
      
      if (savedAlerts) {
        try {
          const parsed = JSON.parse(savedAlerts);
          console.log('📢 RealTimeAlerts: Parsed localStorage alerts count:', parsed.length);
          console.log('📢 RealTimeAlerts: Latest 3 alerts from localStorage:', parsed.slice(0, 3));
          latestAlerts = parsed;
        } catch (error) {
          console.error('📢 RealTimeAlerts: Error parsing localStorage alerts:', error);
          latestAlerts = alerts; // Fallback to props
        }
      } else {
        console.log('📢 RealTimeAlerts: No localStorage data, using props alerts:', alerts.length);
        latestAlerts = alerts;
      }

      console.log('📢 RealTimeAlerts: Final alerts to display:', latestAlerts.length);

      // Update with fresh time calculations
      const alertsWithTime = latestAlerts.map((alert: SystemAlert) => ({
        ...alert,
        timeAgo: formatTimeAgo(alert.created_at)
      }));
      
      console.log('📢 RealTimeAlerts: Setting displayAlerts to:', alertsWithTime.length);
      setDisplayAlerts(alertsWithTime);
    };

    // Initial sync
    syncAlerts();

    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('📢 RealTimeAlerts: Storage change detected:', e.key, e.newValue);
      if (e.key === 'systemAlerts') {
        console.log('📢 RealTimeAlerts: Syncing alerts due to storage change');
        syncAlerts();
      }
    };

    // Also listen for custom storage events for better cross-tab sync
    const handleCustomStorageChange = () => {
      console.log('📢 RealTimeAlerts: Custom storage event detected');
      syncAlerts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('systemAlertsUpdated', handleCustomStorageChange as EventListener);

    // BroadcastChannel for instant same-browser tab updates
    const bc = 'BroadcastChannel' in window ? new BroadcastChannel('systemAlerts') : null;
    if (bc) {
      bc.onmessage = () => {
        console.log('📢 RealTimeAlerts: BroadcastChannel message received');
        syncAlerts();
      };
    }

    // Update times every minute
    const interval = setInterval(() => {
      console.log('📢 RealTimeAlerts: Updating times for', displayAlerts.length, 'alerts');
      setDisplayAlerts(prev => prev.map(alert => ({
        ...alert,
        timeAgo: formatTimeAgo(alert.created_at)
      })));
    }, 60000);

    // Force sync every 3 seconds to ensure cross-tab consistency
    const syncInterval = setInterval(() => {
      console.log('📢 RealTimeAlerts: Periodic sync check - comparing localStorage vs current');
      const currentSavedAlerts = localStorage.getItem('systemAlerts');
      if (currentSavedAlerts) {
        try {
          const parsed = JSON.parse(currentSavedAlerts);
          if (parsed.length !== displayAlerts.length) {
            console.log('📢 RealTimeAlerts: Alert count changed - syncing!', parsed.length, 'vs', displayAlerts.length);
            syncAlerts();
          }
        } catch (error) {
          console.error('📢 RealTimeAlerts: Error in periodic sync:', error);
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('systemAlertsUpdated', handleCustomStorageChange as EventListener);
      bc?.close();
    };
  }, [alerts]);

  // Filter to only show unresolved alerts within 10 days and sort by latest first
  const filteredAlerts = displayAlerts
    .filter(alert => {
      if (alert.resolved) {
        console.log('📢 RealTimeAlerts: Filtering out resolved alert:', alert.id);
        return false; // Don't show resolved alerts
      }
      
      const alertDate = new Date(alert.created_at);
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const isWithinTenDays = alertDate >= tenDaysAgo;
      
      if (!isWithinTenDays) {
        console.log('📢 RealTimeAlerts: Filtering out old alert:', alert.id, alert.created_at);
      }
      
      return isWithinTenDays;
    })
    .sort((a, b) => {
      // Sort by creation time - latest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 25); // Show latest 25 alerts

  console.log('📢 RealTimeAlerts: Final filtered alerts to display:', filteredAlerts.length, filteredAlerts);

  const getAlertIcon = (type: SystemAlert['type'], message: string) => {
    // Check message content to determine appropriate custom image
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('low')) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    if (lowerMessage.includes('revenue') || lowerMessage.includes('target') || lowerMessage.includes('achieved')) {
      return <img src={monthlyIcon} alt="Monthly target" className="h-8 w-8" />;
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('delay') || lowerMessage.includes('overdue')) {
      return <img src={paymentIcon} alt="Payment" className="h-8 w-8" />;
    }
    if (lowerMessage.includes('vehicle') || lowerMessage.includes('fleet') || lowerMessage.includes('added')) {
      return <img src={newVehicleIcon} alt="New vehicle" className="h-8 w-8" />;
    }
    
    // Default fallback
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };

  const getAlertBadgeVariant = (type: SystemAlert['type']) => {
    return 'secondary' as const;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <img 
            src={realTimeAlertsLogo} 
            alt="Real-time Alerts" 
            className="h-10 w-auto"
          />
          <div>
            <div>Real-time Alerts</div>
            <p className="text-sm font-normal text-muted-foreground">Important notifications and system updates</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {filteredAlerts.length > 0 && (
          <div className="mb-3 px-1">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} recent notification{filteredAlerts.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type, alert.message)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {(alert as any).timeAgo || formatTimeAgo(alert.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <div className="space-y-2">
                <p className="text-base font-medium">All Clear!</p>
                <p className="text-sm">No active alerts in the last 10 days</p>
                <p className="text-xs opacity-75">System is running smoothly</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full py-2 px-4 text-sm font-medium text-foreground bg-white border border-border rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-200">
            View All Alerts
          </button>
        </div>
      </CardContent>
    </Card>
  );
}