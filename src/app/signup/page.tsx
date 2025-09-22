
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate account creation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Auto-login after successful signup
            const success = await login(formData.email, formData.password);
            
            if (success) {
                toast({
                    title: "Account Created",
                    description: "Welcome to SMART CONNECTION! Your account has been created successfully.",
                });
                router.push('/');
            }
        } catch (error) {
            toast({
                title: "Signup Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                <CardHeader className="text-center pb-0">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="h-7 w-7 text-primary" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path d="M16 8.7a4 4 0 1 0-8 0"></path>
                            <path d="M16 15.3a4 4 0 1 1-8 0"></path>
                            <path d="M4.7 12A8.1 8.1 0 0 0 12 20a8.1 8.1 0 0 0 7.3-8"></path>
                            <path d="M19.3 12A8.1 8.1 0 0 0 12 4a8.1 8.1 0 0 0-7.3 8"></path>
                        </svg>
                        <span className="font-bold text-lg tracking-wide">SMART CONNECTION</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription className="mt-1">Sign up and select your role to access the app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                type="text" 
                                placeholder="John Doe" 
                                required 
                                value={formData.name} 
                                onChange={(e) => handleInputChange('name', e.target.value)} 
                                disabled={isLoading} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="your@email.com" 
                                required 
                                value={formData.email} 
                                onChange={(e) => handleInputChange('email', e.target.value)} 
                                disabled={isLoading} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">🎓 Student</SelectItem>
                                    <SelectItem value="mentor">👨‍🏫 Mentor</SelectItem>
                                    <SelectItem value="company">🏢 Company Representative</SelectItem>
                                    <SelectItem value="admin">🔐 Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Create a strong password"
                                required 
                                value={formData.password} 
                                onChange={(e) => handleInputChange('password', e.target.value)} 
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirm your password"
                                required 
                                value={formData.confirmPassword} 
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-2">
                    <div className="text-center text-sm">
                         <span className="text-muted-foreground">Already have an account? </span>
                         <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                        <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
