import * as migration_20260821_063837_initial from './20260821_063837_initial';

export const migrations = [
  {
    up: migration_20260821_063837_initial.up,
    down: migration_20260821_063837_initial.down,
    name: '20260821_063837_initial'
  },
];
