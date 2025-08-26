import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Smartphone,
  Globe,
  Key,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Load settings from localStorage or use defaults
  const getStoredSettings = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [generalSettings, setGeneralSettings] = useState(() =>
    getStoredSettings('groundnut-general-settings', {
      companyName: "GroundnutPro Trading",
      contactEmail: "admin@groundnutpro.com",
      contactPhone: "+91 9876543210",
      address: "123 Trading Street, Chennai, Tamil Nadu",
      timezone: "Asia/Kolkata",
      currency: "INR",
      language: "en"
    })
  );

  const [notifications, setNotifications] = useState(() =>
    getStoredSettings('groundnut-notification-settings', {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      weeklyReports: true,
      monthlyReports: true,
      lowInventoryAlerts: true,
      paymentReminders: true,
      systemUpdates: false
    })
  );

  const [security, setSecurity] = useState(() =>
    getStoredSettings('groundnut-security-settings', {
      twoFactorAuth: false,
      passwordExpiry: "90",
      sessionTimeout: "30",
      ipWhitelisting: false,
      auditLogging: true
    })
  );

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('groundnut-general-settings', JSON.stringify(generalSettings));
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Settings Updated",
          description: "General settings have been successfully saved.",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleNotificationToggle = (key: string) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    };
    setNotifications(updatedNotifications);
    localStorage.setItem('groundnut-notification-settings', JSON.stringify(updatedNotifications));
    toast({
      title: "Notification Updated",
      description: `${key} preference has been updated.`,
    });
  };

  const handleSecurityChange = (key: string, value: boolean | string) => {
    const updatedSecurity = {
      ...security,
      [key]: value
    };
    setSecurity(updatedSecurity);
    localStorage.setItem('groundnut-security-settings', JSON.stringify(updatedSecurity));
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared. You'll receive an email when ready.",
    });
  };

  const backupData = () => {
    toast({
      title: "Backup Initiated",
      description: "System backup has been started successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Configure your system preferences and security settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            Data & Backup
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Update your company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveGeneral} disabled={loading} className="w-full md:w-auto">
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important system alerts via email' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly business performance summaries' },
                { key: 'monthlyReports', label: 'Monthly Reports', description: 'Comprehensive monthly analytics reports' },
                { key: 'lowInventoryAlerts', label: 'Low Inventory Alerts', description: 'Notifications when stock levels are low' },
                { key: 'paymentReminders', label: 'Payment Reminders', description: 'Reminders for pending payments' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications] as boolean}
                    onCheckedChange={() => handleNotificationToggle(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile & Push Notifications
              </CardTitle>
              <CardDescription>Manage your mobile and push notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'smsAlerts', label: 'SMS Alerts', description: 'Receive critical alerts via SMS' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications for real-time updates' },
                { key: 'systemUpdates', label: 'System Updates', description: 'Notifications about system maintenance and updates' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications] as boolean}
                    onCheckedChange={() => handleNotificationToggle(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Authentication & Access
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={security.passwordExpiry} onValueChange={(value) => handleSecurityChange('passwordExpiry', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Advanced Security</h4>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch
                    checked={security.ipWhitelisting}
                    onCheckedChange={(checked) => handleSecurityChange('ipWhitelisting', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Audit Logging</p>
                    <p className="text-sm text-muted-foreground">Log all user activities for security monitoring</p>
                  </div>
                  <Switch
                    checked={security.auditLogging}
                    onCheckedChange={(checked) => handleSecurityChange('auditLogging', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your data, backups, and exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Export Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your complete database in CSV or JSON format
                  </p>
                  <Button onClick={exportData} variant="outline" className="w-full">
                    Export All Data
                  </Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Backup System</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a complete backup of your system data
                  </p>
                  <Button onClick={backupData} className="w-full">
                    Create Backup
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Recent Backups</h4>
                <div className="space-y-3">
                  {[
                    { date: "2024-01-20", size: "2.4 GB", status: "completed" },
                    { date: "2024-01-19", size: "2.3 GB", status: "completed" },
                    { date: "2024-01-18", size: "2.2 GB", status: "completed" }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Backup {backup.date}</p>
                        <p className="text-sm text-muted-foreground">Size: {backup.size}</p>
                      </div>
                      <Badge variant="secondary">
                        {backup.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Management
              </CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Admin User</h3>
                  <p className="text-muted-foreground">admin@groundnutpro.com</p>
                  <Badge variant="secondary">System Administrator</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                </div>
                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}