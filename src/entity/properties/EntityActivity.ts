type EntityAction = 'forward' | 'backward' | 'left' | 'right' | 'top' | 'down' | 'jump' | 'push' | 'hit' | 'shift';

export type EntityActivity = Record<EntityAction, boolean>;
