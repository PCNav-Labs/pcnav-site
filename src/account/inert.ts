// Public scaffolding (WNM-11B): identity and member-data adapters that never sign anyone in and
// never contact any service. Selected whenever no provider is active (modes off and public).
import { RequestError, type AccountState, type IdentityAdapter } from "./core";
import type { MemberDataAdapter } from "./data";

const SIGNED_OUT: AccountState = { status: "signed-out" };
const unavailable = (): Promise<never> => Promise.reject(new RequestError(0, "NOT_AVAILABLE"));

export const inertIdentity: IdentityAdapter = {
  getState: () => SIGNED_OUT,
  subscribe: () => () => {},
  providerLabel: () => "none",
  signIn: async () => {},
  restore: async () => {},
  handleCallback: async () => "/account",
  fetchWithAuth: unavailable,
  getProfile: unavailable,
  requestEmailChange: unavailable,
  confirmEmailChange: unavailable,
  resendVerification: unavailable,
  securityUrl: () => null,
  signOut: async () => {},
  signOutEverywhere: unavailable,
  deleteIdentity: unavailable,
  recentlyAuthenticated: () => false,
  // no `direct`: there is no in-page sign-in
};

export const inertMemberData: MemberDataAdapter = {
  interests: unavailable,
  follow: unavailable,
  unfollow: unavailable,
  exportData: unavailable,
  deleteMemberData: unavailable,
  privateResources: unavailable,
};
