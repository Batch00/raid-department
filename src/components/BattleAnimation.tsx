import React, { useState, useEffect } from 'react';
import { Sword, Shield, Sparkles } from 'lucide-react';

interface BattleAnimationProps {
  isActive: boolean;
  monsterIcon: string;
  duration: number;
}

export const BattleAnimation: React.FC<BattleAnimationProps> = ({ 
  isActive, 
  monsterIcon, 
  duration 
}) => {
  const [animationPhase, setAnimationPhase] = useState<'attack' | 'defend' | 'special'>('attack');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration * 10)); // Update 10 times per second
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });

      // Change animation phase periodically
      if (Math.random() < 0.3) {
        const phases: Array<'attack' | 'defend' | 'special'> = ['attack', 'defend', 'special'];
        setAnimationPhase(phases[Math.floor(Math.random() * phases.length)]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, duration]);

  if (!isActive) return null;

  return (
    <div className="relative w-full h-16 bg-black/20 rounded-lg overflow-hidden border border-red-500/50">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-600 to-red-400 transition-all duration-100"
           style={{ width: `${progress}%` }} />
      
      {/* Battle scene */}
      <div className="flex items-center justify-between p-3 h-full">
        {/* Player side */}
        <div className="flex items-center gap-2">
          <div className={`transition-transform duration-200 ${
            animationPhase === 'attack' ? 'animate-pulse scale-110' : 
            animationPhase === 'defend' ? 'scale-95' : 'scale-105'
          }`}>
            {animationPhase === 'attack' && <Sword className="h-6 w-6 text-blue-400" />}
            {animationPhase === 'defend' && <Shield className="h-6 w-6 text-gray-400" />}
            {animationPhase === 'special' && <Sparkles className="h-6 w-6 text-yellow-400" />}
          </div>
          <span className="text-sm font-bold text-blue-300">🦸‍♂️</span>
        </div>

        {/* Battle effects */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full animate-ping ${
                  animationPhase === 'attack' ? 'bg-red-500' :
                  animationPhase === 'defend' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Monster side */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-red-300">{monsterIcon}</span>
          <div className={`transition-transform duration-200 ${
            animationPhase === 'attack' ? 'scale-95 animate-bounce' : 
            animationPhase === 'defend' ? 'scale-110' : 'scale-100'
          }`}>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Battle text */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
          {animationPhase === 'attack' && '⚔️ Attacking!'}
          {animationPhase === 'defend' && '🛡️ Defending!'}
          {animationPhase === 'special' && '✨ Special!'}
        </span>
      </div>
    </div>
  );
};