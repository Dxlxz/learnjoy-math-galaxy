
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Lock } from 'lucide-react';
import { MapStyle } from '@/types/map';

interface MapMarkerProps {
  topic: {
    id: string;
    title: string;
    prerequisites_met: boolean;
    map_style?: MapStyle | null;
  };
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ topic, onClick }) => {
  const isLocked = !topic.prerequisites_met;
  const defaultStyle = { icon: 'castle', color: '#6366F1' };
  const style = topic.map_style || defaultStyle;

  return (
    <div 
      className={`topic-marker`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 ${isLocked ? 'bg-gray-400' : `bg-[${style.color}]`} rounded-full 
                   flex items-center justify-center text-white shadow-lg 
                   transform transition-all duration-300 
                   ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:scale-110 cursor-pointer animate-bounce-slow'}
                   relative overflow-hidden`}>
        {isLocked ? (
          <>
            <div className="absolute inset-0 bg-black/10"></div>
            <Lock />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </>
        )}
      </div>
      <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    whitespace-nowrap text-sm font-medium px-2 py-1 
                    ${isLocked ? 'text-gray-500' : 'text-primary'} 
                    bg-white rounded-full shadow-md animate-fade-in`}>
        {topic.title}
      </div>
    </div>
  );
};

export default MapMarker;
