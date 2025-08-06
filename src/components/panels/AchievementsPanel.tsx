import React from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react';
import { Achievement, PlayerProfile } from '@/types/gameTypes';

interface AchievementsPanelProps {
  playerProfile: PlayerProfile;
  achievements: Achievement[];
  updateAchievements: (achievements: Achievement[]) => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ 
  playerProfile, 
  achievements 
}) => {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'monsters': return '🗡️';
      case 'crafting': return '🔨';
      case 'gold': return '💰';
      case 'skills': return '📚';
      case 'idle': return '⏰';
      default: return '🏆';
    }
  };

  const getProgressColor = (isCompleted: boolean, progress: number, maxProgress: number) => {
    if (isCompleted) return 'from-yellow-600 to-yellow-400';
    const percent = (progress / maxProgress) * 100;
    if (percent >= 75) return 'from-green-600 to-green-400';
    if (percent >= 50) return 'from-blue-600 to-blue-400';
    if (percent >= 25) return 'from-orange-600 to-orange-400';
    return 'from-gray-600 to-gray-400';
  };

  const completedCount = achievements.filter(a => a.isCompleted).length;

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-bold">Achievements</h2>
        <div className="ml-auto text-sm text-yellow-400 font-medium">
          {completedCount}/{achievements.length} Completed
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map(achievement => {
          const progressPercent = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
          
          return (
            <div 
              key={achievement.id} 
              className={`p-4 border-2 rounded-lg transition-all ${
                achievement.isCompleted 
                  ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-950/30 to-yellow-900/20 hover:border-yellow-400/70' 
                  : 'border-gray-500/30 bg-gradient-to-r from-gray-950/20 to-gray-900/10 hover:border-gray-400/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getAchievementIcon(achievement.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${achievement.isCompleted ? 'text-yellow-300' : 'text-white'}`}>
                      {achievement.name}
                    </h3>
                    {achievement.isCompleted && (
                      <CheckCircle className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    {achievement.description}
                  </p>
                  
                  {!achievement.isCompleted && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${getProgressColor(achievement.isCompleted, achievement.progress, achievement.maxProgress)} h-2 rounded-full transition-all`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.isCompleted && (
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="h-3 w-3" />
                      <span>Achievement Unlocked!</span>
                    </div>
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