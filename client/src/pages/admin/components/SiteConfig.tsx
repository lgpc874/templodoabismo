import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, RotateCcw } from "lucide-react";

export default function SiteConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: config, isLoading } = useQuery({
    queryKey: ["/api/admin/config"],
  });

  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  // Initialize config values when data loads
  useState(() => {
    if (config) {
      const values: Record<string, any> = {};
      config.forEach((item: any) => {
        values[item.key] = item.value;
      });
      setConfigValues(values);
    }
  }, [config]);

  const updateConfigMutation = useMutation({
    mutationFn: async (data: { key: string; value: any; category: string }) => {
      return apiRequest("POST", "/api/admin/config", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({
        title: "Configuration updated",
        description: "Your changes have been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "There was an error saving your configuration",
        variant: "destructive",
      });
    },
  });

  const handleSave = async () => {
    try {
      const updates = Object.entries(configValues).map(([key, value]) => {
        const category = getCategoryForKey(key);
        return { key, value, category };
      });

      for (const update of updates) {
        await updateConfigMutation.mutateAsync(update);
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
    }
  };

  const handleReset = () => {
    if (config) {
      const values: Record<string, any> = {};
      config.forEach((item: any) => {
        values[item.key] = item.value;
      });
      setConfigValues(values);
      toast({
        title: "Configuration reset",
        description: "All changes have been reverted to saved values",
      });
    }
  };

  const getCategoryForKey = (key: string) => {
    if (key.includes("color")) return "theme";
    if (key.includes("font")) return "typography";
    return "general";
  };

  const updateValue = (key: string, value: any) => {
    setConfigValues(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Site Information */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Configure your site's basic details and metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title</Label>
              <Input
                id="site_title"
                value={configValues.site_title || ""}
                onChange={(e) => updateValue("site_title", e.target.value)}
                placeholder="Enter site title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_tagline">Tagline</Label>
              <Input
                id="site_tagline"
                value={configValues.site_tagline || ""}
                onChange={(e) => updateValue("site_tagline", e.target.value)}
                placeholder="Enter site tagline"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              value={configValues.site_description || ""}
              onChange={(e) => updateValue("site_description", e.target.value)}
              placeholder="Enter site description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Configuration</CardTitle>
          <CardDescription>Customize your site's visual appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={configValues.primary_color || "#3B82F6"}
                  onChange={(e) => updateValue("primary_color", e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={configValues.primary_color || "#3B82F6"}
                  onChange={(e) => updateValue("primary_color", e.target.value)}
                  placeholder="#3B82F6"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={configValues.secondary_color || "#64748B"}
                  onChange={(e) => updateValue("secondary_color", e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={configValues.secondary_color || "#64748B"}
                  onChange={(e) => updateValue("secondary_color", e.target.value)}
                  placeholder="#64748B"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={configValues.accent_color || "#10B981"}
                  onChange={(e) => updateValue("accent_color", e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={configValues.accent_color || "#10B981"}
                  onChange={(e) => updateValue("accent_color", e.target.value)}
                  placeholder="#10B981"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <Label>Color Presets</Label>
            <div className="flex space-x-2">
              {[
                { name: "Blue", primary: "#3B82F6", secondary: "#64748B", accent: "#10B981" },
                { name: "Purple", primary: "#8B5CF6", secondary: "#64748B", accent: "#F59E0B" },
                { name: "Green", primary: "#10B981", secondary: "#64748B", accent: "#EF4444" },
                { name: "Orange", primary: "#F97316", secondary: "#64748B", accent: "#8B5CF6" },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateValue("primary_color", preset.primary);
                    updateValue("secondary_color", preset.secondary);
                    updateValue("accent_color", preset.accent);
                  }}
                  className="flex items-center space-x-2"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span>{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Configure fonts and text styling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heading_font">Heading Font</Label>
              <select
                id="heading_font"
                value={configValues.heading_font || "Inter"}
                onChange={(e) => updateValue("heading_font", e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body_font">Body Font</Label>
              <select
                id="body_font"
                value={configValues.body_font || "Inter"}
                onChange={(e) => updateValue("body_font", e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>

          {/* Typography Preview */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Typography Preview</h4>
            <div 
              style={{ 
                fontFamily: configValues.heading_font || "Inter",
                color: configValues.primary_color || "#3B82F6"
              }}
            >
              <h1 className="text-2xl font-bold mb-2">This is a heading</h1>
            </div>
            <div style={{ fontFamily: configValues.body_font || "Inter" }}>
              <p className="text-base text-slate-600">
                This is body text. The quick brown fox jumps over the lazy dog. 
                This preview shows how your selected fonts will look on the website.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Changes
        </Button>
        <Button onClick={handleSave} disabled={updateConfigMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateConfigMutation.isPending ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}
