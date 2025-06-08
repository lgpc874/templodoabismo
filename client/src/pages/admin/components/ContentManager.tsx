import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function ContentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("homepage");
  const [editingSection, setEditingSection] = useState<number | null>(null);

  const { data: sections, isLoading } = useQuery({
    queryKey: ["/api/admin/content/sections", selectedPage],
  });

  const createSectionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/content/sections", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/sections"] });
      toast({
        title: "Section created",
        description: "New content section has been added",
      });
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/admin/content/sections/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/sections"] });
      setEditingSection(null);
      toast({
        title: "Section updated",
        description: "Content section has been saved",
      });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/content/sections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/sections"] });
      toast({
        title: "Section deleted",
        description: "Content section has been removed",
      });
    },
  });

  const addNewSection = () => {
    const newSection = {
      pageId: selectedPage,
      sectionType: "text",
      title: "New Section",
      content: {
        text: "Enter your content here...",
      },
      order: sections ? sections.length : 0,
      isEnabled: true,
    };

    createSectionMutation.mutate(newSection);
  };

  const handleSectionUpdate = (section: any, updates: any) => {
    updateSectionMutation.mutate({
      id: section.id,
      data: { ...section, ...updates },
    });
  };

  const toggleSectionVisibility = (section: any) => {
    handleSectionUpdate(section, { isEnabled: !section.isEnabled });
  };

  const SectionEditor = ({ section }: { section: any }) => {
    const [localContent, setLocalContent] = useState(section.content);
    const [title, setTitle] = useState(section.title || "");

    const handleSave = () => {
      handleSectionUpdate(section, {
        title,
        content: localContent,
      });
    };

    return (
      <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor={`title-${section.id}`}>Section Title</Label>
          <Input
            id={`title-${section.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter section title"
          />
        </div>

        {section.sectionType === "hero" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={localContent.headline || ""}
                onChange={(e) => setLocalContent((prev: any) => ({ ...prev, headline: e.target.value }))}
                placeholder="Enter headline"
              />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Input
                value={localContent.subheadline || ""}
                onChange={(e) => setLocalContent((prev: any) => ({ ...prev, subheadline: e.target.value }))}
                placeholder="Enter subheadline"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={localContent.description || ""}
                onChange={(e) => setLocalContent((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                  value={localContent.ctaText || ""}
                  onChange={(e) => setLocalContent((prev: any) => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="Button text"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Button Link</Label>
                <Input
                  value={localContent.ctaLink || ""}
                  onChange={(e) => setLocalContent((prev: any) => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="Button link"
                />
              </div>
            </div>
          </div>
        )}

        {section.sectionType === "text" && (
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={localContent.text || ""}
              onChange={(e) => setLocalContent((prev: any) => ({ ...prev, text: e.target.value }))}
              placeholder="Enter content"
              rows={6}
            />
          </div>
        )}

        {section.sectionType === "features" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={localContent.title || ""}
                onChange={(e) => setLocalContent((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="Features section title"
              />
            </div>
            <div className="space-y-2">
              <Label>Features (JSON)</Label>
              <Textarea
                value={JSON.stringify(localContent.features || [], null, 2)}
                onChange={(e) => {
                  try {
                    const features = JSON.parse(e.target.value);
                    setLocalContent((prev: any) => ({ ...prev, features }));
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder="Enter features as JSON array"
                rows={8}
                className="font-mono"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setEditingSection(null)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Edit and organize your site content</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="homepage">Homepage</option>
                <option value="about">About</option>
                <option value="services">Services</option>
                <option value="contact">Contact</option>
              </select>
              <Button onClick={addNewSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections && sections.length > 0 ? (
          sections.map((section: any) => (
            <Card key={section.id} className={!section.isEnabled ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                    <div>
                      <CardTitle className="text-lg">{section.title || `${section.sectionType} Section`}</CardTitle>
                      <CardDescription>
                        Type: {section.sectionType} • Order: {section.order}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionVisibility(section)}
                    >
                      {section.isEnabled ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSectionMutation.mutate(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <SectionEditor section={section} />
                ) : (
                  <div className="space-y-2">
                    {section.sectionType === "hero" && (
                      <div>
                        <p className="font-medium">{section.content.headline}</p>
                        <p className="text-sm text-muted-foreground">{section.content.subheadline}</p>
                        <p className="text-sm text-slate-600 mt-2">{section.content.description}</p>
                      </div>
                    )}
                    {section.sectionType === "text" && (
                      <p className="text-sm text-slate-600">{section.content.text}</p>
                    )}
                    {section.sectionType === "features" && (
                      <div>
                        <p className="font-medium">{section.content.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {section.content.features?.length || 0} features configured
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No content sections found for this page</p>
              <Button onClick={addNewSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
