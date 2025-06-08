import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Monitor, Tablet, Smartphone, Palette } from "lucide-react";

export default function DesignEditor() {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [designValues, setDesignValues] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#64748B",
    accentColor: "#10B981",
    headingFont: "Inter",
    bodyFont: "Inter",
    borderRadius: 8,
    shadowLevel: "medium",
    containerWidth: "1200px",
    animations: true,
    darkMode: false,
  });

  const updateDesignValue = (key: string, value: any) => {
    setDesignValues(prev => ({ ...prev, [key]: value }));
  };

  const colorPresets = [
    { name: "Blue", colors: { primary: "#3B82F6", secondary: "#64748B", accent: "#10B981" } },
    { name: "Purple", colors: { primary: "#8B5CF6", secondary: "#64748B", accent: "#F59E0B" } },
    { name: "Green", colors: { primary: "#10B981", secondary: "#64748B", accent: "#EF4444" } },
    { name: "Orange", colors: { primary: "#F97316", secondary: "#64748B", accent: "#8B5CF6" } },
  ];

  const shadowLevels = [
    { id: "none", name: "None", class: "shadow-none" },
    { id: "small", name: "Small", class: "shadow-sm" },
    { id: "medium", name: "Medium", class: "shadow-md" },
    { id: "large", name: "Large", class: "shadow-lg" },
  ];

  const PreviewContent = () => (
    <div 
      className={`h-full bg-white overflow-y-auto transition-all duration-300 ${
        previewDevice === "mobile" 
          ? "max-w-sm mx-auto" 
          : previewDevice === "tablet" 
          ? "max-w-2xl mx-auto" 
          : "w-full"
      }`}
      style={{ 
        transform: previewDevice === "mobile" ? "scale(0.8)" : previewDevice === "tablet" ? "scale(0.9)" : "scale(1)",
        transformOrigin: "top center"
      }}
    >
      {/* Mock Website Preview */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded"
              style={{ 
                backgroundColor: designValues.primaryColor,
                borderRadius: `${designValues.borderRadius}px`
              }}
            />
            <span 
              className="text-lg font-semibold"
              style={{ 
                fontFamily: designValues.headingFont,
                color: designValues.primaryColor 
              }}
            >
              Brand Name
            </span>
          </div>
          <div className="flex space-x-4">
            <span className="text-sm text-gray-600" style={{ fontFamily: designValues.bodyFont }}>
              Home
            </span>
            <span className="text-sm text-gray-600" style={{ fontFamily: designValues.bodyFont }}>
              About
            </span>
            <span className="text-sm text-gray-600" style={{ fontFamily: designValues.bodyFont }}>
              Services
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ 
              fontFamily: designValues.headingFont,
              color: designValues.primaryColor
            }}
          >
            Welcome to Our Platform
          </h1>
          <p 
            className="text-lg text-gray-600 mb-6"
            style={{ fontFamily: designValues.bodyFont }}
          >
            Creating beautiful experiences with powerful technology
          </p>
          <button 
            className={`px-6 py-3 text-white font-medium transition-all ${
              designValues.animations ? "hover:scale-105" : ""
            }`}
            style={{ 
              backgroundColor: designValues.primaryColor,
              borderRadius: `${designValues.borderRadius}px`,
              fontFamily: designValues.bodyFont
            }}
          >
            Get Started
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`p-4 border rounded transition-all ${
                designValues.animations ? "hover:shadow-lg" : ""
              } ${shadowLevels.find(s => s.id === designValues.shadowLevel)?.class}`}
              style={{ borderRadius: `${designValues.borderRadius}px` }}
            >
              <div 
                className="w-8 h-8 rounded mb-3"
                style={{ 
                  backgroundColor: designValues.accentColor,
                  borderRadius: `${designValues.borderRadius / 2}px`
                }}
              />
              <h3 
                className="font-medium mb-2"
                style={{ 
                  fontFamily: designValues.headingFont,
                  color: designValues.primaryColor
                }}
              >
                Feature {i}
              </h3>
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: designValues.bodyFont }}
              >
                Description of feature
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Design Controls */}
      <div className="lg:col-span-1 space-y-6">
        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Color Scheme</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Primary Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={designValues.primaryColor}
                    onChange={(e) => updateDesignValue("primaryColor", e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={designValues.primaryColor}
                    onChange={(e) => updateDesignValue("primaryColor", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Secondary Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={designValues.secondaryColor}
                    onChange={(e) => updateDesignValue("secondaryColor", e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={designValues.secondaryColor}
                    onChange={(e) => updateDesignValue("secondaryColor", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Accent Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={designValues.accentColor}
                    onChange={(e) => updateDesignValue("accentColor", e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={designValues.accentColor}
                    onChange={(e) => updateDesignValue("accentColor", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Color Presets</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateDesignValue("primaryColor", preset.colors.primary);
                      updateDesignValue("secondaryColor", preset.colors.secondary);
                      updateDesignValue("accentColor", preset.colors.accent);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Heading Font</Label>
              <select
                value={designValues.headingFont}
                onChange={(e) => updateDesignValue("headingFont", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Body Font</Label>
              <select
                value={designValues.bodyFont}
                onChange={(e) => updateDesignValue("bodyFont", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Source Sans Pro">Source Sans Pro</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Border Radius</Label>
              <div className="mt-2">
                <Slider
                  value={[designValues.borderRadius]}
                  onValueChange={([value]) => updateDesignValue("borderRadius", value)}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {designValues.borderRadius}px
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Shadow Level</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {shadowLevels.map((level) => (
                  <Button
                    key={level.id}
                    variant={designValues.shadowLevel === level.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateDesignValue("shadowLevel", level.id)}
                  >
                    {level.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable Animations</Label>
              <Switch
                checked={designValues.animations}
                onCheckedChange={(checked) => updateDesignValue("animations", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Preview</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="border border-slate-200 rounded-lg m-6 h-96 overflow-hidden">
              <PreviewContent />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
