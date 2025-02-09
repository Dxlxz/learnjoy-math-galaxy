import React from 'react';
import { Content } from '@/types/explorer';
import { Button } from '@/components/ui/button';

interface ContentListProps {
  contents: Content[];
  onContentClick: (content: Content) => void;
}

const ContentList: React.FC<ContentListProps> = ({ contents, onContentClick }) => {
  if (!contents || contents.length === 0) {
    return <p className="text-sm text-gray-500">No content available for this topic.</p>;
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary">Content</h4>
      {contents.map((content) => (
        <Button
          key={content.id}
          variant="secondary"
          className="w-full justify-start text-sm"
          onClick={() => onContentClick(content)}
        >
          {content.title}
        </Button>
      ))}
    </div>
  );
};

export default ContentList;

