
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Topic } from '@/types/topic';

interface PathVisualizerProps {
  map: mapboxgl.Map;
  topic: Topic;
  topics: Topic[];
}

const PathVisualizer: React.FC<PathVisualizerProps> = ({ map, topic, topics }) => {
  React.useEffect(() => {
    if (!topic.prerequisites?.required_topics) return;

    // Remove existing paths for this topic
    const pathLayers = map.getStyle().layers.filter(layer => 
      layer.id.startsWith(`path-${topic.id}`)
    );
    pathLayers.forEach(layer => {
      map.removeLayer(layer.id);
      map.removeSource(layer.id);
    });

    // Draw new paths to prerequisites
    topic.prerequisites.required_topics.forEach(prereqId => {
      const prereqTopic = topics.find(t => t.id === prereqId);
      if (!prereqTopic?.map_coordinates || !topic.map_coordinates) return;

      const pathId = `path-${topic.id}-${prereqId}`;
      const pathStyle = topic.path_style || {
        color: '#9CA3AF',
        width: 2,
        dash_pattern: [2, 2],
        animation_speed: 1
      };

      map.addSource(pathId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [prereqTopic.map_coordinates.longitude, prereqTopic.map_coordinates.latitude],
              [topic.map_coordinates.longitude, topic.map_coordinates.latitude]
            ]
          }
        }
      });

      map.addLayer({
        id: pathId,
        type: 'line',
        source: pathId,
        paint: {
          'line-color': pathStyle.color,
          'line-width': pathStyle.width,
          'line-dasharray': pathStyle.dash_pattern
        }
      });
    });

    return () => {
      // Cleanup paths on unmount
      const pathLayers = map.getStyle().layers.filter(layer => 
        layer.id.startsWith(`path-${topic.id}`)
      );
      pathLayers.forEach(layer => {
        map.removeLayer(layer.id);
        map.removeSource(layer.id);
      });
    };
  }, [map, topic, topics]);

  return null;
};

export default PathVisualizer;
