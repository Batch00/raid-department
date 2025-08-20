import React, { useState } from 'react';
import { Scroll, Crown, Star, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Quest, QuestNPC } from '@/types/gameTypes';
import { toast } from 'sonner';

interface QuestsPanelProps {
  playerStats: any;
  playerProfile: any;
  updatePlayerProfile: (updates: any) => void;
  addToInventory: (item: any) => void;
  updatePlayerGold: (gold: number) => void;
}

const questNPCs: QuestNPC[] = [
  {
    id: 'elder-maya',
    name: 'Elder Maya',
    faction: 'Crystal Wardens',
    reputation: 'Neutral',
    icon: '🧙‍♀️',
    location: 'Crystal Sanctum',
    dialogue: {
      greeting: "Welcome, young hunter. The crystals whisper of your potential...",
      questAvailable: "I have tasks that could help both of us. Are you interested?",
      questComplete: "Excellent work! The crystals approve of your dedication.",
      noQuests: "Return when you've proven yourself further, hunter."
    }
  },
  {
    id: 'guard-captain-rex',
    name: 'Captain Rex',
    faction: 'Shadow Hunters',
    reputation: 'Friendly',
    icon: '⚔️',
    location: 'Hunter\'s Lodge',
    dialogue: {
      greeting: "Greetings, fellow hunter! Ready for some real challenges?",
      questAvailable: "I've got dangerous monsters that need dealing with. You up for it?",
      questComplete: "Outstanding! You're becoming a true shadow hunter.",
      noQuests: "Keep honing your skills. Greater challenges await."
    }
  },
  {
    id: 'merchant-zara',
    name: 'Merchant Zara',
    faction: 'Independent',
    reputation: 'Neutral',
    icon: '💰',
    location: 'Trading Post',
    dialogue: {
      greeting: "Ah, a customer! I have goods from across the realm.",
      questAvailable: "I need help acquiring certain... valuable items. Interested?",
      questComplete: "Perfect! Your business is always appreciated.",
      noQuests: "Come back when you've made a name for yourself."
    }
  }
];

const questTemplates: Omit<Quest, 'id' | 'giver' | 'isActive' | 'isCompleted'>[] = [
  {
    title: 'Shadow Wolf Extermination',
    description: 'The Shadow Wolves are becoming too aggressive. Hunt 10 of them to thin their numbers.',
    type: 'hunt',
    difficulty: 'easy',
    objectives: [
      { type: 'kill', target: 'shadow-wolf', required: 10, current: 0 }
    ],
    rewards: {
      gold: 1500,
      xp: 800,
      items: [
        { id: 'wolf-hunter-badge', name: 'Wolf Hunter Badge', icon: '🏅', rarity: 'rare', quantity: 1, type: 'material' }
      ],
      reputation: { faction: 'Crystal Wardens', amount: 100 }
    },
    timeLimit: 3600,
    requiredLevel: 5
  },
  {
    title: 'Crystal Collection',
    description: 'Gather rare crystal shards for magical research. The tundra holds what I seek.',
    type: 'collect',
    difficulty: 'medium',
    objectives: [
      { type: 'collect', target: 'ice-crystal', required: 5, current: 0 }
    ],
    rewards: {
      gold: 2500,
      xp: 1200,
      items: [
        { id: 'crystal-research-notes', name: 'Crystal Research Notes', icon: '📜', rarity: 'epic', quantity: 1, type: 'material' }
      ],
      reputation: { faction: 'Crystal Wardens', amount: 200 }
    },
    timeLimit: 7200,
    requiredLevel: 15
  },
  {
    title: 'Elite Hunter Challenge',
    description: 'Prove your worth by defeating the mighty Frost Behemoth. Only true hunters dare attempt this.',
    type: 'hunt',
    difficulty: 'hard',
    objectives: [
      { type: 'kill', target: 'frost-behemoth', required: 1, current: 0 }
    ],
    rewards: {
      gold: 10000,
      xp: 5000,
      items: [
        { id: 'behemoth-slayer-title', name: 'Behemoth Slayer Title', icon: '👑', rarity: 'legendary', quantity: 1, type: 'consumable' },
        { id: 'frozen-core', name: 'Frozen Core', icon: '💎', rarity: 'legendary', quantity: 1, type: 'material' }
      ],
      reputation: { faction: 'Shadow Hunters', amount: 500 }
    },
    timeLimit: 14400,
    requiredLevel: 30
  },
  {
    title: 'Resource Gathering',
    description: 'I need various materials for my wares. Bring me what the monsters drop.',
    type: 'collect',
    difficulty: 'easy',
    objectives: [
      { type: 'collect', target: 'shadow-essence', required: 3, current: 0 },
      { type: 'collect', target: 'wolf-pelt', required: 5, current: 0 }
    ],
    rewards: {
      gold: 1000,
      xp: 500,
      items: [
        { id: 'merchants-favor', name: 'Merchant\'s Favor', icon: '💳', rarity: 'uncommon', quantity: 1, type: 'consumable' }
      ],
      reputation: { faction: 'Independent', amount: 150 }
    },
    timeLimit: 1800,
    requiredLevel: 1
  },
  {
    title: 'Skill Mastery Test',
    description: 'Demonstrate your growing abilities by reaching certain skill thresholds.',
    type: 'skill',
    difficulty: 'medium',
    objectives: [
      { type: 'skill', target: 'combat', required: 5, current: 0 },
      { type: 'skill', target: 'tracking', required: 3, current: 0 }
    ],
    rewards: {
      gold: 3000,
      xp: 2000,
      items: [
        { id: 'skill-tome', name: 'Skill Enhancement Tome', icon: '📚', rarity: 'epic', quantity: 1, type: 'consumable' }
      ],
      reputation: { faction: 'Crystal Wardens', amount: 300 }
    },
    timeLimit: 10800,
    requiredLevel: 10
  }
];

export const QuestsPanel: React.FC<QuestsPanelProps> = ({
  playerStats,
  playerProfile,
  updatePlayerProfile,
  addToInventory,
  updatePlayerGold
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'npcs'>('available');
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);

  const activeQuests = playerProfile.activeQuests || [];
  const completedQuestIds = playerProfile.completedQuests || [];
  const reputation = playerProfile.reputation || {};

  const getAvailableQuests = () => {
    return questTemplates
      .filter(quest => 
        playerProfile.level >= quest.requiredLevel &&
        !completedQuestIds.includes(quest.title) &&
        !activeQuests.some((aq: Quest) => aq.title === quest.title)
      )
      .map((template, index) => ({
        ...template,
        id: `quest-${index}`,
        giver: questNPCs[Math.floor(Math.random() * questNPCs.length)].id,
        isActive: false,
        isCompleted: false
      }));
  };

  const acceptQuest = (quest: Quest) => {
    if (activeQuests.length >= 5) {
      toast.error("Quest limit reached", {
        description: "You can only have 5 active quests at once"
      });
      return;
    }

    const newQuest = { ...quest, isActive: true, startTime: Date.now() };
    const updatedActiveQuests = [...activeQuests, newQuest];
    
    updatePlayerProfile({ activeQuests: updatedActiveQuests });
    
    toast.success(`Quest accepted: ${quest.title}`, {
      description: quest.description
    });
  };

  const completeQuest = (quest: Quest) => {
    const isComplete = quest.objectives.every(obj => obj.current >= obj.required);
    
    if (isComplete) {
      // Give rewards
      updatePlayerGold(playerProfile.gold + quest.rewards.gold);
      updatePlayerProfile({ 
        xp: playerProfile.xp + quest.rewards.xp,
        completedQuests: [...completedQuestIds, quest.id],
        activeQuests: activeQuests.filter((aq: Quest) => aq.id !== quest.id)
      });

      // Add items
      quest.rewards.items?.forEach(item => addToInventory(item));

      // Update reputation
      if (quest.rewards.reputation) {
        const newReputation = { ...reputation };
        newReputation[quest.rewards.reputation.faction] = 
          (newReputation[quest.rewards.reputation.faction] || 0) + quest.rewards.reputation.amount;
        updatePlayerProfile({ reputation: newReputation });
      }

      toast.success(`Quest completed: ${quest.title}!`, {
        description: `+${quest.rewards.gold} gold, +${quest.rewards.xp} XP`,
        action: {
          label: "View Rewards",
          onClick: () => {
            toast.info("Quest Rewards", {
              description: `Items: ${quest.rewards.items?.map(i => i.name).join(', ') || 'None'}`
            });
          }
        }
      });
    }
  };

  const abandonQuest = (quest: Quest) => {
    const updatedActiveQuests = activeQuests.filter((aq: Quest) => aq.id !== quest.id);
    updatePlayerProfile({ activeQuests: updatedActiveQuests });
    
    toast.info(`Quest abandoned: ${quest.title}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  const getObjectiveProgress = (objective: any) => {
    const current = Math.min(objective.current, objective.required);
    return (current / objective.required) * 100;
  };

  const getReputationLevel = (rep: number) => {
    if (rep < 0) return 'Hostile';
    if (rep < 100) return 'Neutral';
    if (rep < 500) return 'Friendly';
    if (rep < 1000) return 'Honored';
    return 'Exalted';
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Scroll className="h-5 w-5 text-orange-400" />
        <h2 className="text-lg font-bold">Quests</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={activeTab === 'available' ? 'default' : 'outline'}
          onClick={() => setActiveTab('available')}
        >
          Available
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'active' ? 'default' : 'outline'}
          onClick={() => setActiveTab('active')}
          className="relative"
        >
          Active
          {activeQuests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeQuests.length}
            </span>
          )}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'npcs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('npcs')}
        >
          NPCs
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'available' && (
          <>
            {getAvailableQuests().map(quest => (
              <div key={quest.id} className="p-4 border-2 border-orange-500/30 rounded-lg bg-gradient-to-r from-orange-950/20 to-orange-900/10 hover:border-orange-400/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-orange-300">{quest.title}</h3>
                      <span className={`text-sm ${getDifficultyColor(quest.difficulty)}`}>
                        {getDifficultyIcon(quest.difficulty)}
                      </span>
                      <span className="text-xs text-gray-400">Lv.{quest.requiredLevel}+</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
                    
                    {/* Objectives */}
                    <div className="text-xs text-orange-200 mb-2">
                      Objectives:
                      {quest.objectives.map((obj, i) => (
                        <div key={i} className="ml-2">
                          • {obj.type} {obj.required} {obj.target.replace('-', ' ')}
                        </div>
                      ))}
                    </div>

                    {/* Rewards */}
                    <div className="text-xs text-green-400">
                      Rewards: {quest.rewards.gold} gold, {quest.rewards.xp} XP
                      {quest.rewards.items && `, ${quest.rewards.items.map(i => i.name).join(', ')}`}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => acceptQuest(quest)}
                    className="bg-orange-600 hover:bg-orange-500"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'active' && (
          <>
            {activeQuests.map((quest: Quest) => {
              const isComplete = quest.objectives.every(obj => obj.current >= obj.required);
              const timeRemaining = quest.timeLimit ? quest.timeLimit - (Date.now() - (quest.startTime || 0)) / 1000 : null;
              const isExpired = timeRemaining !== null && timeRemaining <= 0;

              return (
                <div key={quest.id} className={`p-4 border-2 rounded-lg transition-all ${
                  isComplete ? 'border-green-500/50 bg-gradient-to-r from-green-950/20 to-green-900/10' :
                  isExpired ? 'border-red-500/50 bg-gradient-to-r from-red-950/20 to-red-900/10' :
                  'border-blue-500/30 bg-gradient-to-r from-blue-950/20 to-blue-900/10'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${isComplete ? 'text-green-300' : 'text-blue-300'}`}>
                          {quest.title}
                        </h3>
                        {isComplete && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {isExpired && <XCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      
                      {/* Time Remaining */}
                      {timeRemaining !== null && !isExpired && (
                        <div className="flex items-center gap-2 mb-2 text-xs text-yellow-400">
                          <Clock className="h-3 w-3" />
                          {Math.floor(timeRemaining / 60)}m {Math.floor(timeRemaining % 60)}s remaining
                        </div>
                      )}

                      {/* Objectives Progress */}
                      <div className="space-y-2 mb-3">
                        {quest.objectives.map((obj, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">
                                {obj.type} {obj.target.replace('-', ' ')}: {obj.current}/{obj.required}
                              </span>
                              <span className={obj.current >= obj.required ? 'text-green-400' : 'text-gray-400'}>
                                {Math.round(getObjectiveProgress(obj))}%
                              </span>
                            </div>
                            <Progress value={getObjectiveProgress(obj)} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isComplete && (
                        <Button 
                          size="sm"
                          onClick={() => completeQuest(quest)}
                          className="bg-green-600 hover:bg-green-500"
                        >
                          Complete
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => abandonQuest(quest)}
                      >
                        Abandon
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {activeQuests.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Scroll className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active quests</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'npcs' && (
          <>
            {questNPCs.map(npc => {
              const rep = reputation[npc.faction] || 0;
              const repLevel = getReputationLevel(rep);
              
              return (
                <div key={npc.id} className="p-4 border-2 border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-950/20 to-purple-900/10 hover:border-purple-400/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{npc.icon}</div>
                    <div>
                      <h3 className="font-semibold text-purple-300">{npc.name}</h3>
                      <div className="text-sm text-gray-400">{npc.location}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        <span className="text-purple-400">{npc.faction}</span>
                        <span className={`${
                          repLevel === 'Hostile' ? 'text-red-400' :
                          repLevel === 'Neutral' ? 'text-gray-400' :
                          repLevel === 'Friendly' ? 'text-green-400' :
                          repLevel === 'Honored' ? 'text-blue-400' :
                          'text-yellow-400'
                        }`}>
                          {repLevel} ({rep})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 italic mb-3">
                    "{npc.dialogue.greeting}"
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Available Quests: {getAvailableQuests().filter(q => q.giver === npc.id).length}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedNPC(selectedNPC === npc.id ? null : npc.id)}
                      className="border-purple-600 text-purple-400"
                    >
                      {selectedNPC === npc.id ? 'Close' : 'Talk'}
                    </Button>
                  </div>
                  
                  {selectedNPC === npc.id && (
                    <div className="mt-3 p-3 bg-purple-950/30 rounded border border-purple-600/30">
                      <div className="text-sm text-purple-200 italic mb-2">
                        "{npc.dialogue.questAvailable}"
                      </div>
                      <div className="space-y-2">
                        {getAvailableQuests().filter(q => q.giver === npc.id).map(quest => (
                          <div key={quest.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{quest.title}</span>
                            <Button 
                              size="sm"
                              onClick={() => acceptQuest(quest)}
                              className="bg-purple-600 hover:bg-purple-500"
                            >
                              Accept
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};