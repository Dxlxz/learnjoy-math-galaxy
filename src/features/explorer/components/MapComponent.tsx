import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Topic } from '@/types/explorer';

interface MapComponentProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ topics, onTopicSelect }) => {
  return (
    <MapContainer center={[0, 0]} zoom={2} className="h-96">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {topics.map((topic) => (
        topic.map_coordinates && (
          <Marker
            key={topic.id}
            position={[topic.map_coordinates.latitude, topic.map_coordinates.longitude]}
            eventHandlers={{
              click: () => {
                onTopicSelect(topic);
              },
            }}
          >
            <Popup>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;
