
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your photo and personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" data-ai-hint="person" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <Label htmlFor="avatar-file">Profile Photo</Label>
                        <Input id="avatar-file" type="file" />
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="admin@synergyscope.com" disabled />
                    </div>
                </div>
                 <Button>Update Profile</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>For your security, we recommend using a strong password that you haven't used elsewhere.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" />
                    </div>
                </div>
                 <Button>Change Password</Button>
            </CardContent>
        </Card>
        
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Delete Account</CardTitle>
                <CardDescription>Permanently remove your account and all of its content from the platform. This action is not reversible.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button variant="destructive">Delete My Account</Button>
            </CardContent>
        </Card>
    </div>
  );
}
