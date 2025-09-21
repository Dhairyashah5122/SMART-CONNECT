"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            You don't have permission to access the admin area. Admin access required.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
}