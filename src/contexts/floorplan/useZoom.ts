
import { useState } from 'react';

export function useZoom(initialZoom: number = 1) {
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut
  };
}
