import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

export default function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-muted-foreground">Upload and manage images and files</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Media Assets</span>
          </CardTitle>
          <CardDescription>
            No media assets have been uploaded yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Media Available</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first image or file to get started
          </p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload First File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}