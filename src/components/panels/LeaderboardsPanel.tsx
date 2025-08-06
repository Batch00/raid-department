import React, { useState } from 'react';
import { BarChart3, Crown, Medal, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gameTypes';

interface LeaderboardsPanelProps {
  // In a real implementation, this would come from server data
}

const dummyLeaderboards = {
  xp: [
    { rank: 1, username: 'DragonSlayer99', value: 125000, faction: 'Shadow Hunters' },
    { rank: 2, username: 'CrystalMage', value: 118000, faction: 'Crystal Wardens' },
    { rank: 3, username: 'ForestGuardian', value: 112000, faction: 'Nature\'s Guard' },
    { rank: 4, username: 'DarkHunter92', value: 98000, faction: 'Shadow Hunters' },
    { rank: 5, username: 'EpicCrafter', value: 87000, faction: 'Crystal Wardens' },
    { rank: 6, username: 'WildBeast', value: 82000, faction: 'Nature\'s Guard' },
    { rank: 7, username: 'ShadowBlade', value: 76000, faction: 'Shadow Hunters' },
    { rank: 8, username: 'MythicForge', value: 71000, faction: 'Crystal Wardens' },
    { rank: 9, username: 'NatureWalker', value: 65000, faction: 'Nature\'s Guard' },
    { rank: 10, username: 'VoidHunter', value: 58000, faction: 'Shadow Hunters' }
  ],
  gold: [
    { rank: 1, username: 'GoldRush101', value: 5000000, faction: 'Crystal Wardens' },
    { rank: 2, username: 'WealthBuilder', value: 4500000, faction: 'Shadow Hunters' },
    { rank: 3, username: 'TradeKing', value: 4200000, faction: 'Crystal Wardens' },
    { rank: 4, username: 'FortuneSeeker', value: 3800000, faction: 'Nature\'s Guard' },
    { rank: 5, username: 'CoinCollector', value: 3400000, faction: 'Shadow Hunters' },
    { rank: 6, username: 'MarketMaster', value: 3100000, faction: 'Crystal Wardens' },
    { rank: 7, username: 'GoldDigger', value: 2800000, faction: 'Nature\'s Guard' },
    { rank: 8, username: 'RichHunter', value: 2500000, faction: 'Shadow Hunters' },
    { rank: 9, username: 'MoneyMaker', value: 2200000, faction: 'Crystal Wardens' },
    { rank: 10, username: 'ProfitSeeker', value: 1900000, faction: 'Nature\'s Guard' }
  ],
  hunts: [
    { rank: 1, username: 'MonsterBane', value: 25000, faction: 'Shadow Hunters' },
    { rank: 2, username: 'BeastSlayer', value: 23500, faction: 'Nature\'s Guard' },
    { rank: 3, username: 'HuntMaster', value: 22000, faction: 'Shadow Hunters' },
    { rank: 4, username: 'CreatureKiller', value: 20500, faction: 'Crystal Wardens' },
    { rank: 5, username: 'WildHunter', value: 19000, faction: 'Nature\'s Guard' },
    { rank: 6, username: 'PredatorX', value: 17500, faction: 'Shadow Hunters' },
    { rank: 7, username: 'PackLeader', value: 16000, faction: 'Nature\'s Guard' },
    { rank: 8, username: 'AlphaHunter', value: 14500, faction: 'Shadow Hunters' },
    { rank: 9, username: 'CrystalStalker', value: 13000, faction: 'Crystal Wardens' },
    { rank: 10, username: 'ShadowTracker', value: 11500, faction: 'Shadow Hunters' }
  ],
  epicGear: [
    { rank: 1, username: 'LegendCrafter', value: 89, faction: 'Crystal Wardens' },
    { rank: 2, username: 'EpicForge', value: 76, faction: 'Crystal Wardens' },
    { rank: 3, username: 'MasterSmith', value: 68, faction: 'Shadow Hunters' },
    { rank: 4, username: 'GearGuru', value: 61, faction: 'Crystal Wardens' },
    { rank: 5, username: 'CraftLord', value: 54, faction: 'Nature\'s Guard' },
    { rank: 6, username: 'ItemMaker', value: 47, faction: 'Shadow Hunters' },
    { rank: 7, username: 'EquipMaster', value: 40, faction: 'Crystal Wardens' },
    { rank: 8, username: 'ArtisanPro', value: 33, faction: 'Nature\'s Guard' },
    { rank: 9, username: 'CraftKing', value: 26, faction: 'Shadow Hunters' },
    { rank: 10, username: 'ForgeWizard', value: 19, faction: 'Crystal Wardens' }
  ]
};

export const LeaderboardsPanel: React.FC<LeaderboardsPanelProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<'xp' | 'gold' | 'hunts' | 'epicGear'>('xp');

  const categories = [
    { key: 'xp', label: 'Total XP', icon: '⭐' },
    { key: 'gold', label: 'Gold Earned', icon: '💰' },
    { key: 'hunts', label: 'Monsters Hunted', icon: '🗡️' },
    { key: 'epicGear', label: 'Epic Gear', icon: '⚔️' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-400" />;
      case 2: return <Medal className="h-4 w-4 text-gray-300" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-gray-400 text-sm">#{rank}</span>;
    }
  };

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'Shadow Hunters': return 'text-purple-400';
      case 'Crystal Wardens': return 'text-blue-400';
      case 'Nature\'s Guard': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatValue = (value: number, category: string) => {
    if (category === 'gold') {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString();
  };

  const currentLeaderboard = dummyLeaderboards[selectedCategory];

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-bold">Leaderboards</h2>
      </div>

      {/* Category Selector */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.key
                  ? 'bg-yellow-600 text-white'
                  : 'bg-muted hover:bg-muted/80 text-gray-300'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {currentLeaderboard.map((entry, index) => (
          <div 
            key={entry.username}
            className={`p-3 border-2 rounded-lg transition-all ${
              entry.rank <= 3
                ? 'border-yellow-500/40 bg-gradient-to-r from-yellow-950/30 to-yellow-900/20'
                : 'border-gray-500/30 bg-gradient-to-r from-gray-950/20 to-gray-900/10'
            } hover:border-opacity-60`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${entry.rank <= 3 ? 'text-yellow-200' : 'text-white'}`}>
                    {entry.username}
                  </span>
                  <span className={`text-xs ${getFactionColor(entry.faction)}`}>
                    {entry.faction}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${entry.rank <= 3 ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {formatValue(entry.value, selectedCategory)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};