import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sword, Zap, Shield, Clock, Battery, Play, Pause } from 'lucide-react';
import { Monster, PlayerStats, Biome, InventoryItem, PlayerProfile } from '@/types/gameTypes';

interface MonsterHuntsPanelProps {
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateMonsterDefeatedCount: (monsterId: string) => void;
  inventory: InventoryItem[];
  playerProfile: PlayerProfile;
}

const biomes: Biome[] = [
  {
    id: 'forest',
    name: 'Whispering Forest',
    color: 'green',
    monsters: [
      {
        id: 'shadow-wolf',
        name: 'Shadow Wolf',
        biome: 'forest',
        level: 15,
        icon: '🐺',
        huntTime: 30,
        drops: [
          { id: 'shadow-essence', name: 'Shadow Essence', icon: '🌑', rarity: 'uncommon', quantity: 1 },
          { id: 'wolf-pelt', name: 'Wolf Pelt', icon: '🦊', rarity: 'common', quantity: 2 }
        ],
        goldReward: 150,
        defeatedCount: 0,
        isAutoHuntUnlocked: false
      },
      {
        id: 'shadow-alpha',
        name: 'Shadow Alpha',
        biome: 'forest',
        level: 25,
        icon: '🐺‍⬛',
        huntTime: 60,
        drops: [
          { id: 'alpha-essence', name: 'Alpha Essence', icon: '🌑', rarity: 'rare', quantity: 2 },
          { id: 'alpha-pelt', name: 'Alpha Pelt', icon: '🦊', rarity: 'epic', quantity: 1 }
        ],
        goldReward: 400,
        defeatedCount: 0,
        isAutoHuntUnlocked: false,
        isEvolved: true,
        evolvedFrom: 'shadow-wolf',
        evolutionRequirement: { type: 'kills', value: 50 }
      },
      {
        id: 'forest-troll',
        name: 'Forest Troll',
        biome: 'forest',
        level: 20,
        icon: '👹',
        huntTime: 45,
        drops: [
          { id: 'troll-bone', name: 'Troll Bone', icon: '🦴', rarity: 'rare', quantity: 1 },
          { id: 'moss-covered-hide', name: 'Moss-Covered Hide', icon: '🍃', rarity: 'uncommon', quantity: 1 }
        ],
        goldReward: 250,
        defeatedCount: 0,
        isAutoHuntUnlocked: false
      }
    ]
  },
  {
    id: 'tundra',
    name: 'Frozen Tundra',
    color: 'blue',
    monsters: [
      {
        id: 'tundra-yeti',
        name: 'Tundra Yeti',
        biome: 'tundra',
        level: 25,
        icon: '🦣',
        huntTime: 60,
        drops: [
          { id: 'yeti-fur', name: 'Yeti Fur', icon: '❄️', rarity: 'rare', quantity: 1 },
          { id: 'ice-crystal', name: 'Ice Crystal', icon: '💎', rarity: 'epic', quantity: 1 }
        ],
        goldReward: 350,
        defeatedCount: 0,
        isAutoHuntUnlocked: false
      },
      {
        id: 'frost-behemoth',
        name: 'Frost Behemoth',
        biome: 'tundra',
        level: 35,
        icon: '🧊',
        huntTime: 90,
        drops: [
          { id: 'behemoth-hide', name: 'Behemoth Hide', icon: '❄️', rarity: 'epic', quantity: 1 },
          { id: 'frozen-core', name: 'Frozen Core', icon: '💎', rarity: 'legendary', quantity: 1 }
        ],
        goldReward: 750,
        defeatedCount: 0,
        isAutoHuntUnlocked: false,
        isEvolved: true,
        evolvedFrom: 'tundra-yeti',
        evolutionRequirement: { type: 'playerLevel', value: 30 }
      }
    ]
  },
  {
    id: 'swamp',
    name: 'Misty Swamp',
    color: 'purple',
    monsters: [
      {
        id: 'swamp-lurker',
        name: 'Swamp Lurker',
        biome: 'swamp',
        level: 18,
        icon: '🐸',
        huntTime: 40,
        drops: [
          { id: 'swamp-gas', name: 'Swamp Gas', icon: '💨', rarity: 'uncommon', quantity: 2 },
          { id: 'lurker-scale', name: 'Lurker Scale', icon: '🛡️', rarity: 'rare', quantity: 1 }
        ],
        goldReward: 200,
        defeatedCount: 0,
        isAutoHuntUnlocked: false
      },
      {
        id: 'toxic-hydra',
        name: 'Toxic Hydra',
        biome: 'swamp',
        level: 28,
        icon: '🐍',
        huntTime: 75,
        drops: [
          { id: 'hydra-venom', name: 'Hydra Venom', icon: '💨', rarity: 'epic', quantity: 1 },
          { id: 'hydra-scale', name: 'Hydra Scale', icon: '🛡️', rarity: 'epic', quantity: 2 }
        ],
        goldReward: 500,
        defeatedCount: 0,
        isAutoHuntUnlocked: false,
        isEvolved: true,
        evolvedFrom: 'swamp-lurker',
        evolutionRequirement: { type: 'kills', value: 30 }
      }
    ]
  }
];

export const MonsterHuntsPanel: React.FC<MonsterHuntsPanelProps> = ({ 
  playerStats, 
  updatePlayerStats, 
  updateMonsterDefeatedCount,
  inventory,
  playerProfile 
}) => {
  const [selectedBiome, setSelectedBiome] = useState<string>('forest');
  const [monsters, setMonsters] = useState<Monster[]>(biomes.find(b => b.id === 'forest')?.monsters || []);
  const [activeHunts, setActiveHunts] = useState<{ [monsterId: string]: number }>({});

  useEffect(() => {
    const currentBiome = biomes.find(b => b.id === selectedBiome);
    if (currentBiome) {
      setMonsters(currentBiome.monsters);
    }
  }, [selectedBiome]);

  useEffect(() => {
    // Stamina regeneration
    const interval = setInterval(() => {
      updatePlayerStats({
        stamina: Math.min(playerStats.stamina + playerStats.staminaRegenRate / 60, playerStats.maxStamina)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerStats.stamina, playerStats.maxStamina, playerStats.staminaRegenRate, updatePlayerStats]);

  const getEquipmentBonus = () => {
    const weapons = inventory.filter(item => item.type === 'equipment' && item.stats);
    let attackSpeedBonus = 0;
    let huntSpeedBonus = 0;
    
    weapons.forEach(weapon => {
      if (weapon.stats?.['attack speed']) {
        attackSpeedBonus += weapon.stats['attack speed'];
      }
      if (weapon.stats?.['hunt speed']) {
        huntSpeedBonus += weapon.stats['hunt speed'];
      }
    });
    
    return { attackSpeedBonus, huntSpeedBonus };
  };

  const getModifiedHuntTime = (monster: Monster) => {
    const { huntSpeedBonus } = getEquipmentBonus();
    const skillBonus = (playerStats.skills.attackSpeed || 0) * 5; // 5% per level
    const totalSpeedBonus = huntSpeedBonus + skillBonus;
    const reduction = Math.min(totalSpeedBonus, 80) / 100; // Cap at 80% reduction
    return Math.max(monster.huntTime * (1 - reduction), monster.huntTime * 0.2); // Minimum 20% of original time
  };

  const startHunt = (monster: Monster) => {
    if (playerStats.stamina >= 10 && playerStats.activeHunts.length < 3) {
      const modifiedHuntTime = getModifiedHuntTime(monster);
      
      updatePlayerStats({
        stamina: playerStats.stamina - 10,
        activeHunts: [...playerStats.activeHunts, monster.id]
      });

      setActiveHunts(prev => ({
        ...prev,
        [monster.id]: Date.now() + (modifiedHuntTime * 1000)
      }));

      setTimeout(() => {
        completeHunt(monster);
      }, modifiedHuntTime * 1000);
    }
  };

  const completeHunt = (monster: Monster) => {
    updatePlayerStats({
      activeHunts: playerStats.activeHunts.filter(id => id !== monster.id)
    });

    setActiveHunts(prev => {
      const newHunts = { ...prev };
      delete newHunts[monster.id];
      return newHunts;
    });

    updateMonsterDefeatedCount(monster.id);
    
    // Level up skills through hunting
    const newSkills = { ...playerStats.skills };
    newSkills.attackSpeed = (newSkills.attackSpeed || 0) + 0.1;
    newSkills.resourceGathering = (newSkills.resourceGathering || 0) + 0.05;
    
    updatePlayerStats({ skills: newSkills });
  };

  const getBiomeColor = (biomeId: string) => {
    const biome = biomes.find(b => b.id === biomeId);
    switch (biome?.color) {
      case 'green': return 'text-green-400 border-green-600';
      case 'blue': return 'text-blue-400 border-blue-600';
      case 'purple': return 'text-purple-400 border-purple-600';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sword className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-bold">Monster Hunts</h2>
      </div>

      {/* Stamina Bar */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Battery className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">Stamina: {Math.floor(playerStats.stamina)}/{playerStats.maxStamina}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full transition-all" 
            style={{ width: `${(playerStats.stamina / playerStats.maxStamina) * 100}%` }}
          />
        </div>
      </div>

      {/* Biome Selector */}
      <div className="mb-4">
        <select
          value={selectedBiome}
          onChange={(e) => setSelectedBiome(e.target.value)}
          className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-medium"
        >
          {biomes.map(biome => (
            <option key={biome.id} value={biome.id}>
              {biome.name}
            </option>
          ))}
        </select>
      </div>

      {/* Monster List */}
      <div className="space-y-3">
        {monsters.map(monster => {
          const isHunting = activeHunts[monster.id];
          const canHunt = playerStats.stamina >= 10 && playerStats.activeHunts.length < 3;
          const isEvolutionAvailable = monster.isEvolved && 
            ((monster.evolutionRequirement?.type === 'kills' && 
              monsters.find(m => m.id === monster.evolvedFrom)?.defeatedCount >= monster.evolutionRequirement.value) ||
             (monster.evolutionRequirement?.type === 'playerLevel' && 
              playerProfile.level >= monster.evolutionRequirement.value));
          
          // Only show evolved monsters if evolution is available
          if (monster.isEvolved && !isEvolutionAvailable) return null;
          
          return (
            <div key={monster.id} className={`p-4 border-2 border-red-500/30 rounded-lg bg-gradient-to-r from-red-950/20 to-red-900/10 hover:border-red-400/50 transition-all ${getBiomeColor(selectedBiome)} ${monster.isEvolved ? 'border-purple-500/50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-lg">
                  {monster.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-red-100">{monster.name}</h3>
                    {monster.isEvolved && (
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">EVOLVED</span>
                    )}
                  </div>
                  <p className="text-sm text-red-300">
                    Drops: {monster.drops.map(d => d.name).join(', ')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-red-400">⚔️ Level {monster.level}</div>
                    <div className="text-xs text-yellow-400">💰 {monster.goldReward} gold/kill</div>
                    <div className="text-xs text-gray-400">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {Math.floor(getModifiedHuntTime(monster))}s
                      {getModifiedHuntTime(monster) !== monster.huntTime && (
                        <span className="text-green-400 ml-1">
                          (was {monster.huntTime}s)
                        </span>
                      )}
                    </div>
                  </div>
                  {monster.defeatedCount >= 10 && (
                    <div className="text-xs text-green-400 mt-1">
                      ✨ Auto-hunt unlocked!
                    </div>
                  )}
                  {monster.isEvolved && monster.evolvedFrom && (
                    <div className="text-xs text-purple-400 mt-1">
                      🧬 Evolved from {monsters.find(m => m.id === monster.evolvedFrom)?.name}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {isHunting ? (
                    <Button size="sm" disabled className="bg-gray-600 text-white">
                      <Pause className="h-3 w-3 mr-1" />
                      Hunting...
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => startHunt(monster)}
                      disabled={!canHunt}
                      className="bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-600"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Hunt
                    </Button>
                  )}
                  {monster.defeatedCount >= 10 && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">
                      Auto
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};