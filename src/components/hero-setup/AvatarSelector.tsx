
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

const AVATAR_OPTIONS = [
  'warrior.png',
  'mage.png',
  'archer.png',
  'knight.png',
  'wizard.png'
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
  return (
    <div>
      <Label className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        Choose Your Avatar
      </Label>
      <div className="mt-2">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {AVATAR_OPTIONS.map((avatar, index) => (
              <CarouselItem key={avatar}>
                <div 
                  className={`aspect-square rounded-lg border-4 cursor-pointer transition-all ${
                    selectedAvatar === avatar ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => onSelect(avatar)}
                >
                  <img
                    src={`/avatars/${avatar}`}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
