import React, { useState, createContext, useContext } from 'react';
import { WindowPanel, PanelType } from '@/types/gameTypes';

interface WindowManagerContextType {
  splitPanel: (panelId: string, direction: 'horizontal' | 'vertical') => void;
  setPanelType: (panelId: string, type: PanelType) => void;
  removePanel: (panelId: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
};

interface WindowManagerProviderProps {
  children: React.ReactNode;
  panels: WindowPanel;
  setPanels: React.Dispatch<React.SetStateAction<WindowPanel>>;
}

export const WindowManagerProvider: React.FC<WindowManagerProviderProps> = ({ 
  children, 
  panels, 
  setPanels 
}) => {
  const splitPanel = (panelId: string, direction: 'horizontal' | 'vertical') => {
    setPanels(prev => {
      const updatePanel = (panel: WindowPanel): WindowPanel => {
        if (panel.id === panelId && !panel.children) {
          // Convert leaf panel to container with two children
          return {
            ...panel,
            direction,
            children: [
              { id: `${panelId}-1`, type: panel.type, size: 50 },
              { id: `${panelId}-2`, type: 'empty', size: 50 }
            ],
            type: 'empty' // Container panels are empty
          };
        }
        
        if (panel.children) {
          return {
            ...panel,
            children: panel.children.map(updatePanel)
          };
        }
        
        return panel;
      };
      
      return updatePanel(prev);
    });
  };

  const setPanelType = (panelId: string, type: PanelType) => {
    setPanels(prev => {
      const updatePanel = (panel: WindowPanel): WindowPanel => {
        if (panel.id === panelId) {
          return { ...panel, type };
        }
        
        if (panel.children) {
          return {
            ...panel,
            children: panel.children.map(updatePanel)
          };
        }
        
        return panel;
      };
      
      return updatePanel(prev);
    });
  };

  const removePanel = (panelId: string) => {
    setPanels(prev => {
      const removeFromPanel = (panel: WindowPanel): WindowPanel | null => {
        if (panel.children) {
          const filteredChildren = panel.children
            .map(removeFromPanel)
            .filter((child): child is WindowPanel => child !== null);
          
          // If only one child remains, promote it up
          if (filteredChildren.length === 1) {
            return filteredChildren[0];
          }
          
          return {
            ...panel,
            children: filteredChildren
          };
        }
        
        return panel.id === panelId ? null : panel;
      };
      
      return removeFromPanel(prev) || { id: 'root', type: 'empty', direction: 'horizontal', children: [] };
    });
  };

  const contextValue: WindowManagerContextType = {
    splitPanel,
    setPanelType,
    removePanel
  };

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {children}
    </WindowManagerContext.Provider>
  );
};