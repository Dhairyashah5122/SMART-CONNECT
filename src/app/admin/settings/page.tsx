
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, KeyRound, Save, Database } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SystemSettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Manage platform-wide configurations and integrations.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Enable or disable major features across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="enable-talent-matching" className="text-base">AI Talent Matching</Label>
                        <p className="text-sm text-muted-foreground">Allow admins to use the AI-powered team builder.</p>
                    </div>
                    <Switch id="enable-talent-matching" defaultChecked/>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="enable-public-showcase" className="text-base">Public Showcase</Label>
                        <p className="text-sm text-muted-foreground">Make the "Showcase" page visible to non-logged-in users.</p>
                    </div>
                    <Switch id="enable-public-showcase" />
                </div>
                <div className="flex justify-end">
                    <Button><Save className="mr-2"/>Save Feature Flags</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound /> API Keys & Integrations</CardTitle>
                <CardDescription>Manage third-party service API keys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                    <Input id="openai-api-key" type="password" placeholder="••••••••••••••••••••••••••••" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="google-maps-api-key">Google Maps API Key</Label>
                    <Input id="google-maps-api-key" type="password" placeholder="••••••••••••••••••••••••••••" />
                </div>
                 <div className="flex justify-end">
                    <Button>Save API Keys</Button>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Database Integration</CardTitle>
                <CardDescription>Configure the connection to your application's database.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <Label>Database Type</Label>
                    <RadioGroup defaultValue="firestore" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="firestore" id="db-firestore" />
                            <Label htmlFor="db-firestore" className="font-normal">Firebase Firestore</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local" id="db-local" />
                            <Label htmlFor="db-local" className="font-normal">Local SQLite</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cloudsql" id="db-cloudsql" />
                            <Label htmlFor="db-cloudsql" className="font-normal">Cloud SQL</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="db-connection-string">Connection String</Label>
                    <Input id="db-connection-string" type="password" placeholder="Enter your database connection string" />
                </div>
                 <div className="flex justify-end">
                    <Button>Save Database Settings</Button>
                 </div>
            </CardContent>
        </Card>
        
    </div>
  );
}
