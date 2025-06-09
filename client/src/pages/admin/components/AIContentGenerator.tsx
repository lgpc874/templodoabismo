import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, BookOpen, GraduationCap, Scroll, RefreshCw } from "lucide-react";

interface AIContentGeneratorProps {
  onContentGenerated: (content: any, type: string) => void;
}

export default function AIContentGenerator({ onContentGenerated }: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseLevel, setCourseLevel] = useState("1");
  const [courseTopic, setCourseTopic] = useState("");
  const [grimoireTitle, setGrimoireTitle] = useState("");

  const generateCourse = async () => {
    if (!courseTopic) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: parseInt(courseLevel), topic: courseTopic })
      });
      
      if (response.ok) {
        const course = await response.json();
        onContentGenerated(course, 'course');
        setCourseTopic("");
      }
    } catch (error) {
      console.error('Course generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGrimoire = async () => {
    if (!grimoireTitle) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/grimoires/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: grimoireTitle })
      });
      
      if (response.ok) {
        const grimoire = await response.json();
        onContentGenerated(grimoire, 'grimoire');
        setGrimoireTitle("");
      }
    } catch (error) {
      console.error('Grimoire generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDailyPoem = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/daily-poem');
      if (response.ok) {
        const poem = await response.json();
        onContentGenerated(poem, 'poem');
      }
    } catch (error) {
      console.error('Poem generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="abyssal-card">
      <CardHeader>
        <CardTitle className="font-titles text-xl text-red-400 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Gerador de Conteúdo IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course">Cursos</TabsTrigger>
            <TabsTrigger value="grimoire">Grimórios</TabsTrigger>
            <TabsTrigger value="poem">Poemas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="course" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Nível do Curso</Label>
                <Select value={courseLevel} onValueChange={setCourseLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nível 1 - Iniciante</SelectItem>
                    <SelectItem value="2">Nível 2 - Básico</SelectItem>
                    <SelectItem value="3">Nível 3 - Intermediário</SelectItem>
                    <SelectItem value="4">Nível 4 - Avançado</SelectItem>
                    <SelectItem value="5">Nível 5 - Especialista</SelectItem>
                    <SelectItem value="6">Nível 6 - Mestre</SelectItem>
                    <SelectItem value="7">Nível 7 - Magus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Tópico do Curso</Label>
                <Input
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                  placeholder="Ex: Meditação Luciferiana, Filosofia do Abismo..."
                  className="bg-black/50 border-red-800/50 text-white"
                />
              </div>
              <Button 
                onClick={generateCourse}
                disabled={!courseTopic || isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-red-800"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <GraduationCap className="w-4 h-4 mr-2" />
                )}
                Gerar Curso com IA
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="grimoire" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Título do Grimório</Label>
                <Input
                  value={grimoireTitle}
                  onChange={(e) => setGrimoireTitle(e.target.value)}
                  placeholder="Ex: Liber Umbra, Codex Ignis..."
                  className="bg-black/50 border-red-800/50 text-white"
                />
              </div>
              <Button 
                onClick={generateGrimoire}
                disabled={!grimoireTitle || isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-red-800"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BookOpen className="w-4 h-4 mr-2" />
                )}
                Gerar Grimório com IA
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="poem" className="space-y-4">
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Gere um novo poema místico para a seção "Voz da Pluma"
              </p>
              <Button 
                onClick={generateDailyPoem}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-red-800"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Scroll className="w-4 h-4 mr-2" />
                )}
                Gerar Poema Místico com IA
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}