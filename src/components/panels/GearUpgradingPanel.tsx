import React from 'react';
import { Wrench, Star, Coins, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types/gameTypes';

interface GearUpgradingPanelProps {
  inventory: InventoryItem[];
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string, quantity: number) => void;
  playerGold: number;
  updatePlayerGold: (gold: number) => void;
}

export const GearUpgradingPanel: React.FC<GearUpgradingPanelProps> = ({ 
  inventory, 
  addToInventory, 
  removeFromInventory,
  playerGold,
  updatePlayerGold
}) => {
  const upgradeableGear = inventory.filter(item => 
    item.type === 'equipment' && 
    item.rarity !== 'legendary'
  );

  const getUpgradeCost = (rarity: string) => {
    switch (rarity) {
      case 'common': return 1000;
      case 'uncommon': return 2500;
      case 'rare': return 5000;
      case 'epic': return 10000;
      default: return 0;
    }
  };

  const getNextRarity = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'uncommon';
      case 'uncommon': return 'rare';
      case 'rare': return 'epic';
      case 'epic': return 'legendary';
      default: return rarity;
    }
  };

  const getSuccessRate = (rarity: string) => {
    switch (rarity) {
      case 'common': return 95;
      case 'uncommon': return 85;
      case 'rare': return 70;
      case 'epic': return 50;
      default: return 0;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const upgradeItem = (item: InventoryItem) => {
    const cost = getUpgradeCost(item.rarity);
    const successRate = getSuccessRate(item.rarity);
    
    if (playerGold >= cost) {
      updatePlayerGold(playerGold - cost);
      removeFromInventory(item.id, 1);
      
      const success = Math.random() * 100 < successRate;
      
      if (success) {
        const upgradedItem: InventoryItem = {
          ...item,
          rarity: getNextRarity(item.rarity) as any,
          stats: item.stats ? Object.fromEntries(
            Object.entries(item.stats).map(([stat, value]) => [stat, Math.floor(value * 1.5)])
          ) : undefined,
          level: (item.level || 1) + 1
        };
        addToInventory(upgradedItem);
      } else {
        // Upgrade failed, item is destroyed
        // Could add a partial refund or consolation prize here
      }
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="h-5 w-5 text-orange-400" />
        <h2 className="text-lg font-bold">Gear Upgrading</h2>
        <div className="ml-auto text-sm text-yellow-400 font-medium">
          💰 {playerGold.toLocaleString()} gold
        </div>
      </div>
      
      {upgradeableGear.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No upgradeable equipment found</p>
          <p className="text-sm">Craft or buy equipment to upgrade</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upgradeableGear.map((item, index) => {
            const cost = getUpgradeCost(item.rarity);
            const nextRarity = getNextRarity(item.rarity);
            const successRate = getSuccessRate(item.rarity);
            const canAfford = playerGold >= cost;
            
            return (
              <div key={`${item.id}-${index}`} className="p-4 border-2 border-orange-500/30 rounded-lg bg-gradient-to-r from-orange-950/20 to-orange-900/10 hover:border-orange-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${getRarityColor(item.rarity)}`}>
                      {item.name} {item.level && `+${item.level}`}
                    </h3>
                    {item.stats && (
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {Object.entries(item.stats).map(([stat, value]) => 
                          `+${value}${stat.includes('rate') || stat.includes('regen') ? '%' : ''} ${stat}`
                        ).join(', ')}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`text-sm ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </div>
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                      <div className={`text-sm ${getRarityColor(nextRarity)}`}>
                        {nextRarity}
                      </div>
                    </div>
                    {item.stats && (
                      <div className="text-xs text-green-400 mt-1">
                        Upgraded: {Object.entries(item.stats).map(([stat, value]) => 
                          `+${Math.floor(value * 1.5)}${stat.includes('rate') || stat.includes('regen') ? '%' : ''} ${stat}`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-400 mb-1">
                      <Coins className="h-3 w-3 inline mr-1" />
                      {cost.toLocaleString()} gold
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      <Star className="h-3 w-3 inline mr-1" />
                      {successRate}% success rate
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => upgradeItem(item)}
                      disabled={!canAfford}
                      className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};