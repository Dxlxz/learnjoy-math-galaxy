
import React from 'react';
import { Card } from '@/components/ui/card';
import { Play, FileText } from 'lucide-react';
import { Content } from '@/types/shared';

interface ContentListProps {
  content: Content[];
  prerequisitesMet: boolean;
  onContentClick: (content: Content) => void;
}

const ContentList: React.FC<ContentListProps> = ({ content, prerequisitesMet, onContentClick }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary">Learning Content</h4>
      {content?.filter(content => 
        content.type === 'video' || content.type === 'worksheet'
      ).map((content) => (
        <Card
          key={content.id}
          className={`p-4 cursor-pointer transition-colors ${
            prerequisitesMet 
              ? 'hover:bg-primary-50' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => prerequisitesMet && onContentClick(content)}
        >
          <div className="flex items-center space-x-3">
            {content.type === 'video' ? (
              <Play className="h-5 w-5 text-primary-500" />
            ) : (
              <FileText className="h-5 w-5 text-primary-500" />
            )}
            <span>{content.title}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContentList;
