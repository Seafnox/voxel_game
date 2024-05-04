import '../node_modules/normalize.css/normalize.css';
import './resources/base.css';
import { PseudoRandomizer } from './utils/PseudoRandomizer';
import { VMath } from './VMath';
import { VoxelGame } from './VoxelGame';

// FIXME import randomizer into engine and refactor Math.random
const randomizer = new PseudoRandomizer(1152372536);
VMath.random = randomizer.next.bind(randomizer);

new VoxelGame(randomizer);
