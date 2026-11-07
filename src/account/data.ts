// PCNav account — member data, catalogue and resources (WNM-3 prototype).
// Member data here is ONLY product interest ("following"). Purchases and licences
// are not member data: they are not stored, fetched or inferred anywhere in this code.
import { ACCOUNT_CONFIG as C } from "./config";
import { identity, ReauthRequiredError, RequestError } from "./identity";
import { supabaseMemberData } from "./supabase";
import type { OptionalAnswers } from "./onboarding";
import { inertMemberData } from "./inert";
import { PROVIDER_ACTIVE } from "./mode";

export type Interest = { productId: string; state: "following"; since: string };

// Optional onboarding answers (WNM-9P Amendment A). Absent where a provider doesn't support them.
export interface OptionalAnswersStore {
  get(): Promise<OptionalAnswers>;
  save(answers: OptionalAnswers): Promise<OptionalAnswers>;
  clearAll(): Promise<void>;
}

export interface MemberDataAdapter {
  interests(): Promise<Interest[]>;
  follow(productId: string): Promise<Interest[]>;
  unfollow(productId: string): Promise<Interest[]>;
  exportData(): Promise<{ interests: Interest[]; optionalAnswers?: Record<string, unknown> }>;
  deleteMemberData(): Promise<void>;
  privateResources(): Promise<{ resources: unknown[] }>;
  optionalAnswers?: OptionalAnswersStore;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let r: Response;
  try { r = await identity.fetchWithAuth(`${C.memberApi}${path}`, init); }
  catch (e) { if (e instanceof TypeError) throw new RequestError(0, "NETWORK"); throw e; }
  if (!r.ok) throw new RequestError(r.status, (await r.json().catch(() => ({}))).error || "REQUEST_FAILED");
  return r.json();
}

const httpMemberData: MemberDataAdapter = {
  interests: async () => (await call<{ interests: Interest[] }>("/me/interests")).interests,
  follow: async (id) => (await call<{ interests: Interest[] }>(`/me/interests/${id}`, { method: "PUT" })).interests,
  unfollow: async (id) => (await call<{ interests: Interest[] }>(`/me/interests/${id}`, { method: "DELETE" })).interests,
  exportData: () => call("/me/export"),
  deleteMemberData: async () => {
    try { await call("/me", { method: "DELETE" }); }
    catch (e) { if (e instanceof RequestError && e.status === 403) throw new ReauthRequiredError(); throw e; }
  },
  privateResources: () => call("/resources/private"),
};

// Supabase builds use PostgREST under row-level security; other builds use the member API.
export const memberData: MemberDataAdapter = !PROVIDER_ACTIVE ? inertMemberData
  : (import.meta.env as Record<string, string | undefined>).VITE_PCNAV_IDP === "supabase" ? supabaseMemberData : httpMemberData;

// Public catalogue. Statuses are the site's own wording: Workspace Navigator's download
// page publishes v0.5.1-beta.1; the OS Map page says it "is currently in trusted testing".
export type Product = {
  id: string; name: string; status: string; summary: string;
  links: { label: string; to: string }[];
};
export const CATALOGUE: Product[] = [
  {
    id: "workspace-navigator", name: "Workspace Navigator", status: "Beta",
    summary: "Your Continuity Compass for Projects, documents and ongoing work.",
    links: [
      { label: "Overview", to: "/workspace-navigator" },
      { label: "Beta release", to: "/workspace-navigator/download" },
      { label: "Feedback", to: "/feedback/workspace-navigator" },
    ],
  },
  {
    id: "os-map", name: "OS Map", status: "Trusted testing",
    summary: "Understand your system, network, privacy settings and web configuration.",
    links: [
      { label: "Overview", to: "/os-map" },
      { label: "Release", to: "/os-map/download" },
      { label: "Feedback", to: "/feedback/os-map" },
    ],
  },
];

// Access classes. "member-presented" content is public by nature: it is shown on
// member pages for convenience and is NOT protected. Only "private" is protected,
// and only by the member API on the server.
export type Access = "public" | "member-presented" | "private";

export const ANNOUNCEMENTS: { id: string; date: string; title: string; body: string; to?: string; access: Access }[] = [
  { id: "wn-0-5-1-beta-1", date: "2026-11-06", title: "Workspace Navigator 0.5.1 beta is available", body: "The v0.5.1-beta.1 release can be downloaded from the beta release page.", to: "/workspace-navigator/download", access: "member-presented" },
];

export const RESOURCES: { productId: string; groups: { heading: string; items: { label: string; to: string; access: Access }[] }[] }[] = [
  {
    productId: "workspace-navigator",
    groups: [
      { heading: "Documentation and tutorials", items: [
        { label: "Workspace Navigator overview", to: "/workspace-navigator", access: "public" },
        { label: "Video introduction (homepage)", to: "/#watch-video", access: "public" },
        { label: "Video introduction transcript and credits", to: "/workspace-navigator/video-transcript", access: "public" },
      ] },
      { heading: "Release information", items: [
        { label: "Download the beta", to: "/workspace-navigator/download#download", access: "public" },
        { label: "System requirements", to: "/workspace-navigator/download#system-requirements", access: "public" },
        { label: "Before you install", to: "/workspace-navigator/download#before-you-install", access: "public" },
        { label: "Check your download", to: "/workspace-navigator/download#check-your-download", access: "public" },
        { label: "Beta expiry", to: "/workspace-navigator/download#expiry", access: "public" },
        { label: "Known limitations", to: "/workspace-navigator/download#known-limitations", access: "public" },
      ] },
      { heading: "Feedback and community", items: [
        { label: "Report a problem or suggest an idea", to: "/feedback/workspace-navigator", access: "public" },
      ] },
    ],
  },
  {
    productId: "os-map",
    groups: [
      { heading: "Product information", items: [
        { label: "OS Map overview", to: "/os-map", access: "public" },
        { label: "OS Map release", to: "/os-map/download", access: "public" },
        { label: "Report a problem or suggest an idea", to: "/feedback/os-map", access: "public" },
      ] },
    ],
  },
];
