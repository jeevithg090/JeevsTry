"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Settings as SettingsIcon, 
  Key, 
  Smartphone, 
  Globe,
  Mail,
  Briefcase,
  Calendar,
  Camera,
  UploadCloud,
  MessageCircle
} from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useSettings } from "@/lib/settings-context"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"

export default function SettingsPage() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const { sidebarPosition, setSidebarPosition, fontSize, setFontSize } = useSettings()
  const searchParams = useSearchParams()
  
  // Get the initial tab from URL parameters or default to 'profile'
  const initialTab = searchParams.get('tab') || 'profile'

  // Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Experienced tech professional with a passion for innovation and collaboration.",
    company: user?.company || "",
    location: "San Francisco, CA",
    website: "https://myportfolio.dev"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    browser: false,
    eventReminders: true,
    messageNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    communityUpdates: true
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update logic
    // This would update the user profile in a real application
  }

  const updateSidebarPosition = (position: "left" | "right") => {
    setSidebarPosition(position)
  }

  const updateFontSize = (size: "small" | "default" | "large") => {
    setFontSize(size)
  }

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notificationSettings]
    }))
  }
  


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and public details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-28 w-28">
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt="Profile picture" />
                      <AvatarFallback>
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="outline" className="flex gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Change</span>
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="flex gap-2">
                        <UploadCloud className="h-4 w-4" />
                        <span>Upload</span>
                      </Button>
                    </div>
                    <Badge variant="secondary">
                      {user?.role || "User"}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileForm.name} 
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input 
                          id="company" 
                          value={profileForm.company} 
                          onChange={(e) => setProfileForm({...profileForm, company: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={profileForm.location} 
                          onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          value={profileForm.website} 
                          onChange={(e) => setProfileForm({...profileForm, website: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profileForm.bio} 
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} 
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>
                Control what information is visible on your public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to potential collaborators and employers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see and contact you via email
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Projects</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your projects and contributions on your profile
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an additional security layer
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Authenticator App</h3>
                    <p className="text-xs text-muted-foreground">
                      Use an authenticator app to get verification codes
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">Set up</Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Security Keys</h3>
                    <p className="text-xs text-muted-foreground">
                      Use security keys like YubiKey for authentication
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">Set up</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage accounts connected to your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-[#2563EB]/10">
                    <svg className="h-5 w-5 text-[#2563EB]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.51 0-9.98 4.47-9.98 9.98c0 1.77.46 3.5 1.33 5.03L2 22l5.09-1.33c1.45.79 3.09 1.21 4.76 1.21c5.51 0 9.98-4.47 9.98-9.98c0-2.71-1.06-5.29-2.78-7.01zm-7.01 15.24c-1.45 0-2.89-.35-4.18-1.03l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.53.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.87.85-.87 2.07c0 1.22.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">GitHub</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect your GitHub account to share repositories
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-[#0077B5]/10">
                    <svg className="h-5 w-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 17H6.5v-7H9v7zM7.5 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM18 17h-2.5v-4c0-1.1-.9-2-2-2h-.5v6H10v-7h2.5v1.1c.5-.7 1.8-1.1 2.5-1.1 1.9 0 3 1.7 3 3.5v3.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">LinkedIn</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect your LinkedIn profile for enhanced networking
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive border-dashed">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                These actions are irreversible and can lead to permanent data loss
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Deactivate Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable your account. You can reactivate at any time.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive border-destructive">
                  Deactivate
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove your account and all data associated with it.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label className="text-sm font-medium">Email Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleNotificationToggle('email')} 
                      />
                      <span className="text-sm text-muted-foreground">
                        {notificationSettings.email ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label className="text-sm font-medium">Push Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={notificationSettings.push}
                        onCheckedChange={() => handleNotificationToggle('push')}
                      />
                      <span className="text-sm text-muted-foreground">
                        {notificationSettings.push ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <Label className="text-sm font-medium">Browser Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={notificationSettings.browser}
                        onCheckedChange={() => handleNotificationToggle('browser')}
                      />
                      <span className="text-sm text-muted-foreground">
                        {notificationSettings.browser ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Control which types of notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <Label className="text-base">Event Reminders</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about upcoming events and deadlines
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.eventReminders}
                  onCheckedChange={() => handleNotificationToggle('eventReminders')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <Label className="text-base">Messages</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive a new message
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.messageNotifications}
                  onCheckedChange={() => handleNotificationToggle('messageNotifications')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <Label className="text-base">Project Updates</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about projects you're involved in
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.projectUpdates}
                  onCheckedChange={() => handleNotificationToggle('projectUpdates')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label className="text-base">Community Updates</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about community events and announcements
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.communityUpdates}
                  onCheckedChange={() => handleNotificationToggle('communityUpdates')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label className="text-base">Marketing Emails</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional offers and updates from our partners
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription plan and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Free Plan</h3>
                    <p className="text-sm text-muted-foreground">Basic features for getting started</p>
                  </div>
                  <Badge>Current Plan</Badge>
                </div>
                <ul className="space-y-1 text-sm mt-4">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access to community discussions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Participate in up to 3 events per month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic profile customization
                  </li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button>Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Add Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      Add a credit card or other payment method
                    </p>
                  </div>
                </div>
                <Button variant="outline">Add Method</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No billing history available</p>
                <p className="text-sm">Your billing history will appear here once you upgrade to a paid plan</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-md overflow-hidden cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="bg-white p-2 text-center text-black border-b">
                      <p className="text-xs font-medium">Light</p>
                    </div>
                    <div className="h-20 bg-white p-2">
                      <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-md overflow-hidden cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="bg-gray-900 p-2 text-center text-white border-b border-gray-700">
                      <p className="text-xs font-medium">Dark</p>
                    </div>
                    <div className="h-20 bg-gray-900 p-2">
                      <div className="h-2 w-3/4 bg-gray-700 rounded mb-1"></div>
                      <div className="h-2 w-1/2 bg-gray-700 rounded mb-1"></div>
                      <div className="h-2 w-5/6 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-md overflow-hidden cursor-pointer transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="bg-gradient-to-r from-white to-gray-900 p-2 text-center border-b">
                      <p className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-black to-white">System</p>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-white to-gray-900 p-2">
                      <div className="h-2 w-3/4 bg-gradient-to-r from-gray-200 to-gray-700 rounded mb-1"></div>
                      <div className="h-2 w-1/2 bg-gradient-to-r from-gray-200 to-gray-700 rounded mb-1"></div>
                      <div className="h-2 w-5/6 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base">Sidebar Position</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-md p-4 flex items-center space-x-4 cursor-pointer transition-all ${sidebarPosition === 'left' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => updateSidebarPosition('left')}
                  >
                    <div className="w-16 h-12 border rounded-md overflow-hidden flex">
                      <div className="w-3 bg-primary"></div>
                      <div className="flex-1 bg-background"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Left</p>
                      <p className="text-xs text-muted-foreground">Sidebar on the left side</p>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-md p-4 flex items-center space-x-4 cursor-pointer transition-all ${sidebarPosition === 'right' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => updateSidebarPosition('right')}
                  >
                    <div className="w-16 h-12 border rounded-md overflow-hidden flex">
                      <div className="flex-1 bg-background"></div>
                      <div className="w-3 bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Right</p>
                      <p className="text-xs text-muted-foreground">Sidebar on the right side</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base">Font Size</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    className={`border rounded-md h-9 text-xs font-medium transition-all ${fontSize === 'small' ? 'ring-2 ring-primary bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setFontSize('small')}
                    aria-pressed={fontSize === 'small'}
                  >
                    Small
                  </button>
                  <button
                    type="button"
                    className={`border rounded-md h-9 text-sm font-medium transition-all ${fontSize === 'default' ? 'ring-2 ring-primary bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setFontSize('default')}
                    aria-pressed={fontSize === 'default'}
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    className={`border rounded-md h-9 font-medium transition-all ${fontSize === 'large' ? 'ring-2 ring-primary bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setFontSize('large')}
                    aria-pressed={fontSize === 'large'}
                  >
                    Large
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                Configure accessibility settings for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations throughout the interface
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast between elements
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
