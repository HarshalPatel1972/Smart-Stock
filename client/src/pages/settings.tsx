import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Lock, Users, Shield, Zap, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  
  // Profile settings form state
  const [profileForm, setProfileForm] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Inventory Manager",
    bio: "I manage inventory and supply chain operations for our retail locations."
  });
  
  // Notification settings form state
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    newOrderNotifications: true,
    supplierUpdates: true,
    systemNotifications: false,
    emailNotifications: true,
    pushNotifications: false
  });
  
  // Mock function to update profile
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      setSavingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };
  
  // Mock function to update notification settings
  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    
    // Simulate API call
    setTimeout(() => {
      setSavingNotifications(false);
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };
  
  // Mock function to change password
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSecurity(true);
    
    // Simulate API call
    setTimeout(() => {
      setSavingSecurity(false);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      
      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="hidden md:flex">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{profileForm.fullName}</h3>
                  <p className="text-sm text-gray-500">{profileForm.role}</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Title / Role</Label>
                    <Input 
                      id="role" 
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a bit about yourself"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications from the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Notification Types</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="lowStockAlerts" className="font-normal text-base">Low Stock Alerts</Label>
                        <span className="text-sm text-gray-500">
                          Receive alerts when inventory falls below reorder levels
                        </span>
                      </div>
                      <Switch 
                        id="lowStockAlerts" 
                        checked={notificationSettings.lowStockAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, lowStockAlerts: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="newOrderNotifications" className="font-normal text-base">New Order Notifications</Label>
                        <span className="text-sm text-gray-500">
                          Get notified when new orders are placed
                        </span>
                      </div>
                      <Switch 
                        id="newOrderNotifications" 
                        checked={notificationSettings.newOrderNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, newOrderNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="supplierUpdates" className="font-normal text-base">Supplier Updates</Label>
                        <span className="text-sm text-gray-500">
                          Notifications about supplier changes and updates
                        </span>
                      </div>
                      <Switch 
                        id="supplierUpdates" 
                        checked={notificationSettings.supplierUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, supplierUpdates: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="systemNotifications" className="font-normal text-base">System Notifications</Label>
                        <span className="text-sm text-gray-500">
                          Updates about system maintenance and new features
                        </span>
                      </div>
                      <Switch 
                        id="systemNotifications" 
                        checked={notificationSettings.systemNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, systemNotifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Notification Channels</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="emailNotifications" className="font-normal text-base">Email Notifications</Label>
                        <span className="text-sm text-gray-500">
                          Receive notifications via email
                        </span>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailNotifications: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="pushNotifications" className="font-normal text-base">Push Notifications</Label>
                        <span className="text-sm text-gray-500">
                          Receive browser push notifications
                        </span>
                      </div>
                      <Switch 
                        id="pushNotifications" 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, pushNotifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={savingNotifications}>
                    {savingNotifications ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={savingSecurity}>
                    {savingSecurity ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                    Not Enabled
                  </Badge>
                </div>
                
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Sessions</h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">Current Session</h4>
                        <p className="text-xs text-gray-500">Chrome on Windows • New York, USA</p>
                        <p className="text-xs text-gray-500">Started 2 hours ago</p>
                      </div>
                      <Badge variant="secondary" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">Mobile Session</h4>
                        <p className="text-xs text-gray-500">Safari on iPhone • New York, USA</p>
                        <p className="text-xs text-gray-500">Last active 3 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Sign Out All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Current Team Members</h3>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Team members list */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">John Doe</h4>
                          <p className="text-xs text-gray-500">john.doe@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Administrator</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">Jane Wilson</h4>
                          <p className="text-xs text-gray-500">jane@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Inventory Manager</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">Mark Smith</h4>
                          <p className="text-xs text-gray-500">mark@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Warehouse Staff</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline">Download Team CSV</Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete Team
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
