import { produce } from 'immer';

import { extractFingerprintFromDescriptor } from '@leather.io/crypto';
import { isString } from '@leather.io/utils';

import type { RootState } from '@app/store';

export function migrateMultiWalletSupport(state: RootState) {
  console.log('RUNNING MULTI WALLET MIGRATION');
  return produce(state, (draftState: any) => {
    //
    // Migrate salt from:
    // state.softwareKeys.entities.default.salt → state.softwareKeys.salt
    const defaultSoftwareWallet = draftState.softwareKeys?.entities?.default;
    if (defaultSoftwareWallet && isString(defaultSoftwareWallet.salt)) {
      // Move `salt` to top level of softwareKeys slice
      draftState.softwareKeys.salt = defaultSoftwareWallet.salt;
      // Remove `salt` from the default key entity
      draftState.softwareKeys.entities.default.salt = undefined;
    }

    //
    // Migrate ledger wallets to `wallets` slice
    // state.ledger.bitcoin.entities & state.ledger.stacks.entities
    // → state.wallets.entities
    const bitcoinEntities = draftState.ledger?.bitcoin?.entities ?? {};
    const stacksEntities = draftState.ledger?.stacks?.entities ?? {};

    const hasLedgerAccounts =
      Object.keys(bitcoinEntities).length > 0 || Object.keys(stacksEntities).length > 0;

    if (hasLedgerAccounts) {
      //
      // Extract the wallet fingerprint from the first Bitcoin "policy" string
      // e.g. "[48611587/84'/0'/0']xpub..." → "48611587"
      let ledgerFingerprint: string | undefined;

      for (const entity of Object.values(bitcoinEntities)) {
        const policy = (entity as any).policy as string;
        if (entity && isString(policy))
          ledgerFingerprint = extractFingerprintFromDescriptor(policy);
      }

      //
      // 3. Ensure wallets slice is initialized
      if (!draftState.wallets) {
        draftState.wallets = { ids: [], entities: {} };
      }

      if (ledgerFingerprint) {
        const wallets = draftState.wallets;
        const id = ledgerFingerprint;

        //
        // 4. Create the ledger wallet if it does not exist
        if (!wallets.entities[id]) {
          wallets.entities[id] = { id, name: 'My Ledger', type: 'ledger' };
        }
        if (!wallets.ids.includes(id)) wallets.ids.push(id);
      }
    }
  });
}
