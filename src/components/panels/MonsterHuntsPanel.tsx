import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sword, Zap, Shield, Clock, Battery, Play, Pause } from 'lucide-react';
import { Monster, PlayerStats, Biome, InventoryItem, PlayerProfile } from '@/types/gameTypes';
import { toast } from 'sonner';

interface MonsterHuntsPanelProps {
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateMonsterDefeatedCount: (monsterId: string, loot: InventoryItem[], goldReward: number, xpGained: number) => void;
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
    let huntSpeedBonus = 0;
    let lootDropBonus = 0;
    let xpBonus = 0;
    
    // Check equipped gear from player profile
    if (playerProfile.equippedGear.weapon?.stats) {
      const stats = playerProfile.equippedGear.weapon.stats;
      huntSpeedBonus += stats['hunt speed'] || stats['attack speed'] || 0;
      lootDropBonus += stats['loot drop'] || 0;
      xpBonus += stats['xp bonus'] || 0;
    }
    
    if (playerProfile.equippedGear.armor?.stats) {
      const stats = playerProfile.equippedGear.armor.stats;
      huntSpeedBonus += stats['hunt speed'] || 0;
      lootDropBonus += stats['loot drop'] || 0;
      xpBonus += stats['xp bonus'] || 0;
    }
    
    if (playerProfile.equippedGear.accessory?.stats) {
      const stats = playerProfile.equippedGear.accessory.stats;
      huntSpeedBonus += stats['hunt speed'] || 0;
      lootDropBonus += stats['loot drop'] || stats['drop rate'] || 0;
      xpBonus += stats['xp bonus'] || 0;
    }
    
    return { huntSpeedBonus, lootDropBonus, xpBonus };
  };

  const getModifiedHuntTime = (monster: Monster) => {
    const { huntSpeedBonus } = getEquipmentBonus();
    const skillBonus = (playerStats.skills.combat || 0) * 3; // 3% per level
    const totalSpeedBonus = huntSpeedBonus + skillBonus;
    const reduction = Math.min(totalSpeedBonus, 75) / 100; // Cap at 75% reduction
    return Math.max(monster.huntTime * (1 - reduction), monster.huntTime * 0.25); // Minimum 25% of original time
  };

  const startHunt = (monster: Monster, difficulty: 'easy' | 'normal' | 'hard' = 'normal') => {
    if (playerStats.stamina >= 10 && playerStats.activeHunts.length < 3) {
      let modifiedHuntTime = getModifiedHuntTime(monster);
      
      // Apply difficulty modifiers
      const difficultyModifiers = {
        easy: { timeMultiplier: 0.7, rewardMultiplier: 0.8, killRange: [1, 2] },
        normal: { timeMultiplier: 1.0, rewardMultiplier: 1.0, killRange: [1, 3] },
        hard: { timeMultiplier: 1.5, rewardMultiplier: 1.5, killRange: [2, 5] }
      };
      
      const modifier = difficultyModifiers[difficulty];
      modifiedHuntTime *= modifier.timeMultiplier;
      
      updatePlayerStats({
        stamina: playerStats.stamina - 10,
        activeHunts: [...playerStats.activeHunts, monster.id]
      });

      setActiveHunts(prev => ({
        ...prev,
        [monster.id]: Date.now() + (modifiedHuntTime * 1000)
      }));

      toast.success(`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Hunt Started!`, {
        description: `Hunting ${monster.name} (${Math.floor(modifiedHuntTime)}s)`
      });

      setTimeout(() => {
        completeHunt(monster, difficulty);
      }, modifiedHuntTime * 1000);
    } else {
      toast.error("Cannot start hunt", {
        description: playerStats.stamina < 10 ? "Not enough stamina" : "Too many active hunts"
      });
    }
  };

  const completeHunt = (monster: Monster, difficulty: 'easy' | 'normal' | 'hard' = 'normal') => {
    updatePlayerStats({
      activeHunts: playerStats.activeHunts.filter(id => id !== monster.id)
    });

    setActiveHunts(prev => {
      const newHunts = { ...prev };
      delete newHunts[monster.id];
      return newHunts;
    });

    const difficultyModifiers = {
      easy: { timeMultiplier: 0.7, rewardMultiplier: 0.8, killRange: [1, 2] },
      normal: { timeMultiplier: 1.0, rewardMultiplier: 1.0, killRange: [1, 3] },
      hard: { timeMultiplier: 1.5, rewardMultiplier: 1.5, killRange: [2, 5] }
    };
    
    const modifier = difficultyModifiers[difficulty];
    const { lootDropBonus, xpBonus } = getEquipmentBonus();
    
    // Calculate number of kills (random within range, influenced by gear and skills)
    const baseKillRange = modifier.killRange;
    const trackingBonus = (playerStats.skills.tracking || 0) * 0.1; // 10% chance per level
    const gearKillBonus = Math.floor((lootDropBonus + xpBonus) / 20); // Every 20% bonus = +1 potential kill
    const maxKills = Math.min(baseKillRange[1] + gearKillBonus + Math.floor(trackingBonus), 8); // Cap at 8 kills
    const minKills = Math.max(baseKillRange[0], 1);
    const killCount = Math.floor(Math.random() * (maxKills - minKills + 1)) + minKills;

    // Calculate total rewards
    const resourceGatheringBonus = playerStats.skills.looting || 0;
    const dropRateMultiplier = 1 + (resourceGatheringBonus * 0.15) + (lootDropBonus / 100); // 15% per level + gear bonus
    
    const totalDrops: InventoryItem[] = [];
    let totalGold = 0;
    let totalXp = 0;
    
    for (let i = 0; i < killCount; i++) {
      // Each kill has a chance to drop items
      const actualDrops = monster.drops.filter(() => Math.random() < (0.7 + (dropRateMultiplier - 1))).map(drop => ({
        ...drop,
        quantity: Math.ceil(drop.quantity * Math.random() * (0.5 + dropRateMultiplier))
      }));
      totalDrops.push(...actualDrops);
      totalGold += Math.floor(monster.goldReward * modifier.rewardMultiplier * (1 + xpBonus / 100));
      totalXp += Math.floor(monster.level * 8 * (1 + xpBonus / 100));
    }
    
    // Consolidate duplicate drops
    const consolidatedDrops: InventoryItem[] = [];
    totalDrops.forEach(drop => {
      const existing = consolidatedDrops.find(item => item.id === drop.id);
      if (existing) {
        existing.quantity += drop.quantity;
      } else {
        consolidatedDrops.push({ ...drop });
      }
    });
    
    updateMonsterDefeatedCount(monster.id, consolidatedDrops, totalGold, totalXp);
    
    // Level up skills through hunting
    const newSkills = { ...playerStats.skills };
    newSkills.combat = (newSkills.combat || 0) + (0.1 * killCount);
    newSkills.tracking = (newSkills.tracking || 0) + (0.05 * killCount);
    newSkills.looting = (newSkills.looting || 0) + (0.03 * consolidatedDrops.length);
    
    updatePlayerStats({ skills: newSkills });

    // Show detailed hunt completion toast
    toast.success(`Hunt Complete! ${killCount} ${monster.name}${killCount > 1 ? 's' : ''} defeated!`, {
      description: `+${totalGold} gold, +${totalXp} XP (${difficulty} difficulty)`,
      action: {
        label: "View Rewards",
        onClick: () => {
          toast.info("Hunt Rewards Summary", {
            description: `Kills: ${killCount} | Gold: ${totalGold} | XP: ${totalXp} | Loot: ${consolidatedDrops.map(drop => `${drop.name} x${drop.quantity}`).join(', ') || 'None'}`
          });
        }
      }
    });
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
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        onClick={() => startHunt(monster, 'easy')}
                        disabled={!canHunt}
                        className="bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 text-xs px-2"
                        title="Easy: 70% time, 80% rewards, 1-2 kills"
                      >
                        Easy
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => startHunt(monster, 'normal')}
                        disabled={!canHunt}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-gray-600 text-xs px-2"
                        title="Normal: 100% time, 100% rewards, 1-3 kills"
                      >
                        Normal
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => startHunt(monster, 'hard')}
                        disabled={!canHunt}
                        className="bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-600 text-xs px-2"
                        title="Hard: 150% time, 150% rewards, 2-5 kills"
                      >
                        Hard
                      </Button>
                    </div>
                  )}
                  {monster.defeatedCount >= 10 && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                      Auto Hunt
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