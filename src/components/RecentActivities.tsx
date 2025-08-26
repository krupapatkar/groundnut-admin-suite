import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Truck,
  Package,
  AlertCircle,
} from "lucide-react";
import { Activity } from '@/lib/data';

interface RecentActivitiesProps {
  activities: Activity[];
}

// Helper function to format time dynamically
const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return "Unknown time";
  
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

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const [displayActivities, setDisplayActivities] = useState<Activity[]>([]);

  // Update time formatting every minute
  useEffect(() => {
    const updateTimes = () => {
      console.log('📊 RecentActivities - Raw activities received:', activities.length, activities);
      
      const processedActivities = activities.map(activity => ({
        ...activity,
        time: formatTimeAgo(activity.created_at)
      }));
      
      // Filter to only show activities within 10 days
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const filteredActivities = processedActivities.filter(activity => {
        if (!activity.created_at) {
          console.log('⚠️ Activity without created_at:', activity);
          return true; // Keep activities without timestamp for backward compatibility
        }
        
        const activityDate = new Date(activity.created_at);
        const isValid = !isNaN(activityDate.getTime());
        const isWithinRange = isValid && activityDate >= tenDaysAgo;
        
        return isWithinRange;
      });
      
      console.log('✅ RecentActivities - Final filtered activities to display:', filteredActivities.length, filteredActivities);
      setDisplayActivities(filteredActivities);
    };

    // Initial update
    updateTimes();

    // Update every minute
    const interval = setInterval(updateTimes, 60000);

    return () => clearInterval(interval);
  }, [activities]);

  const filteredActivities = displayActivities.slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0">
                {activity.type === "product" && <Package className="h-5 w-5 text-primary" />}
                {activity.type === "company" && <Building2 className="h-5 w-5 text-accent" />}
                {activity.type === "vehicle" && <Truck className="h-5 w-5 text-primary" />}
                {activity.type === "user" && <Users className="h-5 w-5 text-primary" />}
                {activity.type === "alert" && <AlertCircle className="h-5 w-5 text-warning" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge variant={activity.status === "success" ? "default" : activity.status === "warning" ? "destructive" : "secondary"}>
                {activity.status}
              </Badge>
            </div>
          ))}
          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No recent activities in the last 10 days
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}