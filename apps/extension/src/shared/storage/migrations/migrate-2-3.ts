import { produce } from 'immer';

import { isString } from '@leather.io/utils';

import type { RootState } from '@app/store';

export function migrateMultiWalletSupport(state: RootState) {
  console.log('RUNNING MULTI WALLET MIGRATION');
  return produce(state, (draftState: any) => {
    const salt = (state.softwareKeys.entities.default as any).salt;
    if (isString(salt)) {
      // Move `salt` to top level of softwareKeys slice
      draftState.softwareKeys.salt = salt;
      // Remove `salt` from the default key entity
      draftState.softwareKeys.entities.default.salt = undefined;
    }
  });
}
