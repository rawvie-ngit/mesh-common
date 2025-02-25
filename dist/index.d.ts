export { generateMnemonic, mnemonicToEntropy } from 'bip39';

type AccountInfo = {
    active: boolean;
    poolId?: string;
    balance: string;
    rewards: string;
    withdrawals: string;
};

type Data = string | number | bigint | Array<Data> | Map<Data, Data> | {
    alternative: number;
    fields: Array<Data>;
};

type RedeemerTagType = "CERT" | "MINT" | "REWARD" | "SPEND";
type Action = {
    data: Data;
    index: number;
    budget: Budget;
    tag: RedeemerTagType;
};
type Budget = {
    mem: number;
    steps: number;
};

type Asset = {
    unit: Unit;
    quantity: Quantity;
};
type Unit = string;
type Quantity = string;
declare const mergeAssets: (assets: Asset[]) => Asset[];

type AssetExtended = {
    unit: Unit;
    policyId: string;
    assetName: string;
    fingerprint: string;
    quantity: Quantity;
};

type RoyaltiesStandard = {
    rate: string;
    address: string;
};
declare const royaltiesStandardKeys: string[];
type MetadataStandard = any;
declare const metadataStandardKeys: string[];
type Files = {
    files?: [
        {
            name: string;
            src: `${string}://${string}`;
            mediaType: `${string}/${string}`;
        }
    ];
};
type AssetMetadata = FungibleAssetMetadata | NonFungibleAssetMetadata | RoyaltiesStandard;
type FungibleAssetMetadata = MetadataStandard & {
    ticker: string;
    decimals: number;
    version: `${number}.${number}`;
};
declare const fungibleAssetKeys: string[];
type NonFungibleAssetMetadata = AudioAssetMetadata | ImageAssetMetadata | SmartAssetMetadata | VideoAssetMetadata;
type AudioAssetMetadata = MetadataStandard & Files;
type ImageAssetMetadata = MetadataStandard & Files & {
    artists?: [
        {
            name: string;
            twitter?: `https://twitter.com/${string}`;
        }
    ];
    attributes?: {
        [key: string]: string;
    };
    traits?: string[];
};
type SmartAssetMetadata = MetadataStandard & Files;
type VideoAssetMetadata = MetadataStandard & Files;
/**
 * Transform the metadata into the format needed in CIP68 inline datum (in Mesh Data type)
 * @param metadata The metadata body without outer wrapper of policy id & token name
 * @returns The metadata in Mesh Data type, ready to be attached as inline datum
 */
declare const metadataToCip68: (metadata: any) => Data;

type BlockInfo = {
    time: number;
    hash: string;
    slot: string;
    epoch: number;
    epochSlot: string;
    slotLeader: string;
    size: number;
    txCount: number;
    output: string;
    fees: string;
    previousBlock: string;
    nextBlock: string;
    confirmations: number;
    operationalCertificate: string;
    VRFKey: string;
};

type DataSignature = {
    signature: string;
    key: string;
};

type Era = "ALONZO" | "BABBAGE";

type Message = {
    payload: string;
    externalAAD?: string;
};

type Recipient = string | {
    address: string;
    datum?: {
        value: Data;
        inline?: boolean;
    };
};

type Mint = {
    assetName: string;
    assetQuantity: Quantity;
    recipient?: Recipient;
    metadata?: AssetMetadata;
    label?: "20" | "721" | "777" | `${number}`;
    cip68ScriptAddress?: string;
};

type NativeScript = {
    type: "after" | "before";
    slot: string;
} | {
    type: "all" | "any";
    scripts: NativeScript[];
} | {
    type: "atLeast";
    required: number;
    scripts: NativeScript[];
} | {
    type: "sig";
    keyHash: string;
};

declare const ALL_NETWORKS: readonly ["testnet", "preview", "preprod", "mainnet"];
type Network = (typeof ALL_NETWORKS)[number];
declare const isNetwork: (value: unknown) => value is Network;

type PlutusScript = {
    version: LanguageVersion;
    code: string;
};
type LanguageVersion = keyof typeof LANGUAGE_VERSIONS;

type Relay = {
    type: "SingleHostAddr";
    IPV4?: string;
    IPV6?: string;
    port?: number;
} | {
    type: "SingleHostName";
    domainName: string;
    port?: number;
} | {
    type: "MultiHostName";
    domainName: string;
};

type PoolParams = {
    vrfKeyHash: string;
    operator: string;
    pledge: string;
    cost: string;
    margin: [number, number];
    relays: Relay[];
    owners: string[];
    rewardAddress: string;
    metadata?: PoolMetadata;
};
type PoolMetadata = {
    URL: string;
    hash: string;
};

type Protocol = {
    epoch: number;
    minFeeA: number;
    minFeeB: number;
    maxBlockSize: number;
    maxTxSize: number;
    maxBlockHeaderSize: number;
    keyDeposit: number;
    poolDeposit: number;
    decentralisation: number;
    minPoolCost: string;
    priceMem: number;
    priceStep: number;
    maxTxExMem: string;
    maxTxExSteps: string;
    maxBlockExMem: string;
    maxBlockExSteps: string;
    maxValSize: number;
    collateralPercent: number;
    maxCollateralInputs: number;
    coinsPerUtxoSize: number;
    minFeeRefScriptCostPerByte: number;
};
declare const castProtocol: (data: Partial<Record<keyof Protocol, any>>) => Protocol;

type Token = keyof typeof SUPPORTED_TOKENS;

type TransactionInfo = {
    index: number;
    block: string;
    hash: string;
    slot: string;
    fees: string;
    size: number;
    deposit: string;
    invalidBefore: string;
    invalidAfter: string;
};

type UTxO = {
    input: {
        outputIndex: number;
        txHash: string;
    };
    output: {
        address: string;
        amount: Asset[];
        dataHash?: string;
        plutusData?: string;
        scriptRef?: string;
        scriptHash?: string;
    };
};

type Wallet = {
    id: string;
    name: string;
    icon: string;
    version: string;
};

declare const experimentalSelectUtxos: (requiredAssets: Map<Unit, Quantity>, inputs: UTxO[], threshold: Quantity) => UTxO[];

declare const keepRelevant: (requiredAssets: Map<Unit, Quantity>, inputs: UTxO[], threshold?: string) => UTxO[];

declare const largestFirst: (lovelace: Quantity, initialUTxOSet: UTxO[], includeTxFees?: boolean, { maxTxSize, minFeeA, minFeeB }?: Protocol) => UTxO[];

declare const largestFirstMultiAsset: (requestedOutputSet: Map<Unit, Quantity>, initialUTxOSet: UTxO[], includeTxFees?: boolean, parameters?: Protocol) => UTxO[];

/**
 * All UTxO selection algorithms follows below's interface
 *
 * Supported algorithms:
 * - largestFirst - CIP2 suggested algorithm
 * - largestFirstMultiAsset - CIP2 suggested algorithm
 * - keepRelevant - CIP2 suggested algorithm
 * - experimental - The always evolving algorithm according to the latest research
 *
 * @param requestedOutputSet
 * @param initialUTxOSet
 * @returns
 */
declare class UtxoSelection {
    private threshold;
    private includeTxFees;
    constructor(threshold?: string, includeTxFees?: boolean);
    largestFirst(requiredAssets: Map<Unit, Quantity>, inputs: UTxO[]): UTxO[];
    keepRelevant(requiredAssets: Map<Unit, Quantity>, inputs: UTxO[]): UTxO[];
    largestFirstMultiAsset(requiredAssets: Map<Unit, Quantity>, inputs: UTxO[]): UTxO[];
    experimental(requiredAssets: Map<Unit, Quantity>, inputs: UTxO[]): UTxO[];
}
type UtxoSelectionStrategy = keyof UtxoSelection;

type BuilderData = {
    type: "Mesh";
    content: Data;
} | {
    type: "JSON";
    content: object | string;
} | {
    type: "CBOR";
    content: string;
};
type Redeemer = {
    data: BuilderData;
    exUnits: Budget;
};
type DatumSource = {
    type: "Provided";
    data: BuilderData;
} | {
    type: "Inline";
    txHash: string;
    txIndex: number;
};

type ScriptSource = {
    type: "Provided";
    script: PlutusScript;
} | {
    type: "Inline";
    txHash: string;
    txIndex: number;
    scriptHash?: string;
    scriptSize?: string;
    version?: LanguageVersion;
};
type SimpleScriptSourceInfo = {
    type: "Provided";
    scriptCode: string;
} | {
    type: "Inline";
    txHash: string;
    txIndex: number;
    simpleScriptHash?: string;
};

type Certificate = {
    type: "BasicCertificate";
    certType: CertificateType;
} | {
    type: "ScriptCertificate";
    certType: CertificateType;
    redeemer?: Redeemer;
    scriptSource?: ScriptSource;
} | {
    type: "SimpleScriptCertificate";
    certType: CertificateType;
    simpleScriptSource?: SimpleScriptSourceInfo;
};
type CertificateType = {
    type: "RegisterPool";
    poolParams: PoolParams;
} | {
    type: "RegisterStake";
    stakeKeyAddress: string;
} | {
    type: "DelegateStake";
    stakeKeyAddress: string;
    poolId: string;
} | {
    type: "DeregisterStake";
    stakeKeyAddress: string;
} | {
    type: "RetirePool";
    poolId: string;
    epoch: number;
} | {
    type: "VoteDelegation";
    stakeKeyAddress: string;
    drep: DRep;
} | {
    type: "StakeAndVoteDelegation";
    stakeKeyAddress: string;
    poolKeyHash: string;
    drep: DRep;
} | {
    type: "StakeRegistrationAndDelegation";
    stakeKeyAddress: string;
    poolKeyHash: string;
    coin: number;
} | {
    type: "VoteRegistrationAndDelegation";
    stakeKeyAddress: string;
    drep: DRep;
    coin: number;
} | {
    type: "StakeVoteRegistrationAndDelegation";
    stakeKeyAddress: string;
    poolKeyHash: string;
    drep: DRep;
    coin: number;
} | {
    type: "CommitteeHotAuth";
    committeeColdKeyAddress: string;
    committeeHotKeyAddress: string;
} | {
    type: "CommitteeColdResign";
    committeeColdKeyAddress: string;
    anchor?: Anchor;
} | {
    type: "DRepRegistration";
    votingKeyAddress: string;
    coin: number;
    anchor?: Anchor;
} | {
    type: "DRepDeregistration";
    votingKeyAddress: string;
    coin: number;
} | {
    type: "DRepUpdate";
    votingKeyAddress: string;
    anchor: Anchor;
};
type DRep = {
    keyHash: string;
} | {
    scriptHash: string;
} | {
    alwaysAbstain: {};
} | {
    alwaysNoConfidence: {};
};
type Anchor = {
    anchorUrl: string;
    anchorDataHash: string;
};

type MintItem = {
    type: "Plutus" | "Native";
    policyId: string;
    assetName: string;
    amount: string;
    redeemer?: Redeemer;
    scriptSource?: ScriptSource | SimpleScriptSourceInfo;
};

type Output = {
    address: string;
    amount: Asset[];
    datum?: {
        type: "Hash" | "Inline" | "Embedded";
        data: BuilderData;
    };
    referenceScript?: PlutusScript;
};

type RefTxIn = {
    txHash: string;
    txIndex: number;
};
type TxInParameter = {
    txHash: string;
    txIndex: number;
    amount?: Asset[];
    address?: string;
};
type TxIn = PubKeyTxIn | SimpleScriptTxIn | ScriptTxIn;
type PubKeyTxIn = {
    type: "PubKey";
    txIn: TxInParameter;
};
type SimpleScriptTxIn = {
    type: "SimpleScript";
    txIn: TxInParameter;
    simpleScriptTxIn: SimpleScriptTxInParameter;
};
type SimpleScriptTxInParameter = {
    scriptSource?: {
        type: "Provided";
        script: string;
    } | {
        type: "Inline";
        txInInfo: SimpleScriptSourceInfo;
    };
};
type ScriptTxInParameter = {
    scriptSource?: ScriptSource;
    datumSource?: DatumSource;
    redeemer?: Redeemer;
};
type ScriptTxIn = {
    type: "Script";
    txIn: TxInParameter;
    scriptTxIn: ScriptTxInParameter;
};

type Withdrawal = PubKeyWithdrawal | ScriptWithdrawal | SimpleScriptWithdrawal;
type PubKeyWithdrawal = {
    type: "PubKeyWithdrawal";
    address: string;
    coin: string;
};
type ScriptWithdrawal = {
    type: "ScriptWithdrawal";
    address: string;
    coin: string;
    scriptSource?: ScriptSource;
    redeemer?: Redeemer;
};
type SimpleScriptWithdrawal = {
    type: "SimpleScriptWithdrawal";
    address: string;
    coin: string;
    scriptSource?: SimpleScriptSourceInfo;
};

type MeshTxBuilderBody = {
    inputs: TxIn[];
    outputs: Output[];
    collaterals: PubKeyTxIn[];
    requiredSignatures: string[];
    referenceInputs: RefTxIn[];
    mints: MintItem[];
    changeAddress: string;
    metadata: Metadata[];
    validityRange: ValidityRange;
    certificates: Certificate[];
    withdrawals: Withdrawal[];
    signingKey: string[];
    extraInputs: UTxO[];
    selectionConfig: {
        threshold: string;
        strategy: UtxoSelectionStrategy;
        includeTxFees: boolean;
    };
    network: string;
};
declare const emptyTxBuilderBody: () => MeshTxBuilderBody;
type ValidityRange = {
    invalidBefore?: number;
    invalidHereafter?: number;
};
type Metadata = {
    tag: string;
    metadata: string;
};
type RequiredWith<T, K extends keyof T> = Required<T> & {
    [P in K]: Required<T[P]>;
};
declare const validityRangeToObj: (validityRange: ValidityRange) => object;

type DeserializedAddress = {
    pubKeyHash: string;
    scriptHash: string;
    stakeCredentialHash: string;
    stakeScriptCredentialHash: string;
};

type DeserializedScript = {
    scriptHash: string;
    scriptCbor?: string;
};

declare const DEFAULT_PROTOCOL_PARAMETERS: Protocol;
declare const resolveTxFees: (txSize: number, minFeeA?: number, minFeeB?: number) => string;

declare const SUPPORTED_WALLETS: string[];

declare const DEFAULT_V1_COST_MODEL_LIST: number[];
declare const DEFAULT_V2_COST_MODEL_LIST: number[];

declare const SUPPORTED_LANGUAGE_VIEWS: Record<Era, Partial<Record<keyof typeof LANGUAGE_VERSIONS, string>>>;
declare const resolveLanguageView: (era: Era, version: LanguageVersion) => string | undefined;

declare const DEFAULT_REDEEMER_BUDGET: Budget;
declare const POLICY_ID_LENGTH = 56;
declare const LANGUAGE_VERSIONS: {
    V1: string;
    V2: string;
    V3: string;
};
declare const HARDENED_KEY_START = 2147483648;
declare const SUPPORTED_CLOCKS: Record<Network, [
    epoch: string,
    slot: string,
    systemStart: string,
    epochLength: string
]>;
declare const SUPPORTED_HANDLES: Record<number, string>;
declare const SUPPORTED_OGMIOS_LINKS: Record<Network, string>;
declare const SUPPORTED_TOKENS: {
    LQ: string;
    MIN: string;
    NTX: string;
    iBTC: string;
    iETH: string;
    iUSD: string;
    MILK: string;
    AGIX: string;
    MELD: string;
    INDY: string;
    CLAY: string;
    MCOS: string;
    DING: string;
    GERO: string;
    NMKR: string;
    PAVIA: string;
    HOSKY: string;
    YUMMI: string;
    C3: string;
    GIMBAL: string;
    SUNDAE: string;
    GREENS: string;
    GENS: string;
    SOCIETY: string;
    DJED: string;
    SHEN: string;
    WMT: string;
    COPI: string;
};
/**
 * The utility function to append the bytes for CIP-68 100 token in front of the token hex
 * @param tokenNameHex The hex of the token name
 * @returns The hex of the token name with the CIP-68 100 bytes appended
 */
declare const CIP68_100: (tokenNameHex: string) => string;
/**
 * The utility function to append the bytes for CIP-68 222 token in front of the token hex
 * @param tokenNameHex The hex of the token name
 * @returns The hex of the token name with the CIP-68 222 bytes appended
 */
declare const CIP68_222: (tokenNameHex: string) => string;

/**
 * Fetcher interface defines end points to query blockchain data.
 */
interface IFetcher {
    fetchAccountInfo(address: string): Promise<AccountInfo>;
    fetchAddressUTxOs(address: string, asset?: string): Promise<UTxO[]>;
    fetchAssetAddresses(asset: string): Promise<{
        address: string;
        quantity: string;
    }[]>;
    fetchAssetMetadata(asset: string): Promise<AssetMetadata>;
    fetchBlockInfo(hash: string): Promise<BlockInfo>;
    fetchCollectionAssets(policyId: string, cursor?: number | string): Promise<{
        assets: Asset[];
        next?: string | number | null;
    }>;
    fetchHandle(handle: string): Promise<object>;
    fetchHandleAddress(handle: string): Promise<string>;
    fetchProtocolParameters(epoch: number): Promise<Protocol>;
    fetchTxInfo(hash: string): Promise<TransactionInfo>;
    fetchUTxOs(hash: string): Promise<UTxO[]>;
}

interface IInitiator {
    getChangeAddress(): SometimesPromise$1<string>;
    getCollateral(): SometimesPromise$1<UTxO[]>;
    getUtxos(): SometimesPromise$1<UTxO[]>;
}
type SometimesPromise$1<T> = Promise<T> | T;

interface IListener {
    onTxConfirmed(txHash: string, callback: () => void, limit?: number): void;
}

interface ISubmitter {
    submitTx(tx: string): Promise<string>;
}

interface IMeshTxSerializer {
    verbose: boolean;
    serializeTxBody(txBuilderBody: MeshTxBuilderBody, protocolParams: Protocol): string;
    addSigningKeys(txHex: string, signingKeys: string[]): string;
    resolver: IResolver;
    deserializer: IDeserializer;
    serializeData(data: BuilderData): string;
    serializeAddress(address: DeserializedAddress, networkId?: 0 | 1): string;
    serializePoolId(hash: string): string;
    serializeRewardAddress(stakeKeyHash: string, isScriptHash?: boolean, network_id?: 0 | 1): string;
}
interface IResolver {
    keys: {
        resolvePrivateKey(words: string[]): string;
        resolveRewardAddress(bech32: string): string;
        resolveEd25519KeyHash(bech32: string): string;
        resolveStakeKeyHash(bech32: string): string;
    };
    tx: {
        resolveTxHash(txHex: string): string;
    };
    data: {
        resolveDataHash(data: Data): string;
    };
    script: {
        resolveScriptRef(script: NativeScript | PlutusScript): string;
    };
}
interface IDeserializer {
    key: {
        deserializeAddress(bech32: string): DeserializedAddress;
    };
    script: {
        deserializeNativeScript(script: NativeScript): DeserializedScript;
        deserializePlutusScript(script: PlutusScript): DeserializedScript;
    };
    cert: {
        deserializePoolId(poolId: string): string;
    };
}

interface ISigner {
    signData(address: string, payload: string): SometimesPromise<DataSignature>;
    signTx(unsignedTx: string, partialSign: boolean): SometimesPromise<string>;
    signTxs(unsignedTxs: string[], partialSign: boolean): SometimesPromise<string[]>;
}
type SometimesPromise<T> = Promise<T> | T;

interface IEvaluator {
    evaluateTx(tx: string): Promise<Omit<Action, "data">[]>;
}

/**
 * The Mesh Data constructor object, representing custom data type
 */
type MConStr<T = any> = {
    alternative: number;
    fields: T;
};
/**
 * The Mesh Data index 0 constructor object, representing custom data type
 */
type MConStr0<T = any> = MConStr<T>;
/**
 * The Mesh Data index 1 constructor object, representing custom data type
 */
type MConStr1<T = any> = MConStr<T>;
/**
 * The Mesh Data index 2 constructor object, representing custom data type
 */
type MConStr2<T = any> = MConStr<T>;
/**
 * The utility function to create a Mesh Data constructor object, representing custom data type
 * @param alternative The constructor index number
 * @param fields The items in array
 * @returns The Mesh Data constructor object
 */
declare const mConStr: <T extends Data[]>(alternative: number, fields: T) => MConStr<T>;
/**
 * The utility function to create a Mesh Data index 0 constructor object, representing custom data type
 * @param fields The items in array
 * @returns The Mesh Data constructor object
 */
declare const mConStr0: <T extends Data[]>(fields: T) => MConStr0<T>;
/**
 * The utility function to create a Mesh Data index 1 constructor object, representing custom data type
 * @param fields The items in array
 * @returns The Mesh Data constructor object
 */
declare const mConStr1: <T extends Data[]>(fields: T) => MConStr1<T>;
/**
 * The utility function to create a Mesh Data index 2 constructor object, representing custom data type
 * @param fields The items in array
 * @returns The Mesh Data constructor object
 */
declare const mConStr2: <T extends Data[]>(fields: T) => MConStr2<T>;

/**
 * PlutusTx alias
 * The Mesh Data asset class
 */
type MAssetClass = MConStr0<[string, string]>;
/**
 * Aiken alias
 * The Mesh Data output reference
 */
type MOutputReference = MConStr0<[MConStr0<[string]>, number]>;
/**
 * PlutusTx alias
 * The Mesh Data TxOutRef
 */
type MTxOutRef = MConStr0<[MConStr0<[string]>, number]>;
/**
 * Aiken alias
 * The Mesh Data tuple
 */
type MTuple<K, V> = [K, V];
/**
 * The utility function to create a Mesh Data asset class
 * @param currencySymbolHex The currency symbol in hex
 * @param tokenNameHex The token name in hex
 * @returns The Mesh Data asset class object
 */
declare const mAssetClass: (currencySymbolHex: string, tokenNameHex: string) => MAssetClass;
/**
 * The utility function to create a Mesh Data output reference in Mesh Data type
 * @param txHash The transaction hash
 * @param index The index of the output
 * @returns The Mesh Data output reference object
 */
declare const mOutputReference: (txHash: string, index: number) => MOutputReference;
/**
 * The utility function to create a Mesh Data TxOutRef in Mesh Data type
 * @param txHash The transaction hash
 * @param index The index of the output
 * @returns The Mesh Data TxOutRef object
 */
declare const mTxOutRef: (txHash: string, index: number) => MTxOutRef;
/**
 * The utility function to create a Mesh Data tuple in Mesh Data type
 * @param key The key of the tuple
 * @param value The value of the tuple
 * @returns The Mesh Data tuple object
 */
declare const mTuple: <K, V>(key: K, value: V) => MTuple<K, V>;

/**
 * The Mesh Data staking credential
 */
type MMaybeStakingHash = MConStr1<[]> | MConStr0<[MConStr0<[MConStr0<[string]>]>]> | MConStr0<[MConStr0<[MConStr1<[string]>]>]>;
/**
 * The Mesh Data public key address
 */
type MPubKeyAddress = MConStr0<[MConStr0<[string]>, MMaybeStakingHash]>;
/**
 * The Mesh Data script address
 */
type MScriptAddress = MConStr0<[MConStr1<[string]>, MMaybeStakingHash]>;
/**
 * The utility function to create a Mesh Data staking hash
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Mesh Data staking hash object
 */
declare const mMaybeStakingHash: (stakeCredential: string, isScriptCredential?: boolean) => MMaybeStakingHash;
/**
 * The utility function to create a Mesh Data public key address
 * @param bytes The public key hash in hex
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Mesh Data public key address object
 */
declare const mPubKeyAddress: (bytes: string, stakeCredential?: string, isScriptCredential?: boolean) => Data;
/**
 * The utility function to create a Mesh Data script address
 * @param bytes The validator hash in hex
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Mesh Data script address object
 */
declare const mScriptAddress: (bytes: string, stakeCredential?: string, isScriptCredential?: boolean) => Data;

/**
 * The Mesh Data boolean
 */
type MBool = MConStr0<[]> | MConStr1<[]>;
/**
 * The utility function to create a Mesh Data boolean
 * @param b boolean value
 * @returns The Mesh Data boolean object
 */
declare const mBool: (b: boolean) => MBool;
/**
 * Converting a hex string into a BuiltinByteString Array, with max 32 bytes on each items
 * @param hexString The hex string to be converted into BuiltinByteString Array
 * @returns The BuiltinByteString Array representation of the hex string
 */
declare const mStringToPlutusBSArray: (hexString: string) => string[];
/**
 * Converting BuiltinByteString Array into a single string
 * @param bsArray The BuiltinByteString Array to be converted into a single string
 * @returns The string representation of the BuiltinByteString Array
 */
declare const mPlutusBSArrayToString: (bsArray: string[]) => string;

/**
 * The Plutus Data constructor object, representing custom data type in JSON
 */
type ConStr<T = any> = {
    constructor: number;
    fields: T;
};
/**
 * The Plutus Data index 0 constructor object, representing custom data type in JSON
 */
type ConStr0<T = any> = ConStr<T>;
/**
 * The Plutus Data index 1 constructor object, representing custom data type in JSON
 */
type ConStr1<T = any> = ConStr<T>;
/**
 * The Plutus Data index 2 constructor object, representing custom data type in JSON
 */
type ConStr2<T = any> = ConStr<T>;
/**
 * The utility function to create a Plutus Data constructor object, representing custom data type in JSON
 * @param constructor The constructor index number
 * @param fields The items in array
 * @returns The Plutus Data constructor object
 */
declare const conStr: <T>(constructor: number, fields: T) => ConStr<T>;
/**
 * The utility function to create a Plutus Data index 0 constructor object, representing custom data type in JSON
 * @param fields The items of  in array
 * @returns The Plutus Data constructor object
 */
declare const conStr0: <T>(fields: T) => ConStr0<T>;
/**
 * The utility function to create a Plutus Data index 1 constructor object, representing custom data type in JSON
 * @param fields The items of  in array
 * @returns The Plutus Data constructor object
 */
declare const conStr1: <T>(fields: T) => ConStr1<T>;
/**
 * The utility function to create a Plutus Data index 2 constructor object, representing custom data type in JSON
 * @param fields The items of  in array
 * @returns The Plutus Data constructor object
 */
declare const conStr2: <T>(fields: T) => ConStr2<T>;

/**
 * The Plutus Data boolean in JSON
 */
type Bool = ConStr0<[]> | ConStr1<[]>;
/**
 * The Plutus Data byte string, representing in hex, in JSON
 */
type BuiltinByteString = {
    bytes: string;
};
/**
 * The Plutus Data byte string, representing in hex, in JSON
 */
type ByteString = {
    bytes: string;
};
/**
 * The Plutus Data integer in JSON
 */
type Integer = {
    int: number | bigint;
};
/**
 * The Plutus Data list in JSON
 */
type List<T = any> = {
    list: T[];
};
/**
 * PlutusTx alias
 * The Plutus Data association map item in JSON
 */
type AssocMapItem<K, V> = {
    k: K;
    v: V;
};
/**
 * The Plutus Data association map in JSON
 */
type AssocMap<K = any, V = any> = {
    map: AssocMapItem<K, V>[];
};
/**
 * The utility function to create a Plutus Data boolean in JSON
 * @param b boolean value
 * @returns The Plutus Data boolean object
 */
declare const bool: (b: boolean) => Bool;
/**
 * The utility function to create a Plutus Data byte string in JSON
 * @param bytes The byte string in hex
 * @returns The Plutus Data byte string object
 */
declare const builtinByteString: (bytes: string) => BuiltinByteString;
/**
 * The utility function to create a Plutus Data byte string in JSON
 * @param bytes The byte string in hex
 * @returns The Plutus Data byte string object
 */
declare const byteString: (bytes: string) => ByteString;
/**
 * The utility function to create a Plutus Data integer in JSON
 * @param int The integer value
 * @returns The Plutus Data integer object
 */
declare const integer: (int: number | bigint) => Integer;
/**
 * The utility function to create a Plutus Data list in JSON
 * @param pList The list of Plutus Data
 * @param validation Default true - If current data construction would perform validation (introducing this flag due to possible performance issue in loop validation)
 * @returns The Plutus Data list object
 */
declare const list: <T = PlutusData>(pList: T[], validation?: boolean) => List<T>;
/**
 * Converting a hex string into a ByteString Array, with max 32 bytes on each items
 * @param hexString The hex string to be converted into ByteString Array
 * @returns The ByteString Array representation of the hex string
 */
declare const stringToBSArray: (hexString: string) => List<ByteString>;
/**
 * Converting ByteString Array into a single string
 * @param bsArray The ByteString Array to be converted into a single string
 * @returns The string representation of the ByteString Array
 */
declare const plutusBSArrayToString: (bsArray: List<ByteString>) => string;
/**
 * The utility function to create a Plutus Data association map in JSON
 * @param mapItems The items map in array
 * @param validation Default true - If current data construction would perform validation (introducing this flag due to possible performance issue in loop validation)
 * @returns The Plutus Data association map object
 */
declare const assocMap: <K, V>(mapItems: [K, V][], validation?: boolean) => AssocMap<K, V>;

/**
 * All the type aliases here represent the type name used in smart contracts from PlutusTx or Aiken.
 * Please be aware that the types constructed here will be invalid when PlutusTx or Aiken team introduces breaking changes.
 */

/**
 * The Plutus Data script hash in JSON
 */
type ScriptHash = ByteString;
/**
 * The Plutus Data public key hash in JSON
 */
type PubKeyHash = ByteString;
/**
 * Aiken alias
 * The Plutus Data policy id in JSON
 */
type PolicyId = ByteString;
/**
 * PlutusTx alias
 * The Plutus Data currency symbol in JSON
 */
type CurrencySymbol = ByteString;
/**
 * Aiken alias
 * The Plutus Data asset name in JSON
 */
type AssetName = ByteString;
/**
 * PlutusTx alias
 * The Plutus Data token name in JSON
 */
type TokenName = ByteString;
/**
 * PlutusTx alias
 * The Plutus Data asset class in JSON
 */
type AssetClass = ConStr0<[CurrencySymbol, TokenName]>;
/**
 * Aiken alias
 * The Plutus Data output reference in JSON
 */
type OutputReference = ConStr0<[ConStr0<[ByteString]>, Integer]>;
/**
 * PlutusTx alias
 * The Plutus Data TxOutRef in JSON
 */
type TxOutRef = ConStr0<[ConStr0<[ByteString]>, Integer]>;
/**
 * PlutusTx alias
 * The Plutus Data POSIX time in JSON
 */
type POSIXTime = Integer;
/**
 * Aiken alias
 * The Plutus Data dictionary item in JSON
 */
type DictItem<V> = {
    k: ByteString;
    v: V;
};
/**
 * Aiken alias
 * The Plutus Data dictionary in JSON
 */
type Dict<V> = {
    map: DictItem<V>[];
};
/**
 * Aiken alias
 * The Plutus Data tuple in JSON
 */
type Tuple<K, V> = {
    list: [K, V];
};
/**
 * Internal utility function to create a Plutus Data byte string in JSON, checking correct length
 * @param bytes The byte string in hex
 * @returns The Plutus Data byte string object
 */
declare const hashByteString: (bytes: string) => ByteString;
/**
 * The utility function to create a Plutus Data script hash in JSON
 * @param bytes The script hash in hex
 * @returns The Plutus Data script hash object
 */
declare const scriptHash: (bytes: string) => ScriptHash;
/**
 * The utility function to create a Plutus Data pub key hash in JSON
 * @param bytes The script hash in hex
 * @returns The Plutus Data script hash object
 */
declare const pubKeyHash: (bytes: string) => ScriptHash;
/**
 * The utility function to create a Plutus Data policy id in JSON
 * @param bytes The policy id in hex
 * @returns The Plutus Data policy id object
 */
declare const policyId: (bytes: string) => PolicyId;
/**
 * The utility function to create a Plutus Data currency symbol in JSON
 * @param bytes The policy id in hex
 * @returns The Plutus Data policy id object
 */
declare const currencySymbol: (bytes: string) => CurrencySymbol;
/**
 * The utility function to create a Plutus Data asset name in JSON
 * @param bytes The asset name in hex
 * @returns The Plutus Data asset name object
 */
declare const assetName: (bytes: string) => AssetName;
/**
 * The utility function to create a Plutus Data token name in JSON
 * @param bytes The token name in hex
 * @returns The Plutus Data token name object
 */
declare const tokenName: (bytes: string) => TokenName;
/**
 * The utility function to create a Plutus Data asset class in JSON
 * @param currencySymbolHex The currency symbol in hex
 * @param tokenNameHex The token name in hex
 * @returns The Plutus Data asset class object
 */
declare const assetClass: (currencySymbolHex: string, tokenNameHex: string) => AssetClass;
/**
 * The utility function to create a Plutus Data output reference in JSON
 * @param txHash The transaction hash
 * @param index The index of the output
 * @returns The Plutus Data output reference object
 */
declare const outputReference: (txHash: string, index: number) => OutputReference;
/**
 * The utility function to create a Plutus Data TxOutRef in JSON
 * @param txHash The transaction hash
 * @param index The index of the output
 * @returns The Plutus Data TxOutRef object
 */
declare const txOutRef: (txHash: string, index: number) => TxOutRef;
/**
 * The utility function to create a Plutus Data POSIX time in JSON
 * @param int The integer value of the POSIX time
 * @returns The Plutus Data POSIX time object
 */
declare const posixTime: (int: number) => POSIXTime;
/**
 * The utility function to create a Plutus Data dictionary in JSON
 * @param itemsMap The items map in array
 * @returns The Plutus Data dictionary object
 */
declare const dict: <V>(itemsMap: [ByteString, V][]) => Dict<V>;
/**
 * The utility function to create a Plutus Data tuple in JSON
 * @param key The key of the tuple
 * @param value The value of the tuple
 * @returns The Plutus Data tuple object
 */
declare const tuple: <K = PlutusData, V = PlutusData>(key: K, value: V) => Tuple<K, V>;

/**
 * The Plutus Data staking credential in JSON
 */
type MaybeStakingHash = ConStr1<[]> | ConStr0<[ConStr0<[ConStr0<[PubKeyHash]>]>]> | ConStr0<[ConStr0<[ConStr1<[ScriptHash]>]>]>;
/**
 * The Plutus Data public key address in JSON
 */
type PubKeyAddress = ConStr0<[ConStr0<[PubKeyHash]>, MaybeStakingHash]>;
/**
 * The Plutus Data script address in JSON
 */
type ScriptAddress = ConStr0<[ConStr1<[ScriptHash]>, MaybeStakingHash]>;
/**
 * The utility function to create a Plutus Data staking hash in JSON
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Plutus Data staking hash object
 */
declare const maybeStakingHash: (stakeCredential: string, isScriptCredential?: boolean) => MaybeStakingHash;
/**
 * The utility function to create a Plutus Data public key address in JSON
 * @param bytes The public key hash in hex
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Plutus Data public key address object
 */
declare const pubKeyAddress: (bytes: string, stakeCredential?: string, isScriptCredential?: boolean) => PubKeyAddress;
/**
 * The utility function to create a Plutus Data script address in JSON
 * @param bytes The validator hash in hex
 * @param stakeCredential The staking credential in hex
 * @param isScriptCredential The flag to indicate if the credential is a script credential
 * @returns The Plutus Data script address object
 */
declare const scriptAddress: (bytes: string, stakeCredential?: string, isScriptCredential?: boolean) => ScriptAddress;

type PlutusData = ConStr | Bool | ByteString | Integer | List | AssocMap | MaybeStakingHash | PubKeyAddress | ScriptAddress | AssetClass | OutputReference | PubKeyHash | POSIXTime | Dict<any> | Tuple<any, any>;

/**
 * Converting bytes to hex string
 * @param bytes The bytes to be converted
 * @returns The hex string
 */
declare const bytesToHex: (bytes: ArrayBuffer) => string;
/**
 * Converting hex string to bytes
 * @param hex The hex string to be converted
 * @returns The bytes
 */
declare const hexToBytes: (hex: string) => Buffer;
/**
 * Converting utf8 string to hex string
 * @param str The utf8 string to be converted
 * @returns The hex string
 */
declare const stringToHex: (str: string) => string;
/**
 * Converting hex string to utf8 string
 * @param hex The hex string to be converted
 * @returns The utf8 string
 */
declare const hexToString: (hex: string) => string;
/**
 * Converting either hex string or utf8 string to bytes
 * @param hex The hex or utf8 string to be converted
 * @returns The bytes
 */
declare const toBytes: (hex: string) => Uint8Array;
/**
 * Converting utf8 string to hex string
 * @param utf8 The utf8 string to be converted
 * @returns The hex string
 */
declare const fromUTF8: (utf8: string) => string;
/**
 * Converting hex string to utf8 string
 * @param hex The hex string to be converted
 * @returns The utf8 string
 */
declare const toUTF8: (hex: string) => string;
/**
 * Parse asset unit into an object with policyId and assetName
 * @param unit The asset unit to be parsed
 * @returns The object with policyId and assetName
 */
declare const parseAssetUnit: (unit: string) => {
    policyId: string;
    assetName: string;
};

type SlotConfig = {
    zeroTime: number;
    zeroSlot: number;
    slotLength: number;
    startEpoch: number;
    epochLength: number;
};
declare const SLOT_CONFIG_NETWORK: Record<Network, SlotConfig>;
declare const slotToBeginUnixTime: (slot: number, slotConfig: SlotConfig) => number;
/**
 * Eqivalent to `slotToBeginUnixTime` but option to provide optional config
 * @param unixTime Timestamp in milliseconds
 * @param slotConfig Slot configuration for calculation
 * @returns Slot number
 */
declare const unixTimeToEnclosingSlot: (unixTime: number, slotConfig: SlotConfig) => number;
/**
 * Resolve slot number based on timestamp in milliseconds.
 * @param network Network: mainnet | preprod | preview.
 * @param milliseconds Timestamp in milliseconds
 * @returns Slot number
 */
declare const resolveSlotNo: (network: Network, milliseconds?: number) => string;
/**
 * Resolve epoch number based on timestamp in  milliseconds.
 * @param network Network: mainnet | preprod | preview.
 * @param milliseconds Timestamp in milliseconds
 * @returns Epoch number
 */
declare const resolveEpochNo: (network: Network, milliseconds?: number) => number;

/**
 * It is suggested to keep the value representation as map of map,
 * where first key as policy id, second key as asset name, and final value as quantity.
 */

/**
 * Aiken alias
 * Value is the JSON representation of Cardano data Value
 */
type Value = AssocMap<CurrencySymbol, AssocMap<TokenName, Integer>>;
/**
 * Aiken alias
 * MValue is the Cardano data Value in Mesh Data type
 */
type MValue = Map<string, Map<string, bigint>>;
/**
 * The utility function to convert assets into Cardano data Value in JSON
 * @param assets The assets to convert
 * @returns The Cardano data Value in JSON
 */
declare const value: (assets: Asset[]) => Value;
/**
 * The utility function to convert assets into Cardano data Value in Mesh Data type
 * @param assets The assets to convert
 * @returns The Cardano data Value in Mesh Data type
 */
declare const mValue: (assets: Asset[]) => MValue;
/**
 * MeshValue provide utility to handle the Cardano value manipulation. It offers certain axioms:
 * 1. No duplication of asset - adding assets with same asset name will increase the quantity of the asset in the same record.
 * 2. No zero and negative entry - the quantity of the asset should not be zero or negative.
 * 3. Sanitization of lovelace asset name - the class handle back and forth conversion of lovelace asset name to empty string.
 * 4. Easy convertion to Cardano data - offer utility to convert into either Mesh Data type and JSON type for its Cardano data representation.
 */
declare class MeshValue {
    value: Record<string, bigint>;
    constructor(value?: Record<string, bigint>);
    /**
     * Converting assets into MeshValue
     * @param assets The assets to convert
     * @returns MeshValue
     */
    static fromAssets: (assets: Asset[]) => MeshValue;
    /**
     * Converting Value (the JSON representation of Cardano data Value) into MeshValue
     * @param plutusValue The Value to convert
     * @returns MeshValue
     */
    static fromValue: (plutusValue: Value) => MeshValue;
    /**
     * Add an asset to the Value class's value record.
     * @param asset The asset to add
     * @returns The updated MeshValue object
     */
    addAsset: (asset: Asset) => this;
    /**
     * Add an array of assets to the Value class's value record.
     * @param assets The assets to add
     * @returns The updated MeshValue object
     */
    addAssets: (assets: Asset[]) => this;
    /**
     * Substract an asset from the Value class's value record.
     * @param asset The asset to subtract
     * @returns The updated MeshValue object
     */
    negateAsset: (asset: Asset) => this;
    /**
     * Subtract an array of assets from the Value class's value record.
     * @param assets The assets to subtract
     * @returns The updated MeshValue object
     */
    negateAssets: (assets: Asset[]) => this;
    /**
     * Get the quantity of asset object per unit
     * @param unit The unit to get the quantity of
     * @returns The quantity of the asset
     */
    get: (unit: string) => bigint;
    /**
     * Get all asset units
     * @returns The asset units
     */
    units: () => string[];
    /**
     * Check if the value is greater than or equal to another value
     * @param other - The value to compare against
     * @returns boolean
     */
    geq: (other: MeshValue) => boolean;
    /**
     * Check if the specific unit of value is greater than or equal to that unit of another value
     * @param unit - The unit to compare
     * @param other - The value to compare against
     * @returns boolean
     */
    geqUnit: (unit: string, other: MeshValue) => boolean;
    /**
     * Check if the value is less than or equal to another value
     * @param other - The value to compare against
     * @returns boolean
     */
    leq: (other: MeshValue) => boolean;
    /**
     * Check if the specific unit of value is less than or equal to that unit of another value
     * @param unit - The unit to compare
     * @param other - The value to compare against
     * @returns boolean
     */
    leqUnit: (unit: string, other: MeshValue) => boolean;
    /**
     * Check if the value is empty
     * @returns boolean
     */
    isEmpty: () => boolean;
    /**
     * Merge the given values
     * @param values The other values to merge
     * @returns this
     */
    merge: (values: MeshValue | MeshValue[]) => this;
    /**
     * Convert the MeshValue object into an array of Asset
     * @returns The array of Asset
     */
    toAssets: () => Asset[];
    /**
     * Convert the MeshValue object into Cardano data Value in Mesh Data type
     */
    toData: () => MValue;
    /**
     * Convert the MeshValue object into a JSON representation of Cardano data Value
     * @returns Cardano data Value in JSON
     */
    toJSON: () => Value;
}

declare const resolveFingerprint: (policyId: string, assetName: string) => string;
declare class AssetFingerprint {
    readonly hashBuf: Uint8Array;
    private constructor();
    static fromHash(hash: Uint8Array): AssetFingerprint;
    static fromParts(policyId: Uint8Array, assetName: Uint8Array): AssetFingerprint;
    static fromBech32(fingerprint: string): AssetFingerprint;
    fingerprint(): string;
    hash(): string;
    prefix(): string;
    checksum(): string;
}

declare class BigNum {
    value: bigint;
    constructor(value?: bigint | number | string);
    static new(value: number | string | bigint | undefined): BigNum;
    divFloor(other: BigNum): BigNum;
    checkedMul(other: BigNum): BigNum;
    checkedAdd(other: BigNum): BigNum;
    checkedSub(other: BigNum): BigNum;
    clampedSub(other: BigNum): BigNum;
    lessThan(other: BigNum): boolean;
    compare(other: BigNum): -1 | 0 | 1;
    toString(): string;
}

export { type AccountInfo, type Action, type Anchor, type Asset, type AssetClass, type AssetExtended, AssetFingerprint, type AssetMetadata, type AssetName, type AssocMap, type AssocMapItem, BigNum, type BlockInfo, type Bool, type Budget, type BuilderData, type BuiltinByteString, type ByteString, CIP68_100, CIP68_222, type Certificate, type CertificateType, type ConStr, type ConStr0, type ConStr1, type ConStr2, type CurrencySymbol, DEFAULT_PROTOCOL_PARAMETERS, DEFAULT_REDEEMER_BUDGET, DEFAULT_V1_COST_MODEL_LIST, DEFAULT_V2_COST_MODEL_LIST, type DRep, type Data, type DataSignature, type DatumSource, type DeserializedAddress, type DeserializedScript, type Dict, type DictItem, type Era, type Files, type FungibleAssetMetadata, HARDENED_KEY_START, type IDeserializer, type IEvaluator, type IFetcher, type IInitiator, type IListener, type IMeshTxSerializer, type IResolver, type ISigner, type ISubmitter, type ImageAssetMetadata, type Integer, LANGUAGE_VERSIONS, type LanguageVersion, type List, type MAssetClass, type MBool, type MConStr, type MConStr0, type MConStr1, type MConStr2, type MMaybeStakingHash, type MOutputReference, type MPubKeyAddress, type MScriptAddress, type MTuple, type MTxOutRef, type MValue, type MaybeStakingHash, type MeshTxBuilderBody, MeshValue, type Message, type Metadata, type Mint, type MintItem, type NativeScript, type Network, type NonFungibleAssetMetadata, type Output, type OutputReference, POLICY_ID_LENGTH, type POSIXTime, type PlutusData, type PlutusScript, type PolicyId, type PoolMetadata, type PoolParams, type Protocol, type PubKeyAddress, type PubKeyHash, type PubKeyTxIn, type PubKeyWithdrawal, type Quantity, type Recipient, type Redeemer, type RedeemerTagType, type RefTxIn, type Relay, type RequiredWith, type RoyaltiesStandard, SLOT_CONFIG_NETWORK, SUPPORTED_CLOCKS, SUPPORTED_HANDLES, SUPPORTED_LANGUAGE_VIEWS, SUPPORTED_OGMIOS_LINKS, SUPPORTED_TOKENS, SUPPORTED_WALLETS, type ScriptAddress, type ScriptHash, type ScriptSource, type ScriptTxIn, type ScriptTxInParameter, type ScriptWithdrawal, type SimpleScriptSourceInfo, type SimpleScriptTxIn, type SimpleScriptTxInParameter, type SimpleScriptWithdrawal, type SlotConfig, type Token, type TokenName, type TransactionInfo, type Tuple, type TxIn, type TxInParameter, type TxOutRef, type UTxO, type Unit, UtxoSelection, type UtxoSelectionStrategy, type ValidityRange, type Value, type Wallet, type Withdrawal, assetClass, assetName, assocMap, bool, builtinByteString, byteString, bytesToHex, castProtocol, conStr, conStr0, conStr1, conStr2, currencySymbol, dict, emptyTxBuilderBody, experimentalSelectUtxos, fromUTF8, fungibleAssetKeys, hashByteString, hexToBytes, hexToString, integer, isNetwork, keepRelevant, largestFirst, largestFirstMultiAsset, list, mAssetClass, mBool, mConStr, mConStr0, mConStr1, mConStr2, mMaybeStakingHash, mOutputReference, mPlutusBSArrayToString, mPubKeyAddress, mScriptAddress, mStringToPlutusBSArray, mTuple, mTxOutRef, mValue, maybeStakingHash, mergeAssets, metadataStandardKeys, metadataToCip68, outputReference, parseAssetUnit, plutusBSArrayToString, policyId, posixTime, pubKeyAddress, pubKeyHash, resolveEpochNo, resolveFingerprint, resolveLanguageView, resolveSlotNo, resolveTxFees, royaltiesStandardKeys, scriptAddress, scriptHash, slotToBeginUnixTime, stringToBSArray, stringToHex, toBytes, toUTF8, tokenName, tuple, txOutRef, unixTimeToEnclosingSlot, validityRangeToObj, value };
