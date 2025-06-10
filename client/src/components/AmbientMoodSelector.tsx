import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Moon, 
  Skull, 
  Zap, 
  Eye, 
  Crown,
  Volume2,
  VolumeX,
  Settings
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
    sealOpacity: 0.15,
    audioUrl: '/audio/abyssal-ambience.mp3'
  },
  {
    id: 'infernal',
    name: 'Infernal',
    icon: Flame,
    description: 'Chamas ardentes do inferno',
    bgGradient: 'from-black via-red-950/40 to-orange-950/20',
    particleColor: 'red',
    sealOpacity: 0.25,
    audioUrl: '/audio/infernal-flames.mp3'
  },
  {
    id: 'lunar',
    name: 'Lunar',
    icon: Moon,
    description: 'Mistérios da lua negra',
    bgGradient: 'from-black via-blue-950/30 to-indigo-950/20',
    particleColor: 'blue',
    sealOpacity: 0.10,
    audioUrl: '/audio/lunar-night.mp3'
  },
  {
    id: 'stellar',
    name: 'Estelar',
    icon: Zap,
    description: 'Energias cósmicas ancestrais',
    bgGradient: 'from-black via-violet-950/30 to-purple-950/20',
    particleColor: 'violet',
    sealOpacity: 0.20,
    audioUrl: '/audio/stellar-void.mp3'
  },
  {
    id: 'divine',
    name: 'Divino',
    icon: Crown,
    description: 'Poder supremo luciferiano',
    bgGradient: 'from-black via-amber-950/30 to-yellow-950/20',
    particleColor: 'amber',
    sealOpacity: 0.30,
    audioUrl: '/audio/divine-power.mp3'
  },
  {
    id: 'void',
    name: 'Vazio',
    icon: Eye,
    description: 'Silêncio do vazio primordial',
    bgGradient: 'from-black via-gray-950/20 to-black',
    particleColor: 'gray',
    sealOpacity: 0.05,
    audioUrl: '/audio/void-silence.mp3'
  }
];

interface AmbientMoodSelectorProps {
  onMoodChange?: (mood: MoodOption) => void;
}

export default function AmbientMoodSelector({ onMoodChange }: AmbientMoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption>(moodOptions[0]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.3);

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

  useEffect(() => {
    // Audio functionality disabled for now - would require actual audio files
    // Future implementation would handle ambient soundscapes here
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }, [selectedMood]);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (currentAudio) {
      currentAudio.volume = newVolume;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/80 backdrop-blur-lg border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <selectedMood.icon className="w-4 h-4 mr-2" />
            Ambiente
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 bg-black/95 backdrop-blur-lg border-amber-500/30 text-white">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-cinzel-decorative text-amber-400 mb-1">
                Seletor de Ambiente Místico
              </h3>
              <p className="text-sm text-gray-400">
                Escolha a atmosfera do templo
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  className="text-amber-400 hover:text-amber-300"
                >
                  {isAudioEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                <span className="text-sm text-gray-300">
                  {isAudioEnabled ? 'Áudio Ativo' : 'Áudio Silenciado'}
                </span>
              </div>
              
              {isAudioEnabled && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 gap-3">
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
                    <CardContent className="p-3 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        isSelected ? 'text-amber-400' : 'text-gray-400'
                      }`} />
                      <h4 className={`text-sm font-cinzel font-semibold mb-1 ${
                        isSelected ? 'text-amber-300' : 'text-gray-300'
                      }`}>
                        {mood.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-tight">
                        {mood.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Current Selection Info */}
            <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <selectedMood.icon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-cinzel text-amber-300">
                  {selectedMood.name} Ativo
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {selectedMood.description}
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}