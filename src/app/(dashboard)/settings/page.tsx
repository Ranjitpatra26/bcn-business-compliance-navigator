"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveBusiness } from "@/components/providers/BusinessProvider";
import { useNotificationPreferences } from "@/hooks/useNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Bell, Briefcase, Lock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import { useAuth } from "@/components/providers/AuthProvider";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const { activeBusinessId } = useActiveBusiness();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'business'>('account');
  
  const { data: preferences, updatePreferences, isUpdating } = useNotificationPreferences(activeBusinessId);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Local state for account form
  const [name, setName] = useState(user?.user_metadata?.full_name || "BCN User");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);
  
  // Local state for business form
  const [businessName, setBusinessName] = useState("Acme Corp");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);
  const [businessSuccess, setBusinessSuccess] = useState(false);

  const [prefSuccess, setPrefSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);
    setAccountSuccess(false);
    
    // Mock save logic (ideally update Supabase auth metadata)
    setTimeout(() => {
      setIsSavingAccount(false);
      setAccountSuccess(true);
      setTimeout(() => setAccountSuccess(false), 3000);
    }, 800);
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBusiness(true);
    setBusinessSuccess(false);
    
    // Mock save logic for business profile
    setTimeout(() => {
      setIsSavingBusiness(false);
      setBusinessSuccess(true);
      setTimeout(() => setBusinessSuccess(false), 3000);
    }, 800);
  };

  const handlePreferenceChange = async (key: string, checked: boolean) => {
    if (!preferences || !activeBusinessId) return;
    setPrefSuccess(false);
    
    try {
      await updatePreferences({ ...preferences, [key]: checked });
      setPrefSuccess(true);
      setTimeout(() => setPrefSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update preference", error);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'account' ? "bg-bcn-red/10 text-bcn-red" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" /> Account Details
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'notifications' ? "bg-bcn-red/10 text-bcn-red" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'business' ? "bg-bcn-red/10 text-bcn-red" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Business Profile
          </button>
          
          <div className="pt-4 mt-4 border-t border-muted/50">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> 
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'account' && (
            <>
              <Card className="rounded-2xl shadow-sm border-muted/50 bg-card">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Update your personal information associated with BCN.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveAccount} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="rounded-xl border-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ""} 
                          disabled 
                          className="rounded-xl border-muted/50 bg-muted/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="+1 (555) 000-0000"
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="rounded-xl border-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title / Role</Label>
                        <Input 
                          id="jobTitle" 
                          placeholder="e.g. Compliance Officer"
                          value={jobTitle} 
                          onChange={(e) => setJobTitle(e.target.value)} 
                          className="rounded-xl border-muted/50"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select 
                          id="timezone" 
                          value={timezone} 
                          onChange={(e) => setTimezone(e.target.value)} 
                          className="flex h-10 w-full rounded-xl border border-muted/50 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          <option value="EST">EST (Eastern Standard Time)</option>
                          <option value="PST">PST (Pacific Standard Time)</option>
                          <option value="GMT">GMT (Greenwich Mean Time)</option>
                          <option value="CET">CET (Central European Time)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-[10px] text-muted-foreground mb-4">Email addresses cannot be changed directly. Contact support.</p>
                      <div className="flex items-center gap-4">
                        <Button type="submit" disabled={isSavingAccount || !name.trim()} className="bg-bcn-red text-white hover:bg-bcn-red/90 rounded-xl">
                          {isSavingAccount ? "Saving..." : "Save Changes"}
                        </Button>
                        {accountSuccess && (
                          <span className="text-sm font-medium text-green-600 flex items-center gap-1.5 animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Saved
                          </span>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm border-muted/50 bg-card">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="rounded-xl">
                    <Lock className="w-4 h-4 mr-2" /> Change Password
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card className="rounded-2xl shadow-sm border-muted/50 bg-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what events you want to be notified about.
                  {!activeBusinessId && (
                    <span className="block mt-2 text-bcn-yellow flex items-center gap-1.5 text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" /> Select a business to configure preferences.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Compliance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about regulatory changes affecting you.</p>
                    </div>
                    <Switch 
                      checked={preferences?.complianceAlerts || false} 
                      disabled={!activeBusinessId || isUpdating}
                      onCheckedChange={(c) => handlePreferenceChange("complianceAlerts", c)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Deadline Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get alerted when a filing or renewal is approaching.</p>
                    </div>
                    <Switch 
                      checked={preferences?.deadlineReminders || false} 
                      disabled={!activeBusinessId || isUpdating}
                      onCheckedChange={(c) => handlePreferenceChange("deadlineReminders", c)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Document Updates</Label>
                      <p className="text-sm text-muted-foreground">Notifications when your uploaded documents are verified.</p>
                    </div>
                    <Switch 
                      checked={preferences?.documentUpdates || false} 
                      disabled={!activeBusinessId || isUpdating}
                      onCheckedChange={(c) => handlePreferenceChange("documentUpdates", c)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">System Notifications</Label>
                      <p className="text-sm text-muted-foreground">Platform updates, scheduled maintenance, and feature announcements.</p>
                    </div>
                    <Switch 
                      checked={preferences?.systemNotifications || false} 
                      disabled={!activeBusinessId || isUpdating}
                      onCheckedChange={(c) => handlePreferenceChange("systemNotifications", c)}
                    />
                  </div>
                </div>

                {prefSuccess && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 animate-in fade-in mt-4">
                    <CheckCircle2 className="w-4 h-4" /> Preferences saved
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'business' && (
            <Card className="rounded-2xl shadow-sm border-muted/50 bg-card">
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>Manage your company details, registration, and operating information for compliance purposes.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveBusiness} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessName">Company / Legal Name</Label>
                      <Input 
                        id="businessName" 
                        placeholder="e.g. Acme Corporation" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        className="rounded-xl border-muted/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration / Tax ID</Label>
                      <Input 
                        id="registrationNumber" 
                        placeholder="e.g. EIN or Company Number" 
                        value={registrationNumber} 
                        onChange={(e) => setRegistrationNumber(e.target.value)} 
                        className="rounded-xl border-muted/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <select 
                        id="industry" 
                        value={industry} 
                        onChange={(e) => setIndustry(e.target.value)} 
                        className="flex h-10 w-full rounded-xl border border-muted/50 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select an industry...</option>
                        <option value="technology">Technology & Software</option>
                        <option value="finance">Financial Services</option>
                        <option value="healthcare">Healthcare & Pharmaceuticals</option>
                        <option value="retail">Retail & E-commerce</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">Operating Country / Jurisdiction</Label>
                      <Input 
                        id="country" 
                        placeholder="e.g. United States, United Kingdom" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        className="rounded-xl border-muted/50" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-4">
                    <Button type="submit" disabled={isSavingBusiness || !businessName.trim()} className="bg-bcn-red text-white hover:bg-bcn-red/90 rounded-xl">
                      {isSavingBusiness ? "Saving..." : "Save Business Profile"}
                    </Button>
                    {businessSuccess && (
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" /> Profile Updated
                      </span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
