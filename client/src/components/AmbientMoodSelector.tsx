import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Moon, 
  Skull, 
  Zap, 
  Eye, 
  Crown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MoodOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  bgGradient: string;
  particleColor: string;
  sealOpacity: number;
  audioUrl?: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'abyssal',
    name: 'Abissal',
    icon: Skull,
    description: 'Trevas profundas do abismo',
    bgGradient: 'from-black via-purple-950/30 to-black',
    particleColor: 'purple',
    sealOpacity: 0.15
  },
  {
    id: 'infernal',
    name: 'Infernal',
    icon: Flame,
    description: 'Chamas ardentes do inferno',
    bgGradient: 'from-black via-red-950/40 to-orange-950/20',
    particleColor: 'red',
    sealOpacity: 0.25
  },
  {
    id: 'lunar',
    name: 'Lunar',
    icon: Moon,
    description: 'Mistérios da lua negra',
    bgGradient: 'from-black via-blue-950/30 to-indigo-950/20',
    particleColor: 'blue',
    sealOpacity: 0.10
  },
  {
    id: 'stellar',
    name: 'Estelar',
    icon: Zap,
    description: 'Energias cósmicas ancestrais',
    bgGradient: 'from-black via-violet-950/30 to-purple-950/20',
    particleColor: 'violet',
    sealOpacity: 0.20
  },
  {
    id: 'divine',
    name: 'Divino',
    icon: Crown,
    description: 'Poder supremo luciferiano',
    bgGradient: 'from-black via-amber-950/30 to-yellow-950/20',
    particleColor: 'amber',
    sealOpacity: 0.30
  },
  {
    id: 'void',
    name: 'Vazio',
    icon: Eye,
    description: 'Silêncio do vazio primordial',
    bgGradient: 'from-black via-gray-950/20 to-black',
    particleColor: 'gray',
    sealOpacity: 0.05
  }
];

interface AmbientMoodSelectorProps {
  onMoodChange?: (mood: MoodOption) => void;
}

export default function AmbientMoodSelector({ onMoodChange }: AmbientMoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption>(moodOptions[0]);

  useEffect(() => {
    // Apply mood to the document body
    document.body.className = `mood-${selectedMood.id}`;
    
    // Update CSS custom properties for dynamic styling
    document.documentElement.style.setProperty('--mood-gradient', selectedMood.bgGradient);
    document.documentElement.style.setProperty('--mood-particle-color', selectedMood.particleColor);
    document.documentElement.style.setProperty('--mood-seal-opacity', selectedMood.sealOpacity.toString());
    
    // Notify parent component
    onMoodChange?.(selectedMood);
  }, [selectedMood, onMoodChange]);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  return (
    <div className="fixed top-20 left-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/90 backdrop-blur-lg border-amber-500/30 text-amber-300 hover:bg-amber-500/10 px-3 py-2 text-xs md:text-sm"
          >
            <selectedMood.icon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Ambiente</span>
            <span className="sm:hidden">Amb</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-64 sm:w-72 md:w-80 bg-black/95 backdrop-blur-lg border-amber-500/30 text-white" 
          side="right" 
          align="start"
          sideOffset={8}
          alignOffset={-4}
          avoidCollisions={true}
          collisionBoundary={document?.documentElement}
        >
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-sm md:text-lg font-cinzel-decorative text-amber-400 mb-1">
                Ambiente Místico
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                Escolha a atmosfera
              </p>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood.id === mood.id;
                
                return (
                  <Card
                    key={mood.id}
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-gray-700 bg-gray-900/50 hover:border-amber-500/50 hover:bg-amber-500/5'
                    }`}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <CardContent className="p-2 md:p-3 text-center">
                      <Icon className={`w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 ${
                        isSelected ? 'text-amber-400' : 'text-gray-400'
                      }`} />
                      <h4 className={`text-xs md:text-sm font-cinzel font-semibold mb-1 ${
                        isSelected ? 'text-amber-300' : 'text-gray-300'
                      }`}>
                        {mood.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-tight hidden md:block">
                        {mood.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Current Selection Info */}
            <div className="text-center p-2 md:p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-1">
                <selectedMood.icon className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                <span className="text-xs md:text-sm font-cinzel text-amber-300">
                  {selectedMood.name} Ativo
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden md:block">
                {selectedMood.description}
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}