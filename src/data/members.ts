
export interface StoreMember {
  id: string;
  email: string;
  store_id: string;
  role: 'owner' | 'admin';
  added_at: string;
}

// These functions are kept but return empty results since multi-member feature is removed
export const getStoreMembers = async (): Promise<StoreMember[]> => [];
export const getUserStores = async (): Promise<string[]> => [];
export const subscribeToStoreMembers = (callback: (members: StoreMember[]) => void) => {
  callback([]);
  return () => {};
};