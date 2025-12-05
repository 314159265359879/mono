import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Box, Stack, styled } from 'leather-styles/jsx';

import { assertUnreachable } from '@leather.io/utils';
import { type SerializedCryptoAssetId, deserializeAssetId } from '@leather.io/utils';

interface TokenDetailsRouteParams {
  assetId: SerializedCryptoAssetId;
}

export function TokenDetails() {
  const { assetId } = useParams<TokenDetailsRouteParams>();

  const parsedAssetId = useMemo(() => {
    if (!assetId) return null;
    return deserializeAssetId(assetId);
  }, [assetId]);

  if (!parsedAssetId) {
    return (
      <Box px="space.05" py="space.04">
        <styled.p textStyle="body.02">Token not found.</styled.p>
      </Box>
    );
  }

  const { protocol, id } = parsedAssetId;

  switch (protocol) {
    case 'nativeBtc':
    case 'nativeStx':
    case 'sip10':
    case 'rune':
    case 'stamp':
    case 'sip9':
    case 'inscription':
      return (
        <Stack gap="space.04" px="space.05" py="space.04">
          <styled.h1 textStyle="heading.03" margin="0">
            Token details
          </styled.h1>
          <styled.p textStyle="body.02" color="ink.text-subdued" margin="0">
            Protocol: {protocol}
          </styled.p>
          <styled.p textStyle="body.02" color="ink.text-subdued" margin="0">
            Id: {id}
          </styled.p>
        </Stack>
      );
    default:
      assertUnreachable(protocol);
      return (
        <Box px="space.05" py="space.04">
          <styled.p textStyle="body.02">
            Unsupported token protocol for details view.
          </styled.p>
        </Box>
      );
  }
}
