import { SurfaceBuilder } from './SurfaceBuilder';

const surfaceBuilder = new SurfaceBuilder(0.04);
const map = surfaceBuilder.getSurfaceMap(100, 200);

const colorMap: Record<string, string> = {
  '000': '\x1b[40m\x1b[30m_\x1b[0m', // бездна
  '00139': '\x1b[44m\x1b[34m_\x1b[0m', // впадины
  '00255': '\x1b[44m\x1b[34m*\x1b[0m', // океаны
  '0191255': '\x1b[46m\x1b[36m*\x1b[0m', // прибрежные воды
  '24416496': '\x1b[43m\x1b[33m_\x1b[0m', // берег
  '3413934': '\x1b[42m\x1b[32m_\x1b[0m', // низменость
  '01280': '\x1b[42m\x1b[32m.\x1b[0m', // равнина
  '01000': '\x1b[100m\x1b[90m_\x1b[0m', // предгорье
  '128128128': '\x1b[100m\x1b[90m^\x1b[0m', // горы
  '255250250': '\x1b[47m\x1b[37m"\x1b[0m', // снега
  '255255255': '\x1b[47m\x1b[37m*\x1b[0m', // пики
};
map.forEach(row => {
  const colorString = row.map(point => {
    const color = point.color.map(v => v.toString()).join('');
    return colorMap[color] || '\x1b[0m?\x1b[0m';
  }).join('');

  console.log(colorString);
});
// console.log(map.map(row => row.map(point => point.value.toFixed(1)).join(' ')).join('\n'))

