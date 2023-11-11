type UserAction = 'forward' | 'backward' | 'left' | 'right' | 'top' | 'down' | 'jump' | 'push' | 'hit' | 'shift';

export type ActivityStatus = Record<UserAction, boolean>;
