const MONEY_STORAGE_KEY = 'steam_money';
export const MONEY_CHANGED_EVENT = 'steam_money_changed';

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

export const setMoney = (value) => {
  const next = normalizeMoney(value);

  if (typeof window !== 'undefined') {
    localStorage.setItem(MONEY_STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent(MONEY_CHANGED_EVENT, { detail: next }));
  }

  return next;
};

export const addMoney = (amount) => {
  return setMoney(getMoney() + normalizeMoney(amount));
};

if (typeof window !== 'undefined') {
  window.steamEconomy = {
    getMoney,
    setMoney,
    addMoney
  };
}
