"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processStudentExcel } from "@/ai/flows/process-student-excel";

export function BulkStudentUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setFile(selectedFile);
        } else {
            setFile(null);
            toast({
                variant: "destructive",
                title: "Invalid File Type",
                description: "Please upload a valid .xlsx Excel file.",
            });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({
                variant: "destructive",
                title: "No File Selected",
                description: "Please select an Excel file to upload.",
            });
            return;
        }

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const result = await processStudentExcel({ excelDataUri: base64String });

                toast({
                    title: "Upload Successful",
                    description: `${result.students.length} students are being processed.`,
                });
                
                // You can then use the result to update your student list
                console.log("Processed students:", result.students);

                // Reset file input
                setFile(null);
                // This is a common way to clear file input value
                const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
                if(fileInput) fileInput.value = "";

            };
        } catch (error) {
            console.error("Error processing Excel file:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "There was an error processing your file. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="excel-upload">Excel File</Label>
                <Input id="excel-upload" type="file" onChange={handleFileChange} accept=".xlsx" />
            </div>
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Upload and Process
            </Button>
        </div>
    );
}
