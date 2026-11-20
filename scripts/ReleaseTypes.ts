export type ReleaseManifest = { folder: string; name: string; version: string; private: boolean };

export type ReleasePlan = {
  names: string[];
  build: string[];
  check: string[];
  publishesPackages: boolean;
  tagsTemplates: boolean;
};
