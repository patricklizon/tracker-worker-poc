// As specified
// https://wicg.github.io/ua-client-hints/#navigatoruadata

type RemovePrefix<T> = T extends `UA-${infer R}` ? R : never;
type MakeCamelCase<T> = T extends `${infer A}-${infer B}-${infer C}`
  ? `${Lowercase<A>}${Capitalize<B>}${Capitalize<C>}`
  : T extends `${infer A}-${infer B}`
  ? `${Lowercase<A>}${Capitalize<B>}`
  : Lowercase<T>;

/**
 * https://wicg.github.io/client-hints-infrastructure/#find-client-hint-value-section
 */
type Hint = MakeCamelCase<
  RemovePrefix<
    | "UA-Arch"
    | "UA-Bitness"
    | "UA-Full-Version-List"
    | "UA-Mobile"
    | "UA-Model"
    | "UA-Platform"
    | "UA-Platform-Version"
    | "UA-WoW64"
  >
>;

interface NavigatorUABrandVersion {
  brand: string;
  version: string;
}

interface UALowEntropyJSON {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  platform: string;
}

interface UADataValues {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  architecture: string;
  bitness: strign;
  model: string;
  platform: string;
  platformVersion: string;
  wow64: boolean;
  fullVersionList: NavigatorUABrandVersion[];
}

interface NavigatorUAData {
  brands: readonly { name: string; version: string }[];
  mobile: readonly boolean;
  platform: readonly string;
  /** A serializer that returns a JSON representation of the low entropy properties of the NavigatorUAData object. */
  toJSON(): UALowEntropyJSON;
  /** Returns a Promise that resolves with a dictionary object containing the high entropy values the user-agent returns. */
  getHighEntropyValues(hints: Hint[]): Promise<UADataValues>;
}

interface Navigator {
  userAgentData?: NavigatorUAData;
}

interface WorkerNavigator {
  userAgentData?: NavigatorUAData;
}
