
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ssoLoading, setSsoLoading] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { login, loginWithGoogle, loginWithSSO } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast({
                title: "Error",
                description: "Please enter both email and password.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(email, password);
            
            if (success) {
                toast({
                    title: "Login Successful",
                    description: "Welcome back! Redirecting to your dashboard...",
                });
                router.push('/');
            }
        } catch (error) {
            toast({
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setSsoLoading('google');
        
        try {
            const success = await loginWithGoogle();
            
            if (success) {
                toast({
                    title: "Google Login Successful",
                    description: "Welcome! Redirecting to your dashboard...",
                });
                router.push('/');
            } else {
                toast({
                    title: "Google Login Failed",
                    description: "Unable to sign in with Google. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Google Login Error",
                description: "An error occurred during Google sign-in.",
                variant: "destructive"
            });
        } finally {
            setSsoLoading('');
        }
    };

    const handleSSO = async (provider: string) => {
        setSsoLoading(provider);
        
        try {
            const success = await loginWithSSO(provider);
            
            if (success) {
                toast({
                    title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Successful`,
                    description: "Welcome! Redirecting to your dashboard...",
                });
                router.push('/');
            } else {
                toast({
                    title: "SSO Login Failed",
                    description: `Unable to sign in with ${provider}. Please try again.`,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "SSO Login Error",
                description: "An error occurred during SSO sign-in.",
                variant: "destructive"
            });
        } finally {
            setSsoLoading('');
        }
    };

    const isAnyLoading = isLoading || ssoLoading !== '';

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="h-6 w-6" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path d="M16 8.7a4 4 0 1 0-8 0"></path>
                            <path d="M16 15.3a4 4 0 1 1-8 0"></path>
                            <path d="M4.7 12A8.1 8.1 0 0 0 12 20a8.1 8.1 0 0 0 7.3-8"></path>
                            <path d="M19.3 12A8.1 8.1 0 0 0 12 4a8.1 8.1 0 0 0-7.3 8"></path>
                        </svg>
                        <span className="font-semibold">SMART CONNECTION</span>
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Choose your preferred sign-in method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* SSO Options */}
                    <div className="grid gap-3">
                        <Button 
                            variant="outline" 
                            className="w-full justify-start gap-3" 
                            onClick={handleGoogleLogin} 
                            disabled={isAnyLoading}
                        >
                            {ssoLoading === 'google' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            )}
                            Continue with Google
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            className="w-full justify-start gap-3" 
                            onClick={() => handleSSO('westcliff')} 
                            disabled={isAnyLoading}
                        >
                            {ssoLoading === 'westcliff' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Briefcase className="h-4 w-4" />
                            )}
                            Sign in with Westcliff
                        </Button>

                        <Button 
                            variant="outline" 
                            className="w-full justify-start gap-3" 
                            onClick={() => handleSSO('microsoft')} 
                            disabled={isAnyLoading}
                        >
                            {ssoLoading === 'microsoft' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                                </svg>
                            )}
                            Sign in with Microsoft
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or sign in with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="student@westcliff.edu" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                disabled={isAnyLoading} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password"
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={isAnyLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isAnyLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Mail className="mr-2 h-4 w-4" />
                            )}
                            Sign In with Email
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="flex justify-between w-full text-sm">
                         <Link href="/signup" className="text-primary hover:underline">
                            Create an account
                        </Link>
                        <Link href="/forgot-password" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="text-center text-xs text-muted-foreground space-y-1">
                        <p className="font-semibold">Demo Accounts (any password):</p>
                        <p>🔐 Admin: admin@smartconnection.edu</p>
                        <p>🎓 Student: student@smartconnection.edu</p>
                        <p>🏢 Company: company@smartconnection.edu</p>
                        <p>👨‍🏫 Mentor: mentor@smartconnection.edu</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
