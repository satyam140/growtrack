export type RoleProfile = {
  storageKey: string;
  title: string;
  description: string;
  profileTitle: string;
  name: string;
  email: string;
  role: string;
};

export const HOD_PROFILE: RoleProfile = {
  storageKey: "growtrack-hod-profile",
  title: "HOD Settings",
  description: "Manage and view your Head of Department profile and account information.",
  profileTitle: "HOD Profile",
  name: "Not provided",
  email: "Not provided",
  role: "Head of Department (HOD)",
};

export const TPO_PROFILE: RoleProfile = {
  storageKey: "growtrack-tpo-profile",
  title: "TPO Settings",
  description: "Manage and view your Training and Placement Officer profile and account information.",
  profileTitle: "TPO Profile",
  name: "Not provided",
  email: "Not provided",
  role: "Training and Placement Officer (TPO)",
};
