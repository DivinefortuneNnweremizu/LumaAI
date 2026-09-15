export interface UserEntitlements {
  plan: "FREE" | "PRO";
  maxActiveProjects: number;
  canUploadImages: boolean;
  canRegenerateSections: boolean;
  canRunDesignReview: boolean;
  versionHistoryLimit: number; // -1 for unlimited
}

export const FREE_ENTITLEMENTS: UserEntitlements = {
  plan: "FREE",
  maxActiveProjects: 3,
  canUploadImages: false,
  canRegenerateSections: false,
  canRunDesignReview: false,
  versionHistoryLimit: 5,
};

export const PRO_ENTITLEMENTS: UserEntitlements = {
  plan: "PRO",
  maxActiveProjects: 999999,
  canUploadImages: true,
  canRegenerateSections: true,
  canRunDesignReview: true,
  versionHistoryLimit: -1,
};

export async function getEntitlements(plan: "FREE" | "PRO" = "FREE"): Promise<UserEntitlements> {
  if (plan === "PRO") {
    return PRO_ENTITLEMENTS;
  }
  return FREE_ENTITLEMENTS;
}
