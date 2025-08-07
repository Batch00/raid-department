import React from 'react';
import { ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types/gameTypes';

interface MarketplacePanelProps {
  playerGold: number;
  updatePlayerGold: (gold: number) => void;
  addToInventory: (item: InventoryItem) => void;
}

const marketplaceItems = [
  {
    item: { id: 'shadow-essence', name: 'Shadow Essence', icon: '🌑', rarity: 'uncommon', quantity: 3, type: 'material' } as InventoryItem,
    price: 500,
    seller: 'DarkHunter92',
    trend: 'up'
  },
  {
    item: { id: 'iron-ore', name: 'Iron Ore', icon: '⛏️', rarity: 'common', quantity: 5, type: 'material' } as InventoryItem,
    price: 200,
    seller: 'Miner101',
    trend: 'stable'
  },
  {
    item: { id: 'crystal-shard', name: 'Crystal Shard', icon: '💎', rarity: 'rare', quantity: 2, type: 'material' } as InventoryItem,
    price: 800,
    seller: 'CrystalMage',
    trend: 'down'
  },
  {
    item: { id: 'leather', name: 'Leather', icon: '🟤', rarity: 'common', quantity: 4, type: 'material' } as InventoryItem,
    price: 150,
    seller: 'Tanner',
    trend: 'stable'
  },
  {
    item: { id: 'herb', name: 'Herb', icon: '🌿', rarity: 'common', quantity: 8, type: 'material' } as InventoryItem,
    price: 100,
    seller: 'Herbalist',
    trend: 'up'
  },
  {
    item: { id: 'pure-water', name: 'Pure Water', icon: '💧', rarity: 'common', quantity: 3, type: 'material' } as InventoryItem,
    price: 50,
    seller: 'WaterMerchant',
    trend: 'stable'
  },
  {
    item: { id: 'time-boost-potion', name: 'Time Boost Potion', icon: '⏰', rarity: 'epic', quantity: 1, type: 'consumable' } as InventoryItem,
    price: 5000,
    seller: 'AlchemistPro',
    trend: 'up'
  }
];

export const MarketplacePanel: React.FC<MarketplacePanelProps> = ({ 
  playerGold, 
  updatePlayerGold, 
  addToInventory 
}) => {
  const buyItem = (marketItem: typeof marketplaceItems[0]) => {
    if (playerGold >= marketItem.price) {
      updatePlayerGold(playerGold - marketItem.price);
      addToInventory(marketItem.item);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <div className="h-3 w-3" />;
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

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-purple-400" />
        <h2 className="text-lg font-bold">Marketplace</h2>
        <div className="ml-auto text-sm text-yellow-400 font-medium">
          💰 {playerGold.toLocaleString()} gold
        </div>
      </div>
      <div className="space-y-3">
        {marketplaceItems.map((marketItem, index) => (
          <div key={index} className="p-4 border-2 border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-950/20 to-purple-900/10 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-lg">{marketItem.item.icon}</div>
                <div>
                  <div className={`font-semibold ${getRarityColor(marketItem.item.rarity)}`}>
                    {marketItem.item.name}
                  </div>
                  <div className="text-sm text-purple-300">
                    Quantity: {marketItem.item.quantity} • Seller: {marketItem.seller}
                  </div>
                  {marketItem.item.type === 'equipment' && marketItem.item.stats && (
                    <div className="text-xs text-gray-400 mt-1">
                      {Object.entries(marketItem.item.stats).map(([stat, value]) => 
                        `+${value}${stat.includes('rate') ? '%' : ''} ${stat}`
                      ).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <div className="text-yellow-400 font-bold">{marketItem.price.toLocaleString()} 💰</div>
                  {getTrendIcon(marketItem.trend)}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => buyItem(marketItem)}
                  disabled={playerGold < marketItem.price}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600"
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};