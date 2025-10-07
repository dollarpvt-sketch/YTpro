import React from 'react';
import HeroBanner from './HeroBanner';
import ToolsShowcase from './ToolsShowcase';
import RecentProjects from './RecentProjects';

interface DashboardProps {
  onSelectTool: (toolId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <HeroBanner />
      <RecentProjects />
      <ToolsShowcase onSelectTool={onSelectTool} />
    </div>
  );
};

export default Dashboard;
