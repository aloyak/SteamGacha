import { supabase } from './supabaseClient';

const MONEY_STORAGE_KEY = 'steam_money';
export const MONEY_CHANGED_EVENT = 'steam_money_changed';
let moneySyncQueue = Promise.resolve();

const normalizeMoney = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.floor(numeric));
};

export const getMoney = () => {
  if (typeof window === 'undefined') {
    return 0;
  }
  return normalizeMoney(localStorage.getItem(MONEY_STORAGE_KEY) || 0);
};

export const hasLocalMoney = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(MONEY_STORAGE_KEY) !== null;
};

export const setMoney = (value) => {
  const next = normalizeMoney(value);

  if (typeof window !== 'undefined') {
    localStorage.setItem(MONEY_STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent(MONEY_CHANGED_EVENT, { detail: next }));
  }

  return next;
};

export const clearLocalMoney = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MONEY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(MONEY_CHANGED_EVENT, { detail: 0 }));
  }
};

export const addMoney = (amount) => {
  return setMoney(getMoney() + normalizeMoney(amount));
};

export const hydrateLocalMoneyFromCloud = async (session) => {
  if (!session?.user?.id) {
    return { skipped: true, localMoney: getMoney(), cloudMoney: 0 };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', session.user.id)
    .single();

  if (error) {
    throw error;
  }

  const cloudMoney = normalizeMoney(data?.balance || 0);
  const localMoney = setMoney(cloudMoney);

  return { skipped: false, localMoney, cloudMoney };
};

async function syncMoneySnapshotToCloud(session, moneySnapshot) {
  if (!session?.user?.id) {
    return { skipped: true, syncedMoney: 0 };
  }

  const syncedMoney = normalizeMoney(moneySnapshot);
  const { error } = await supabase
    .from('profiles')
    .update({ balance: syncedMoney })
    .eq('id', session.user.id);

  if (error) {
    throw error;
  }

  return { skipped: false, syncedMoney };
}

export const syncLocalMoneyToCloud = (session, options = {}) => {
  const snapshot = normalizeMoney(
    options.moneySnapshot !== undefined ? options.moneySnapshot : getMoney()
  );

  // Serialize writes so stale snapshots cannot overwrite newer balances.
  moneySyncQueue = moneySyncQueue
    .catch(() => {})
    .then(() => syncMoneySnapshotToCloud(session, snapshot));

  return moneySyncQueue;
};

if (typeof window !== 'undefined') {
  window.steamEconomy = {
    getMoney,
    setMoney,
    addMoney,
    hydrateLocalMoneyFromCloud,
    syncLocalMoneyToCloud
  };
}
