import React, { useState, useEffect } from 'react';
import { MapPin, Cloud, Sun, CloudRain, Snowflake, Thermometer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Biome, BiomeWeather } from '@/types/gameTypes';
import { toast } from 'sonner';

interface BiomesPanelProps {
  playerProfile: any;
  updatePlayerProfile: (updates: any) => void;
}

const biomes: Biome[] = [
  {
    id: 'forest',
    name: 'Whispering Forest',
    color: 'green',
    monsters: [] // Simplified for this component
  },
  {
    id: 'tundra',
    name: 'Frozen Tundra',
    color: 'blue',
    monsters: []
  },
  {
    id: 'swamp',
    name: 'Misty Swamp',
    color: 'purple',
    monsters: []
  },
  {
    id: 'desert',
    name: 'Scorching Desert',
    color: 'yellow',
    monsters: []
  },
  {
    id: 'mountains',
    name: 'Ancient Peaks',
    color: 'gray',
    monsters: []
  },
  {
    id: 'volcano',
    name: 'Molten Caverns',
    color: 'red',
    monsters: []
  }
];

const weatherTypes: BiomeWeather[] = [
  {
    type: 'clear',
    name: 'Clear Skies',
    effects: {},
    duration: 300,
    rarity: 0.4
  },
  {
    type: 'rain',
    name: 'Light Rain',
    effects: {
      huntTimeModifier: 1.1,
      lootModifier: 1.2,
      encounterRateModifier: 0.9
    },
    duration: 180,
    rarity: 0.25
  },
  {
    type: 'storm',
    name: 'Thunderstorm',
    effects: {
      huntTimeModifier: 1.3,
      lootModifier: 1.5,
      encounterRateModifier: 0.7,
      staminaCostModifier: 1.2
    },
    duration: 120,
    rarity: 0.1
  },
  {
    type: 'fog',
    name: 'Dense Fog',
    effects: {
      huntTimeModifier: 1.2,
      encounterRateModifier: 1.3,
      lootModifier: 0.9
    },
    duration: 200,
    rarity: 0.15
  },
  {
    type: 'snow',
    name: 'Heavy Snow',
    effects: {
      huntTimeModifier: 1.4,
      staminaCostModifier: 1.3,
      lootModifier: 1.1
    },
    duration: 240,
    rarity: 0.08
  },
  {
    type: 'heat_wave',
    name: 'Heat Wave',
    effects: {
      huntTimeModifier: 0.9,
      staminaCostModifier: 1.5,
      encounterRateModifier: 1.2
    },
    duration: 150,
    rarity: 0.12
  }
];

export const BiomesPanel: React.FC<BiomesPanelProps> = ({
  playerProfile,
  updatePlayerProfile
}) => {
  const [currentWeather, setCurrentWeather] = useState<{ [biomeId: string]: BiomeWeather }>({});
  const [weatherTimers, setWeatherTimers] = useState<{ [biomeId: string]: number }>({});
  const [explorationProgress, setExplorationProgress] = useState<{ [biomeId: string]: number }>({});

  useEffect(() => {
    // Initialize weather for all biomes
    const initialWeather: { [biomeId: string]: BiomeWeather } = {};
    const initialTimers: { [biomeId: string]: number } = {};
    
    biomes.forEach(biome => {
      const weather = getRandomWeather();
      initialWeather[biome.id] = weather;
      initialTimers[biome.id] = weather.duration;
    });
    
    setCurrentWeather(initialWeather);
    setWeatherTimers(initialTimers);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherTimers(prev => {
        const newTimers = { ...prev };
        const newWeather = { ...currentWeather };
        
        Object.keys(newTimers).forEach(biomeId => {
          newTimers[biomeId] -= 1;
          
          if (newTimers[biomeId] <= 0) {
            const weather = getRandomWeather();
            newWeather[biomeId] = weather;
            newTimers[biomeId] = weather.duration;
          }
        });
        
        setCurrentWeather(newWeather);
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWeather]);

  const getRandomWeather = (): BiomeWeather => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const weather of weatherTypes) {
      cumulative += weather.rarity;
      if (random <= cumulative) {
        return weather;
      }
    }
    
    return weatherTypes[0]; // Default to clear
  };

  const getWeatherIcon = (weather: BiomeWeather) => {
    switch (weather.type) {
      case 'clear': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'rain': return <CloudRain className="h-4 w-4 text-blue-400" />;
      case 'storm': return <Cloud className="h-4 w-4 text-purple-400" />;
      case 'fog': return <Cloud className="h-4 w-4 text-gray-400" />;
      case 'snow': return <Snowflake className="h-4 w-4 text-blue-200" />;
      case 'heat_wave': return <Thermometer className="h-4 w-4 text-red-400" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getBiomeIcon = (biome: Biome) => {
    switch (biome.id) {
      case 'forest': return '🌲';
      case 'tundra': return '🏔️';
      case 'swamp': return '🌿';
      case 'desert': return '🏜️';
      case 'mountains': return '⛰️';
      case 'volcano': return '🌋';
      default: return '🗺️';
    }
  };

  const getBiomeColor = (biome: Biome) => {
    switch (biome.color) {
      case 'green': return 'border-green-500/30 from-green-950/20 to-green-900/10 text-green-300';
      case 'blue': return 'border-blue-500/30 from-blue-950/20 to-blue-900/10 text-blue-300';
      case 'purple': return 'border-purple-500/30 from-purple-950/20 to-purple-900/10 text-purple-300';
      case 'yellow': return 'border-yellow-500/30 from-yellow-950/20 to-yellow-900/10 text-yellow-300';
      case 'gray': return 'border-gray-500/30 from-gray-950/20 to-gray-900/10 text-gray-300';
      case 'red': return 'border-red-500/30 from-red-950/20 to-red-900/10 text-red-300';
      default: return 'border-gray-500/30 from-gray-950/20 to-gray-900/10 text-gray-300';
    }
  };

  const exploreArea = (biome: Biome) => {
    const currentProgress = explorationProgress[biome.id] || 0;
    if (currentProgress >= 100) {
      toast.info("Area fully explored", {
        description: "This area has been completely mapped"
      });
      return;
    }

    const progressGain = Math.random() * 15 + 5; // 5-20% progress
    const newProgress = Math.min(currentProgress + progressGain, 100);
    
    setExplorationProgress(prev => ({
      ...prev,
      [biome.id]: newProgress
    }));

    const rewards = [];
    if (Math.random() < 0.3) {
      rewards.push("Found hidden treasure cache!");
    }
    if (Math.random() < 0.2) {
      rewards.push("Discovered rare monster lair!");
    }
    if (Math.random() < 0.4) {
      rewards.push("Mapped new hunting grounds!");
    }

    toast.success(`Exploration progress: ${Math.round(newProgress)}%`, {
      description: rewards.length > 0 ? rewards.join(" ") : "Area knowledge increased"
    });

    if (newProgress === 100) {
      toast.success(`${biome.name} fully explored!`, {
        description: "New hunting bonuses unlocked for this biome"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return { name: 'Morning', icon: '🌅', bonus: 'Increased XP gain' };
    if (hour >= 12 && hour < 18) return { name: 'Afternoon', icon: '☀️', bonus: 'Standard rates' };
    if (hour >= 18 && hour < 22) return { name: 'Evening', icon: '🌆', bonus: 'Rare monster spawns' };
    return { name: 'Night', icon: '🌙', bonus: 'Shadow creatures active' };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold">Biomes & Exploration</h2>
      </div>

      {/* Time of Day */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{timeOfDay.icon}</span>
          <span className="font-medium">{timeOfDay.name}</span>
          <span className="text-sm text-gray-400">- {timeOfDay.bonus}</span>
        </div>
      </div>

      {/* Biomes Grid */}
      <div className="space-y-3">
        {biomes.map(biome => {
          const weather = currentWeather[biome.id];
          const timer = weatherTimers[biome.id] || 0;
          const exploration = explorationProgress[biome.id] || 0;

          return (
            <div 
              key={biome.id} 
              className={`p-4 border-2 rounded-lg bg-gradient-to-r transition-all hover:border-opacity-70 ${getBiomeColor(biome)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getBiomeIcon(biome)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{biome.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Eye className="h-3 w-3" />
                      <span>Explored: {Math.round(exploration)}%</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => exploreArea(biome)}
                  disabled={exploration >= 100}
                  className={`${biome.color === 'green' ? 'bg-green-600 hover:bg-green-500' :
                    biome.color === 'blue' ? 'bg-blue-600 hover:bg-blue-500' :
                    biome.color === 'purple' ? 'bg-purple-600 hover:bg-purple-500' :
                    biome.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-500' :
                    biome.color === 'red' ? 'bg-red-600 hover:bg-red-500' :
                    'bg-gray-600 hover:bg-gray-500'
                  } text-white`}
                >
                  {exploration >= 100 ? 'Fully Explored' : 'Explore'}
                </Button>
              </div>

              {/* Exploration Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Exploration Progress</span>
                  <span className="text-gray-400">{Math.round(exploration)}%</span>
                </div>
                <Progress value={exploration} className="h-2" />
              </div>

              {/* Weather */}
              {weather && (
                <div className="flex items-center justify-between p-2 bg-black/20 rounded border border-border/50">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(weather)}
                    <span className="text-sm font-medium">{weather.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      {formatTime(timer)} remaining
                    </div>
                    {Object.keys(weather.effects).length > 0 && (
                      <div className="text-xs text-blue-400">
                        Active effects
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Weather Effects */}
              {weather && Object.keys(weather.effects).length > 0 && (
                <div className="mt-2 text-xs space-y-1">
                  {weather.effects.huntTimeModifier && (
                    <div className={weather.effects.huntTimeModifier > 1 ? 'text-red-400' : 'text-green-400'}>
                      Hunt Time: {weather.effects.huntTimeModifier > 1 ? '+' : ''}{Math.round((weather.effects.huntTimeModifier - 1) * 100)}%
                    </div>
                  )}
                  {weather.effects.lootModifier && (
                    <div className={weather.effects.lootModifier > 1 ? 'text-green-400' : 'text-red-400'}>
                      Loot Rate: {weather.effects.lootModifier > 1 ? '+' : ''}{Math.round((weather.effects.lootModifier - 1) * 100)}%
                    </div>
                  )}
                  {weather.effects.encounterRateModifier && (
                    <div className={weather.effects.encounterRateModifier > 1 ? 'text-green-400' : 'text-red-400'}>
                      Encounter Rate: {weather.effects.encounterRateModifier > 1 ? '+' : ''}{Math.round((weather.effects.encounterRateModifier - 1) * 100)}%
                    </div>
                  )}
                  {weather.effects.staminaCostModifier && (
                    <div className={weather.effects.staminaCostModifier > 1 ? 'text-red-400' : 'text-green-400'}>
                      Stamina Cost: {weather.effects.staminaCostModifier > 1 ? '+' : ''}{Math.round((weather.effects.staminaCostModifier - 1) * 100)}%
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-border/50">
        <h4 className="text-sm font-semibold mb-2">Weather Effects Guide</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <div>🌧️ Rain: Increased loot drops, slower hunts</div>
          <div>⛈️ Storm: High rewards but dangerous conditions</div>
          <div>🌫️ Fog: More monster encounters, reduced visibility</div>
          <div>❄️ Snow: Harsh conditions, bonus materials</div>
          <div>🔥 Heat Wave: Faster hunts but draining stamina</div>
        </div>
      </div>
    </div>
  );
};