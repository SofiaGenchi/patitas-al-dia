import { PetProfile, FoodRecord } from '../types';

const API_BASE = '/.netlify/functions';

export const api = {
  checkProfilesExist: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/profiles?action=check`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.exists;
    } catch {
      return false;
    }
  },

  getProfile: async (petName: string): Promise<PetProfile | null> => {
    try {
      const res = await fetch(`${API_BASE}/profiles?petName=${encodeURIComponent(petName)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createProfile: async (profile: Omit<PetProfile, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to create profile' };
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  login: async (petName: string, pin: string): Promise<{ success: boolean; error?: string; profile?: PetProfile }> => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petName, pin })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };
      return { success: true, profile: data.profile };
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  getRecords: async (profileId: string): Promise<FoodRecord[]> => {
    try {
      const res = await fetch(`${API_BASE}/records?profileId=${encodeURIComponent(profileId)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.records || [];
    } catch {
      return [];
    }
  },

  createRecord: async (record: Omit<FoodRecord, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
