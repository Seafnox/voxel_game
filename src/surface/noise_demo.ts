import { GameEngine } from 'src/engine/GameEngine';
import { SurfaceConfigProperty } from 'src/surface/SurfaceConfigProperty';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { SurfaceMapProperty } from 'src/surface/SurfaceMapProperty';
import { PseudoRandomizer } from 'src/utils/PseudoRandomizer';

const randomizer = new PseudoRandomizer(123);
const engine = new GameEngine(randomizer.next.bind(randomizer));
engine.properties.register(SurfaceConfigProperty);
engine.properties.register(SurfaceMapProperty);
const surfaceHelper = engine.systems.register(SurfaceHelperSystem);
surfaceHelper.generateSurface(randomizer.next.bind(randomizer),50, 150);
const map = surfaceHelper.surface;

const colorMap: Record<string, string> = {
  '0':       '\x1b[40m\x1b[30m_ _\x1b[0m', // бездна
  '139':     '\x1b[44m\x1b[34m_ _\x1b[0m', // впадины
  '255':     '\x1b[44m\x1b[34m* *\x1b[0m', // океаны
  '191255':   '\x1b[46m\x1b[36m* *\x1b[0m', // прибрежные воды
  '24416496':  '\x1b[43m\x1b[33m_ _\x1b[0m', // берег
  '3413934':   '\x1b[42m\x1b[32m_ _\x1b[0m', // низменость
  '1280':     '\x1b[42m\x1b[32m. .\x1b[0m', // равнина
  '1000':    '\x1b[100m\x1b[90m_ _\x1b[0m', // предгорье
  '128128128':'\x1b[100m\x1b[90m^ ^\x1b[0m', // горы
  '245230230': '\x1b[47m\x1b[37m" "\x1b[0m', // снега
  '250240240': '\x1b[47m\x1b[37m* *\x1b[0m', // пики
  'FFFFFF': '\x1b[47m\x1b[37m* *\x1b[0m', // пики
};
map.forEach(row => {
  const heights: string[] = [];
  const heights2: string[] = [];
  const colorString = row.map(({x,y,unit}) => {
    heights.push(unit.toFixed(2));
    heights2.push(surfaceHelper.getSurfaceUnit(x, y).toFixed(2));

    const color = surfaceHelper.getSurfacePointColor(x,y).toString(16);
    return colorMap[color] || '\x1b[0m? ?\x1b[0m';
  }).join('');

//  console.log(heights.join(' '));
//  console.log(heights2.join(' '));
  console.log(colorString);
});
// console.log(map.map(row => row.map(point => point.value.toFixed(1)).join(' ')).join('\n'))

