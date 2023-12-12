import { SurfaceType } from 'src/surface/SurfaceType';
import { SurfaceTypeConfig } from 'src/surface/SurfaceTypeConfig';

const SurfaceConfigMap: Record<SurfaceType, SurfaceTypeConfig> = {
  [SurfaceType.Void] : {
    type: SurfaceType.Void,
    color: 0x000000,
    maxUnit: 0,
    maxHeight: -200,
  },
  [SurfaceType.DeepOcean] : {
    type: SurfaceType.DeepOcean,
    color: 0x001166,
    maxUnit: 0.3,
    maxHeight: -100,
  },
  [SurfaceType.Ocean] : {
    type: SurfaceType.Ocean,
    color: 0x998811,
    //color: 0x003399,
    maxUnit: 0.42,
    maxHeight: -30,
  },
  [SurfaceType.DeepBeach] : {
    type: SurfaceType.DeepBeach,
    color: 0xBBAA33,
    //color: 0x0077aa,
    maxUnit: 0.47,
    maxHeight: -5,
  },
  [SurfaceType.Beach] : {
    type: SurfaceType.Beach,
    color: 0xFFAA66,
    maxUnit: 0.52,
    maxHeight: 2,
  },
  [SurfaceType.Seaside] : {
    type: SurfaceType.Seaside,
    color: 0x229922,
    maxUnit: 0.54,
    maxHeight: 7,
  },
  [SurfaceType.Plain] : {
    type: SurfaceType.Plain,
    color: 0x118811,
    maxUnit: 0.7,
    maxHeight: 14,
  },
  [SurfaceType.Hill] : {
    type: SurfaceType.Hill,
    color: 0x336600,
    maxUnit: 0.75,
    maxHeight: 30,
  },
  [SurfaceType.Rock] : {
    type: SurfaceType.Rock,
    color: 0x888888,
    maxUnit: 0.85,
    maxHeight: 60,
  },
  [SurfaceType.Mountain] : {
    type: SurfaceType.Mountain,
    color: 0xF6E6E6,
    maxUnit: 1,
    maxHeight: 120,
  },
  [SurfaceType.MountainPeak] : {
    type: SurfaceType.MountainPeak,
    color: 0xFAF0F0,
    maxUnit: 1.2,
    maxHeight: 250,
  },
  [SurfaceType.MountainSpike] : {
    type: SurfaceType.MountainSpike,
    color: 0xFFFFFF,
    maxUnit: 2,
    maxHeight: 400,
  },
}
export const SurfaceConfig: SurfaceTypeConfig[] = Object.values(SurfaceConfigMap);
