import React from 'react';
import { User, Crown, Sword, Shield, Gem, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlayerProfile, InventoryItem } from '@/types/gameTypes';

interface PlayerProfilePanelProps {
  playerProfile: PlayerProfile;
  updatePlayerProfile: (updates: Partial<PlayerProfile>) => void;
}

export const PlayerProfilePanel: React.FC<PlayerProfilePanelProps> = ({ 
  playerProfile, 
  updatePlayerProfile 
}) => {
  const xpPercent = (playerProfile.xp / playerProfile.xpToNextLevel) * 100;

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'Shadow Hunters': return 'text-purple-400';
      case 'Crystal Wardens': return 'text-blue-400';
      case 'Nature\'s Guard': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getEquipmentSlotIcon = (slot: string) => {
    switch (slot) {
      case 'weapon': return <Sword className="h-4 w-4" />;
      case 'armor': return <Shield className="h-4 w-4" />;
      case 'ring': return <Gem className="h-4 w-4" />;
      case 'amulet': return <Gem className="h-4 w-4" />;
      case 'trinket': return <Gem className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderEquipmentSlot = (slot: 'weapon' | 'armor' | 'ring' | 'amulet' | 'trinket', item?: InventoryItem) => {
    const getRarityColor = (rarity: string) => {
      switch (rarity) {
        case 'common': return 'border-gray-500/50';
        case 'uncommon': return 'border-green-500/50';
        case 'rare': return 'border-blue-500/50';
        case 'epic': return 'border-purple-500/50';
        case 'legendary': return 'border-orange-500/50';
        default: return 'border-gray-500/50';
      }
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`p-3 border-2 rounded-lg bg-gradient-to-r from-blue-950/20 to-blue-900/10 hover:border-blue-400/50 transition-all cursor-pointer ${item ? getRarityColor(item.rarity) : 'border-blue-500/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {getEquipmentSlotIcon(slot)}
                <span className="text-sm font-medium capitalize text-blue-300">{slot}</span>
              </div>
              {item ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{item.rarity}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-2">
                  Empty
                </div>
              )}
            </div>
          </TooltipTrigger>
          {item && (
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {item.rarity} {item.equipmentType}
                </div>
                {item.stats && (
                  <div className="space-y-1">
                    <div className="font-medium text-xs">Effects:</div>
                    {Object.entries(item.stats).map(([stat, value]) => (
                      <div key={stat} className="text-xs text-green-400">
                        +{value}{stat.includes('rate') || stat.includes('bonus') ? '%' : ''} {stat.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-bold">Player Profile</h2>
      </div>

      <div className="space-y-4">
        {/* Player Info */}
        <div className="p-4 border-2 border-blue-500/30 rounded-lg bg-gradient-to-r from-blue-950/20 to-blue-900/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl">
              {playerProfile.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-blue-100">{playerProfile.username}</h3>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <div className={`text-sm font-medium ${getFactionColor(playerProfile.faction)}`}>
                <Crown className="h-3 w-3 inline mr-1" />
                {playerProfile.faction}
              </div>
            </div>
          </div>

          {/* Level and XP */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Level {playerProfile.level}</span>
              <span className="text-xs text-gray-400">
                {playerProfile.xp.toLocaleString()} / {playerProfile.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all" 
                style={{ width: `${Math.min(xpPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Monsters Hunted:</span>
              <span className="text-white">{playerProfile.totalMonstersHunted.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gold Earned:</span>
              <span className="text-yellow-400">{playerProfile.totalGoldEarned.toLocaleString()}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-gray-400">Idle Time:</span>
              <span className="text-green-400">
                {Math.floor(playerProfile.totalIdleTime / 3600)}h {Math.floor((playerProfile.totalIdleTime % 3600) / 60)}m
              </span>
            </div>
          </div>
        </div>

        {/* Equipped Gear */}
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-blue-100">Equipped Gear</h3>
          <div className="grid grid-cols-2 gap-2">
            {renderEquipmentSlot('weapon', playerProfile.equippedGear.weapon)}
            {renderEquipmentSlot('armor', playerProfile.equippedGear.armor)}
          </div>
          
          <h4 className="text-sm font-semibold text-blue-200 mt-4">Accessories</h4>
          <div className="grid grid-cols-1 gap-2">
            {renderEquipmentSlot('ring', playerProfile.equippedGear.ring)}
            {renderEquipmentSlot('amulet', playerProfile.equippedGear.amulet)}
            {renderEquipmentSlot('trinket', playerProfile.equippedGear.trinket)}
          </div>
        </div>
      </div>
    </div>
  );
};