import React from 'react';
import { BookOpen, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerStats } from '@/types/gameTypes';

interface SkillTreePanelProps {
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
}

export const SkillTreePanel: React.FC<SkillTreePanelProps> = ({ playerStats, updatePlayerStats }) => {
  const upgradeSkill = (skillName: string) => {
    const currentLevel = playerStats.skills[skillName] || 0;
    if (currentLevel < 10) {
      updatePlayerStats({
        skills: {
          ...playerStats.skills,
          [skillName]: currentLevel + 1
        }
      });
    }
  };

  const getSkillLevel = (skillName: string) => playerStats.skills[skillName] || 0;

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-bold">Skill Tree</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 border-2 border-yellow-500/30 rounded-lg bg-gradient-to-r from-yellow-950/20 to-yellow-900/10">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <h3 className="font-semibold text-yellow-100">Combat Skills</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Attack Speed</span>
                <span className="text-sm text-yellow-400">Level {getSkillLevel('attackSpeed')}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(getSkillLevel('attackSpeed') / 10) * 100}%` }}
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => upgradeSkill('attackSpeed')}
                disabled={getSkillLevel('attackSpeed') >= 10}
                className="bg-yellow-600 hover:bg-yellow-500"
              >
                Upgrade (+5% hunt speed)
              </Button>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Critical Strike</span>
                <span className="text-sm text-yellow-400">Level {getSkillLevel('criticalStrike')}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full" 
                  style={{ width: `${(getSkillLevel('criticalStrike') / 10) * 100}%` }}
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => upgradeSkill('criticalStrike')}
                disabled={getSkillLevel('criticalStrike') >= 10}
                className="bg-yellow-600 hover:bg-yellow-500"
              >
                Upgrade (+3% crit chance)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-2 border-green-500/30 rounded-lg bg-gradient-to-r from-green-950/20 to-green-900/10">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-4 w-4 text-green-400" />
            <h3 className="font-semibold text-green-100">Survival Skills</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Resource Gathering</span>
                <span className="text-sm text-green-400">Level {getSkillLevel('resourceGathering')}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full" 
                  style={{ width: `${(getSkillLevel('resourceGathering') / 10) * 100}%` }}
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => upgradeSkill('resourceGathering')}
                disabled={getSkillLevel('resourceGathering') >= 10}
                className="bg-green-600 hover:bg-green-500"
              >
                Upgrade (+10% drop rate)
              </Button>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Stamina Recovery</span>
                <span className="text-sm text-green-400">Level {getSkillLevel('staminaRecovery')}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full" 
                  style={{ width: `${(getSkillLevel('staminaRecovery') / 10) * 100}%` }}
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => upgradeSkill('staminaRecovery')}
                disabled={getSkillLevel('staminaRecovery') >= 10}
                className="bg-green-600 hover:bg-green-500"
              >
                Upgrade (+15% regen rate)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};