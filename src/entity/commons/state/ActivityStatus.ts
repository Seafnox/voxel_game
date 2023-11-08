type UserAction = 'forward' | 'left' | 'backward' | 'right' | 'jump' | 'push' | 'hit' | 'shift';

export type ActivityStatus = Record<UserAction, boolean>;
