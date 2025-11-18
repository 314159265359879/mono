import { decryptMnemonic as decrypt } from '@stacks/encryption';
import z from 'zod';

import { logger } from '@shared/logger';

import { store } from '@app/store';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import {
  selectDefaultSoftwareKey,
  selectSoftwareKeys,
} from '@app/store/software-keys/software-key.selectors';

export async function initalizeWalletSession(encryptionKey: string) {
  return chrome.storage.session.set({ encryptionKey });
}

export async function clearWalletSession() {
  return chrome.storage.session.remove('encryptionKey');
}

export async function getWalletSessionKey() {
  const key = await chrome.storage.session.get(['encryptionKey']);
  return z.string().safeParse(key.encryptionKey);
}

export async function restoreWalletSession() {
  const keyResult = await getWalletSessionKey();

  if (!keyResult.success) return;

  try {
    const encryptedKeys = selectSoftwareKeys(store.getState());

    const currentKey = selectDefaultSoftwareKey(store.getState());

    if (currentKey?.type === 'software') {
      const allSecretKeys = await Promise.all(
        encryptedKeys.map(async softwareKey => {
          const secretKey = await decrypt(softwareKey.encryptedSecretKey, keyResult.data);
          return [softwareKey.id, secretKey];
        })
      );

      console.log({ allSecretKeys });

      const secretKey = await decrypt(currentKey.encryptedSecretKey, keyResult.data);
      store.dispatch(inMemoryKeyActions.setDefaultKey(secretKey));
      store.dispatch(inMemoryKeyActions.setWalletKeys(Object.fromEntries(allSecretKeys)));
    }
  } catch {
    logger.error('Failed to decrypt secret key');
  }
}
