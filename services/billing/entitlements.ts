export interface UserEntitlements {
  plan: "FREE" | "PRO";
  maxActiveProjects: number;
  canUploadImages: boolean;
  maxImagesPerMessage: number; // -1 for unlimited
  canRegenerateSections: boolean;
  canRunDesignReview: boolean;
  versionHistoryLimit: number; // -1 for unlimited
}

export const FREE_ENTITLEMENTS: UserEntitlements = {
  plan: "FREE",
  maxActiveProjects: 3,
  canUploadImages: true,
  maxImagesPerMessage: 3,
  canRegenerateSections: false,
  canRunDesignReview: false,
  versionHistoryLimit: 5,
};
