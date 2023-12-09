import { PseudoRandomizer } from 'src/utils/PseudoRandomizer';
import { SurfaceFactor } from 'src/surface/SurfaceFactor';

const surfaceFactor = new SurfaceFactor();
const randomizer = new PseudoRandomizer(123);
surfaceFactor.generateSurface(randomizer.next.bind(randomizer),50, 150);
const map = surfaceFactor.surfaceMap;

const colorMap: Record<string, string> = {
  '000':       '\x1b[40m\x1b[30m_ _\x1b[0m', // бездна
  '00139':     '\x1b[44m\x1b[34m_ _\x1b[0m', // впадины
  '00255':     '\x1b[44m\x1b[34m* *\x1b[0m', // океаны
  '0191255':   '\x1b[46m\x1b[36m* *\x1b[0m', // прибрежные воды
  '24416496':  '\x1b[43m\x1b[33m_ _\x1b[0m', // берег
  '3413934':   '\x1b[42m\x1b[32m_ _\x1b[0m', // низменость
  '01280':     '\x1b[42m\x1b[32m. .\x1b[0m', // равнина
  '01000':    '\x1b[100m\x1b[90m_ _\x1b[0m', // предгорье
  '128128128':'\x1b[100m\x1b[90m^ ^\x1b[0m', // горы
  '245230230': '\x1b[47m\x1b[37m" "\x1b[0m', // снега
  '250240240': '\x1b[47m\x1b[37m* *\x1b[0m', // пики
  '255255255': '\x1b[47m\x1b[37m* *\x1b[0m', // пики
};
map.forEach(row => {
  const heights: string[] = [];
  const heights2: string[] = [];
  const colorString = row.map(({x,y,height}) => {
    heights.push(height.toFixed(2));
    heights2.push(surfaceFactor.getSurfaceMapHeight(x, y).toFixed(2));

    const color = surfaceFactor.getSurfaceMapColor(x,y).map(v => v.toString()).join('');
    return colorMap[color] || '\x1b[0m? ?\x1b[0m';
  }).join('');

//  console.log(heights.join(' '));
//  console.log(heights2.join(' '));
  console.log(colorString);
});
// console.log(map.map(row => row.map(point => point.value.toFixed(1)).join(' ')).join('\n'))

