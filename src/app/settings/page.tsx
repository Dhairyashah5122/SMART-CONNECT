
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Check, Bell, Palette, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User /> Profile Settings</CardTitle>
          <CardDescription>This information is visible on your public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue="Admin User" />
          </div>
           <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@synergyscope.com" disabled />
          </div>
           <div className="flex justify-end">
              <Button>Save Profile</Button>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell /> Notification Settings</CardTitle>
          <CardDescription>Choose how you want to be notified about platform activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new messages, project updates, and reminders.</p>
                </div>
                <Switch id="email-notifications" defaultChecked/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get push notifications on your devices for real-time updates.</p>
                </div>
                <Switch id="push-notifications"/>
            </div>
             <div className="flex justify-end">
                <Button>Save Notifications</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette /> Theme Settings</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Appearance</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline"><div className="w-4 h-4 rounded-full bg-zinc-100 border mr-2"/> Light</Button>
                  <Button variant="secondary"><div className="w-4 h-4 rounded-full bg-zinc-800 border mr-2"/> Dark</Button>
                  <Button variant="outline"><div className="w-4 h-4 rounded-full bg-zinc-500 border mr-2"/> System</Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
          <CardHeader>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
              <CardDescription>Permanently remove your account and all of its content. This action is not reversible and cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
                <Button variant="destructive">Delete My Account</Button>
          </CardContent>
      </Card>
    </div>
  );
}
