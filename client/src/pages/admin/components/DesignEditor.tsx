import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function DesignEditor() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Design Editor</span>
          </CardTitle>
          <CardDescription>
            Customize the visual appearance of your site
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Design Editor Coming Soon</h3>
          <p className="text-muted-foreground">
            Visual theme customization tools will be available here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}