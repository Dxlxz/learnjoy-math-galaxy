
import React from 'react';
import { Lock } from 'lucide-react';
import { MapStyle } from '@/types/map';
import { motion, AnimatePresence } from 'framer-motion';

interface MapMarkerProps {
  topic: {
    id: string;
    title: string;
    prerequisites_met: boolean;
    map_style?: MapStyle | null;
  };
  onClick: () => void;
  isLoading?: boolean;
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const MapMarker: React.FC<MapMarkerProps> = ({ topic, onClick, isLoading = false }) => {
  const isLocked = !topic.prerequisites_met;
  const defaultStyle = { icon: 'castle', color: '#6366F1' };
  const style = topic.map_style || defaultStyle;

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`topic-marker relative`}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`w-16 h-16 ${isLocked ? 'bg-gray-400' : `bg-[${style.color}]`} rounded-full 
                     flex items-center justify-center text-white shadow-lg 
                     relative overflow-hidden
                     ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          animate={isLoading ? pulseAnimation : {}}
        >
          {isLoading ? (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            />
          ) : isLocked ? (
            <>
              <div className="absolute inset-0 bg-black/10" />
              <Lock className="relative z-10" />
            </>
          ) : (
            <>
              <motion.div 
                className="absolute inset-0 bg-white/10"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="relative z-10"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </>
          )}
        </motion.div>
        
        <AnimatePresence>
          <motion.div 
            className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                      whitespace-nowrap text-sm font-medium px-2 py-1 
                      ${isLocked ? 'text-gray-500' : 'text-primary'} 
                      bg-white rounded-full shadow-md`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {topic.title}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MapMarker;
