
export interface MapStyle {
  icon: string;
  color: string;
}

export interface MapCoordinates {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MapRegion {
  name: string;
  color: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface PathStyle {
  color: string;
  width: number;
  dash_pattern: number[];
  animation_speed: number;
}
