import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NdaPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>NDA Agreement</CardTitle>
                    <CardDescription>Review and sign the Non-Disclosure Agreement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input id="project-name" placeholder="Enter project name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="agreement-text">Text.act</Label>
                        <Textarea 
                            id="agreement-text"
                            readOnly
                            rows={8}
                            value="Lorem ipsum dolor sit amet, consectedur adipiscing elit, Noignu, num trond eosour introload, nav, ote er ov wonngla; amiet unet nonaste aloneit: suc stuat amet velit. Dover atiquam...."
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="agreement" />
                        <Label htmlFor="agreement" className="text-sm font-normal">
                            I agree to the Non Disclosure Agreement
                        </Label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Submit</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
