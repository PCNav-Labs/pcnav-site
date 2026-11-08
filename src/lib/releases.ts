// Public release facts shown outside the release pages. Each value restates what the release page
// already publishes; the release pages remain the governing source and are not driven from here.
//
// Workspace Navigator: /workspace-navigator/download (v0.5.1-beta.1, RR-42).
// OS Map: /os-map/download. OS Map 0.1.0 was built on 13 June 2026 and publicly released as a beta
// on 21 June 2026 (Owner decision D3 of 2026-11-08).

export const WN_BETA = {
  label: "Workspace Navigator 0.5.1 Beta",
  version: "0.5.1 Beta",
  platform: "Windows 10 and Windows 11 · x64",
  platformShort: "Windows 10 and 11",
  region: "Canada and the United States",
  expires: "3 February 2027",
} as const;

// Owner decision D5 (2026-11-08): limited commercial messaging. No prices, dates or terms.
export const WN_COMMERCIAL_NOTE =
  "Workspace Navigator is currently available as a free public beta. Future versions are expected to offer paid licensing. Pricing and availability details will be announced when confirmed.";

export const OS_MAP_BETA = {
  label: "OS Map 0.1.0 Beta",
  version: "0.1.0 Beta",
  built: "13 June 2026",
  released: "21 June 2026",
} as const;

// Owner decision D6 (2026-11-08).
export const PUBLISHER = {
  name: "Papaya Services Ltd.",
  contact: "contact@pcnav.net",
} as const;
