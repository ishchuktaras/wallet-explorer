export interface WalletData {
  address: string
  amount: {
    unit: string
    quantity: string
  }[]
  stake_address: string | null
  type: string
  script: boolean
  transactions_count?: number
}

// Asset data
export interface Asset {
  unit: string
  quantity: string
}

// Asset detail data
export interface AssetDetail {
  asset: string
  policy_id: string
  asset_name: string
  fingerprint: string
  quantity: string
  initial_mint_tx_hash: string
  mint_or_burn_count: number
  onchain_metadata: Record<string, any> | null
  metadata: Record<string, any> | null
}

// Transaction data
export interface Transaction {
  hash: string
  tx_hash: string
  block: string
  block_height: number
  block_time: number
  slot: number
  index: number
  output_amount: {
    unit: string
    quantity: string
  }[]
  fees: string
  deposit: string
  size: number
  invalid_before: string | null
  invalid_hereafter: string | null
  utxo_count: number
  withdrawal_count: number
  mir_cert_count: number
  delegation_count: number
  stake_cert_count: number
  pool_update_count: number
  pool_retire_count: number
  asset_mint_or_burn_count: number
  redeemer_count: number
  valid_contract: boolean
  inputs: {
    address: string
    amount: {
      unit: string
      quantity: string
    }[]
    tx_hash: string
    output_index: number
    data_hash: string | null
    collateral: boolean
    reference: boolean
  }[]
  outputs: {
    address: string
    amount: {
      unit: string
      quantity: string
    }[]
    output_index: number
    data_hash: string | null
  }[]
}

export interface NFTMetadata {
  name?: string;
  image?: string | { src?: string; mediaType?: string } | any;
  description?: string | any;
  attributes?:
    | Array<{ trait_type?: string; name?: string; value: any }>
    | Record<string, any>
    | any;
  files?:
    | Array<{ name?: string; mediaType?: string; src?: string } | string>
    | any;
  image_base64?: string;
  media?: string;
  imageUrl?: string;
  mediaType?: string;
  src?: string;
  [key: string]: any;
}

export interface NFTCardProps {
  asset: Asset;
  details?: AssetDetail;
  viewMode: ViewMode;
  debug?: boolean;
  onClick: () => void;
  variants?: any;
}

export type ViewMode = "grid" | "list";

export interface NFTDisplayProps {
  assets: Asset[];
  assetDetails: Record<string, AssetDetail>;
  viewMode: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  debug?: boolean;
}

export interface NFTDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nft: { asset: Asset; details?: AssetDetail } | null;
}

