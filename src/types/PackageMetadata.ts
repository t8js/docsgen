export type PackageMetadata = {
  name?: string;
  version?: string;
  description?: string;
  repository?:
    | string
    | {
        type?: string;
        url?: string;
      };
};
