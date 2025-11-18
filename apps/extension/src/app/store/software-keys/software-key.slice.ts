import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

interface KeyConfig {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
}
export const keyAdapter = createEntityAdapter<KeyConfig>();

export const initialKeysState = keyAdapter.getInitialState<{ salt?: string }>({});

export const keySlice = createSlice({
  name: 'softwareKeys',
  initialState: migrateVaultReducerStoreToNewStateStructure(initialKeysState),
  reducers: {
    createSoftwareWalletComplete(state, action: PayloadAction<KeyConfig>) {
      keyAdapter.upsertOne(state, action.payload);
    },

    addNewWallet(state, action: PayloadAction<KeyConfig>) {
      keyAdapter.addOne(state, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state as any, defaultWalletKeyId);
    },
  },
});
