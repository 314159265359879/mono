import { bytesToHex } from '@stacks/common';
import { decryptMnemonic as decrypt, encryptMnemonic as encrypt } from '@stacks/encryption';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, HStack, Stack } from 'leather-styles/jsx';

import {
  deriveRootKeychainFromMnemonic,
  generateMnemonic,
  getMnemonicRootKeyFingerprint,
} from '@leather.io/crypto';
import { userAddsWallet } from '@leather.io/state/wallet';
import { Button } from '@leather.io/ui';
import { toHexString } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { emptyAmountPlaceholder } from '@app/components/balance/constants';
import { PromoBanner } from '@app/features/promo-banner/promo-banner';
import { getWalletSessionKey } from '@app/store/session-restore';
import { keySlice } from '@app/store/software-keys/software-key.slice';
import { AccountCard } from '@app/ui/components/account/account.card';

import { AccountActions } from './components/account-actions';
import { useHomePageState } from './use-home-page-state';

export function Home() {
  const {
    balance,
    isFetchingBnsName,
    isPrivateMode,
    name,
    togglePrivateMode,
    toggleSwitchAccount,
  } = useHomePageState();

  return (
    <Stack
      data-testid={HomePageSelectors.HomePageContainer}
      px={['0', 'space.05']}
      py={['0', 'space.07']}
      gap={['0', 'space.06']}
      width="100%"
      bg="ink.1"
      borderRadius="lg"
      animation="fadein"
      animationDuration="500ms"
    >
      <Box px={['space.05', 0]} pb={['space.05', 0]}>
        <AccountCard
          name={name}
          availableBalance={
            balance.state !== 'success' ? emptyAmountPlaceholder : formatCurrency(balance.value)
          }
          totalBalance={
            balance.state !== 'success' ? emptyAmountPlaceholder : formatCurrency(balance.value)
          }
          toggleSwitchAccount={() => toggleSwitchAccount()}
          isFetchingBnsName={isFetchingBnsName}
          isLoadingBalance={balance.state === 'loading'}
          isLoadingAdditionalData={balance.state === 'loading'}
          isBalancePrivate={isPrivateMode}
          onShowBalance={togglePrivateMode}
        >
          <AccountActions />
        </AccountCard>
        <PromoBanner />
        <br />
        <HStack gap="space.03">
          <Button
            onClick={() => (window as any).debug.setLeatherDevWalletSoftware()}
            variant="outline"
            size="sm"
          >
            Reset to software dev 2 wallet
          </Button>
          <Button
            onClick={() => (window as any).debug.setLeatherDevWalletLedger()}
            variant="outline"
            size="sm"
          >
            Reset to ledger dev 2 wallet
          </Button>
          <Button
            onClick={() => chrome.storage.session.clear().then(() => console.log('cleared'))}
            variant="outline"
            size="sm"
          >
            clear session storage
          </Button>
          <Button
            onClick={async () => {
              const mnemonic = generateMnemonic();
              console.log(mnemonic);
              const keychain = await deriveRootKeychainFromMnemonic(mnemonic);
              console.log(keychain);
              const derivedKey = await getWalletSessionKey();

              if (!derivedKey.success) return;
              console.log({ derivedKey: derivedKey.data });
              const encryptedMnemonic = await encrypt(mnemonic, derivedKey.data);
              console.log({ encryptedMnemonic: bytesToHex(encryptedMnemonic) });
              const decrypted = await decrypt(encryptedMnemonic, derivedKey.data);
              console.log({ decrypted });

              dispatch(
                userAddsWallet({
                  wallet: {
                    createdOn: new Date().toISOString(),
                    fingerprint: getMnemonicRootKeyFingerprint(mnemonic),
                    type: 'software',
                  },
                  accountKeychains: [],
                })
              );

              dispatch(
                keySlice.actions.addNewWallet({
                  type: 'software',
                  id: toHexString(keychain.fingerprint),
                  encryptedSecretKey: bytesToHex(encryptedMnemonic),
                })
              );
            }}
            variant="outline"
            size="sm"
          >
            Add new mnemonic
          </Button>
        </HStack>

        <pre>{JSON.stringify(keys, null, 2)}</pre>
      </Box>
      {/* {whenPageMode({ full: <FeedbackButton />, popup: null })}
      <HomeTabs>
        <ModalBackgroundWrapper>
          <Route index element={<Assets />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {homePageModalRoutes}
          </Route>
          <Route path={RouteUrls.Collectibles} element={<Collectibles />}>
            {homePageModalRoutes}
          </Route>
          {homePageModalRoutes}
        </ModalBackgroundWrapper>
      </HomeTabs> */}
    </Stack>
  );
}
