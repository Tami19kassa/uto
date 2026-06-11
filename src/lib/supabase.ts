import { MediaItem, SocialAccount } from "../types";

export interface TiDBConfigKeys {
  host: string;
  port: number;
  user: string;
  database: string;
  useTiDB: boolean;
  isConnected: boolean;
}

// ---------------- DATABASE CONFIG API (TiDB Cloud) -----------------

export async function fetchTiDBConfig(): Promise<TiDBConfigKeys> {
  try {
    const res = await fetch("/api/db-config");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch TiDB configuration from backend node:", e);
  }
  return {
    host: "",
    port: 4000,
    user: "",
    database: "",
    useTiDB: false,
    isConnected: false,
  };
}

export async function saveTiDBConfig(config: Partial<TiDBConfigKeys> & { password?: string }): Promise<any> {
  try {
    const res = await fetch("/api/db-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to save TiDB configuration to backend:", e);
  }
  return { success: false, isConnected: false };
}

// Keep legacy signatures so we don't break simple components if any
export function getSavedConfig() {
  return { url: "", anonKey: "" };
}
export function saveConfigKeys(_url: string, _key: string) {}
export function isSupabaseConnected(): boolean { return false; }
export function getSupabaseClient() { return null; }

// ---------------- MEDIA ITEMS API -----------------

export async function fetchMediaItems(): Promise<MediaItem[]> {
  try {
    const res = await fetch("/api/media-items");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch media elements:", e);
  }
  return [];
}

export async function submitMediaItem(item: MediaItem): Promise<boolean> {
  try {
    const res = await fetch("/api/media-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to publish media item:", e);
    return false;
  }
}

export async function removeMediaItem(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/media-items/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to delete media item:", e);
    return false;
  }
}

export async function addLikeToItem(id: string): Promise<number> {
  try {
    const res = await fetch(`/api/media-items/${id}/like`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      return data.likes || 0;
    }
  } catch (e) {
    console.error("Failed to like item:", e);
  }
  return 0;
}

// ---------------- SOCIAL ACCOUNTS API -----------------

export async function fetchSocialAccounts(): Promise<SocialAccount[]> {
  try {
    const res = await fetch("/api/social-accounts");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to load socials:", e);
  }
  return [];
}

export async function updateSocialAccountList(accounts: SocialAccount[]): Promise<boolean> {
  try {
    const res = await fetch("/api/social-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accounts),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to save socials list:", e);
    return false;
  }
}

// ---------------- HERO VIDEO URL API -----------------

export async function fetchHeroVideoUrl(): Promise<string> {
  try {
    const res = await fetch("/api/hero-video");
    if (res.ok) {
      const data = await res.json();
      return data.url || "";
    }
  } catch (e) {
    console.error("Failed to load hero background video:", e);
  }
  return "";
}

export async function saveHeroVideoUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch("/api/hero-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to upload hero clip:", e);
    return false;
  }
}
