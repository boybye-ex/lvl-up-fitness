import { useEffect, useState } from 'react';
import { ArrowLeft, Crown, Medal, Trophy } from 'lucide-react';
import { db } from '../lib/firebase';
import { getRank, getRankColor } from '../utils/ranks';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function LeaderboardView({ onBack, currentUserId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // Query the top 10 users by XP
        const q = query(
          collection(db, 'leaderboard'),
          orderBy('xp', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-500 fill-yellow-500" size={24} />;
    if (index === 1) return <Medal className="text-zinc-300 fill-zinc-300" size={24} />;
    if (index === 2) return <Medal className="text-amber-700 fill-amber-700" size={24} />;
    return <span className="font-mono font-bold text-zinc-500 text-lg">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          GLOBAL <span className="text-yellow-500">RANKINGS</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Trophy className="w-12 h-12 text-zinc-800 animate-pulse" />
          <p className="text-zinc-500 text-sm animate-pulse">Syncing Global Data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((player, index) => {
            const isMe = player.id === currentUserId;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all relative overflow-hidden
                  ${isMe
                    ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                    : 'bg-zinc-900 border-zinc-800'}`}
              >
                {/* Highlight active user */}
                {isMe && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />}

                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">{getRankIcon(index)}</div>
                  <div>
                    <p className={`font-bold text-sm ${isMe ? 'text-white' : 'text-zinc-300'}`}>
                      {player.username} {isMe && <span className="text-yellow-500 ml-1">(You)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase ${getRankColor(player.level ?? 1)}`}>
                        {getRank(player.level ?? 1)}
                      </span>
                      <span className="text-[10px] text-zinc-600">• Lvl {player.level ?? 1}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-yellow-500 text-lg">
                    {typeof player.xp === 'number' ? player.xp.toLocaleString() : (player.xp ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold">Total XP</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
        <p className="text-xs text-zinc-500 italic">
          &quot;Competition can be a great motivator... get bitten by the competition bug.&quot;
          <br />— Stronger Faster
        </p>
      </div>
    </div>
  );
}
