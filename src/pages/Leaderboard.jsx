import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const BATCH_SIZE = 50;

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, balance')
        .order('balance', { ascending: false })
        .order('updated_at', { ascending: true })
        .range(0, BATCH_SIZE - 1);

      if (error) {
        console.error('Failed to load leaderboard:', error);
        setErrorMessage(error.message || 'Unable to load leaderboard right now.');
        setRows([]);
        setHasMore(false);
      } else {
        const nextRows = data || [];
        setRows(nextRows);
        setHasMore(nextRows.length === BATCH_SIZE);
      }

      setLoading(false);
    };

    loadLeaderboard();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setErrorMessage('');

    const start = rows.length;
    const end = start + BATCH_SIZE - 1;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, balance')
      .order('balance', { ascending: false })
      .order('updated_at', { ascending: true })
      .range(start, end);

    if (error) {
      console.error('Failed to load more leaderboard rows:', error);
      setErrorMessage(error.message || 'Unable to load more players right now.');
    } else {
      const nextRows = data || [];
      setRows((prev) => [...prev, ...nextRows]);
      setHasMore(nextRows.length === BATCH_SIZE);
    }

    setLoadingMore(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-slate-400">Top users ranked by account balance</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[72px_1fr_160px] border-b border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Rank</span>
          <span>User</span>
          <span className="text-right">Balance</span>
        </div>

        {loading && (
          <div className="px-4 py-16 text-center text-xs font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
            Loading leaderboard...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-bold text-rose-300">Could not load leaderboard</p>
            <p className="mt-2 text-xs text-slate-400">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && rows.length === 0 && (
          <div className="px-4 py-16 text-center text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            No users found
          </div>
        )}

        {!loading && !errorMessage && rows.length > 0 && (
          <div>
            {rows.map((user, index) => {
              const medalClass =
                index === 0
                  ? 'text-amber-300'
                  : index === 1
                    ? 'text-slate-300'
                    : index === 2
                      ? 'text-orange-300'
                      : 'text-slate-400';

              return (
                <div
                  key={user.id}
                  className="grid grid-cols-[72px_1fr_160px] items-center border-b border-white/5 px-4 py-3 last:border-b-0"
                >
                  <span className={`text-sm font-black ${medalClass}`}>#{index + 1}</span>
                  <span className="truncate text-sm font-semibold text-white">
                    {user.username || 'Unnamed'}
                  </span>
                  <span className="text-right font-mono text-sm text-emerald-300">
                    ${Number(user.balance || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}

            {hasMore && (
              <div className="border-t border-white/5 p-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mx-auto block rounded-lg border border-white/15 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? 'Loading...' : `Load Next ${BATCH_SIZE}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}