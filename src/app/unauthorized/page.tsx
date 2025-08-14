
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-3xl mt-4">Access Denied</CardTitle>
                    <CardDescription>You do not have permission to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>
                        If you believe you should have access, please contact your system administrator.
                    </p>
                </CardContent>
                <CardContent>
                     <Button asChild>
                        <Link href="/">Return to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
