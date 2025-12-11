import { Link } from 'react-router';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Stack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { formatCurrency } from '@app/common/currency-formatter';
import { emptyAmountPlaceholder } from '@app/components/balance/constants';
import { PromoBanner } from '@app/features/promo-banner/promo-banner';
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
        <Box mt="space.04">
          <Link to={RouteUrls.MultiWalletTest}>
            <Button variant="outline" size="sm">
              Multi-Wallet Testing
            </Button>
          </Link>
        </Box>
      </Box>
    </Stack>
  );
}
