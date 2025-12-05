import { toFetchState } from '@/components/loading';
import { useQuery } from '@tanstack/react-query';

import { FungibleCryptoAsset } from '@leather.io/models';
import { createAssetDescriptionQueryConfig } from '@leather.io/queries';

import { useSettings } from '@/store/settings/settings';

export function useAssetDescription(asset: FungibleCryptoAsset) {
  return toFetchState(useAssetDescriptionQuery(asset));
}

export function useAssetDescriptionQuery(asset: FungibleCryptoAsset) {
  const settings = useSettings();
  return useQuery(createAssetDescriptionQueryConfig(asset, settings));
}
