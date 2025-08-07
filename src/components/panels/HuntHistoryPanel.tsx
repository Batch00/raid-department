import React from 'react';
import { History, Trophy, Clock } from 'lucide-react';

interface HuntHistoryPanelProps {
  huntHistory: any[];
}

export const HuntHistoryPanel: React.FC<HuntHistoryPanelProps> = ({ huntHistory }) => {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-bold">Hunt History</h2>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {huntHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hunts completed yet</p>
            <p className="text-sm">Start hunting monsters to see your history!</p>
          </div>
        ) : (
          huntHistory.map((entry) => (
            <div key={entry.id} className="p-3 border-2 border-amber-500/30 rounded-lg bg-gradient-to-r from-amber-950/20 to-amber-900/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-amber-100 capitalize">
                  {entry.monsterId.replace('-', ' ')}
                </h4>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Clock className="h-3 w-3" />
                  {entry.timeCompleted}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Gold:</span>
                  <span className="text-yellow-400 ml-1">+{entry.goldEarned}</span>
                </div>
                <div>
                  <span className="text-gray-400">XP:</span>
                  <span className="text-blue-400 ml-1">+{entry.xpGained}</span>
                </div>
              </div>
              
              {entry.loot && entry.loot.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Loot: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.loot.map((item: any, idx: number) => (
                      <span key={idx} className="text-xs bg-amber-950/40 px-2 py-1 rounded">
                        {item.icon} {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};