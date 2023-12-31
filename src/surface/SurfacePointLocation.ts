import { SurfacePoint } from 'src/surface/SurfaceBuilder';

export interface SurfacePointLocation {
  leftTop: SurfacePoint;
  leftBottom: SurfacePoint;
  rightTop: SurfacePoint;
  rightBottom: SurfacePoint;
  position: {
    x: number;
    y: number;
  };
}
