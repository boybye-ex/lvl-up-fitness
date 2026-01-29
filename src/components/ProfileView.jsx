import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, Activity, CheckSquare, Save, Trash2, Settings, LogIn, LogOut, Cloud, CloudOff, Trophy, Lock, User, Zap, BarChart3, Briefcase, Camera, X, CheckCircle2, Ruler, RefreshCw } from 'lucide-react';
import { badges } from '../data/badges';
import { getRank, getRankColor, getRankProgress } from '../utils/ranks';
import useProgress from '../hooks/useProgress';
import useUnit from '../hooks/useUnit';
import TrophyRoom from './TrophyRoom';
import { MilestoneSection } from './MilestoneCard';
import { strengthMilestones } from '../data/milestones';
import { ACHIEVEMENT_GROUPS } from '../data/badges';

const quizQuestions = [
  "I love my job most of the time.",
  "I take good safety precautions (seat belts, etc).",
  "I am within five pounds of my ideal weight.",
  "I know three methods to reduce stress without drugs/alcohol.",
  "I do not smoke.",
  "I sleep six to eight hours each night and wake up refreshed.",
  "I engage in regular physical activity 3x per week.",
  "I have seven or fewer alcoholic drinks per week.",
  "I know my blood pressure and cholesterol.",
  "I follow sensible eating habits (limit fat/sugar/salt).",
  "I have a good social support system.",
  "I maintain a positive mental attitude."
];

export default function ProfileView({ onBack, onReset, unlockedBadges = [], level = 1, onChangeView }) {
  const { user, login, logout } = useAuth();
  const { profile, badgeUnlocks, updateProfile, uploadProfilePhoto, bests, getUserBest, lastSyncSuccess, lastSyncTime, isCloudSyncing, forceSync } = useProgress();
  const { unit, toggleUnits, label } = useUnit();
  const [age, setAge] = useState(profile?.age || 30);
  const [answers, setAnswers] = useState(new Array(quizQuestions.length).fill(false));
  const [score, setScore] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile?.age) {
      setAge(profile.age);
    }
  }, [profile?.age]);

  const toggleAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    const total = answers.filter(Boolean).length;
    setScore(total);
  };

  const maxHeartRate = 220 - age;
  const minTarget = Math.round(maxHeartRate * 0.60);
  const maxTarget = Math.round(maxHeartRate * 0.90);

  const getHealthMessage = (s) => {
    if (s <= 6) return "Your behaviors may be hazardous to your lifestyle.";
    if (s <= 9) return "You are on the positive side.";
    return "Congratulations! You're living life at its best.";
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      await uploadProfilePhoto(file);
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAgeChange = (newAge) => {
    setAge(newAge);
    updateProfile({ age: newAge });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          PROFILE & <span className="text-yellow-500">TOOLS</span>
        </h2>
      </div>

      <div className="space-y-8 max-w-md mx-auto">

        {/* User Header — Rank & Level */}
        <div className="flex items-center gap-6 mb-8 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-full border-2 border-blue-500 p-1">
              {profile?.photoURL || user?.photoURL ? (
                <img
                  src={profile?.photoURL || user?.photoURL}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                  <User size={32} className="text-zinc-600" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingPhoto ? (
                <div className="text-white text-xs">Uploading...</div>
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoUpload}
              accept="image/*"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              {profile?.name || user?.displayName || user?.email?.split('@')[0] || 'Guest User'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-blue-600 text-[10px] font-black px-2 py-1 rounded-md text-white">
                LVL {level}
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${getRankColor(level)}`}>
                {getRank(level)}
              </span>
            </div>
            {level < 50 && (
              <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getRankColor(level).replace('text-', 'bg-')}`}
                  style={{ width: `${getRankProgress(level)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* COMMAND CENTER — Leaderboard, Skills, Stats */}
        {onChangeView && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => onChangeView('leaderboard')}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Trophy className="text-yellow-500 shrink-0" size={24} />
              <span className="text-xs font-bold text-white uppercase">Leaderboard</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeView('skills')}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Zap className="text-blue-500 shrink-0" size={24} />
              <span className="text-xs font-bold text-white uppercase">Skill Tree</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeView('stats')}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <BarChart3 className="text-green-500 shrink-0" size={24} />
              <span className="text-xs font-bold text-white uppercase">Stats</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeView('stealth')}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Briefcase className="text-zinc-400 shrink-0" size={24} />
              <span className="text-xs font-bold text-white uppercase">Office Mode</span>
            </button>
          </div>
        )}

        {/* --- STRENGTH MILESTONES --- */}
        <MilestoneSection 
          milestones={strengthMilestones}
          bests={bests}
          onViewDetails={onChangeView ? () => onChangeView('stats') : undefined}
        />

        {/* --- HEART RATE CALCULATOR --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <Heart className="fill-current" size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Target Heart Rate</h3>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="text-sm text-zinc-400">Enter Your Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => handleAgeChange(Number(e.target.value) || 0)}
              min={10}
              max={120}
              className="bg-black border border-zinc-700 rounded px-3 py-1 w-20 text-center font-mono font-bold text-white focus:border-red-500 outline-none"
            />
          </div>

          <div className="bg-black/50 rounded-xl p-4 flex justify-between items-center text-center">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold">Min (60%)</p>
              <p className="text-xl font-black text-white">{minTarget} <span className="text-xs font-normal text-zinc-600">BPM</span></p>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold">Max (90%)</p>
              <p className="text-xl font-black text-white">{maxTarget} <span className="text-xs font-normal text-zinc-600">BPM</span></p>
            </div>
          </div>
        </section>

        {/* --- HEALTH QUIZ --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <Activity size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Lifestyle Assessment</h3>
          </div>

          <div className="space-y-3 mb-6">
            {quizQuestions.map((q, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-colors
                  ${answers[i] ? 'bg-green-500 border-green-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                  {answers[i] && <CheckSquare size={14} className="text-black" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={answers[i]}
                  onChange={() => toggleAnswer(i)}
                />
                <span className={`text-sm ${answers[i] ? 'text-white' : 'text-zinc-500'}`}>{q}</span>
              </label>
            ))}
          </div>

          <button
            onClick={calculateScore}
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> CALCULATE SCORE
          </button>

          {score !== null && (
            <div className="mt-6 bg-black p-4 rounded-xl border border-green-500/30 transition-opacity duration-300">
              <span className="text-zinc-400 text-xs font-bold uppercase">Your Score: {score}/12</span>
              <p className="text-sm font-medium text-green-400 leading-snug mt-1">
                {getHealthMessage(score)}
              </p>
            </div>
          )}
        </section>

        {/* --- CLOUD SYNC --- */}
        <section className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Cloud size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Cloud Sync</h3>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {user.photoURL && <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border border-zinc-700" />}
                <div>
                  <p className="text-white font-bold text-sm">Signed in as</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                </div>
              </div>
              
              {/* Sync Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-xl">
                <div className={`w-2 h-2 rounded-full ${
                  isCloudSyncing 
                    ? 'bg-yellow-500 animate-pulse' 
                    : lastSyncSuccess 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-zinc-700'
                }`} />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isCloudSyncing 
                    ? 'Syncing...' 
                    : lastSyncSuccess 
                      ? 'Cloud Synchronized' 
                      : 'Local Mode'
                  }
                </span>
                {lastSyncSuccess && !isCloudSyncing && (
                  <CheckCircle2 size={12} className="text-green-500 ml-auto" />
                )}
                {!lastSyncSuccess && !isCloudSyncing && (
                  <CloudOff size={12} className="text-zinc-600 ml-auto" />
                )}
              </div>
              
              {lastSyncTime && (
                <p className="text-[9px] text-zinc-600 text-center">
                  Last synced: {new Date(lastSyncTime).toLocaleString()}
                </p>
              )}
              
              <button
                onClick={async () => {
                  const success = await forceSync();
                  if (success) {
                    alert('Cloud data synced successfully!');
                  } else {
                    alert('Sync failed. Check your connection.');
                  }
                }}
                disabled={isCloudSyncing}
                className="w-full bg-blue-900/30 border border-blue-500/30 text-blue-400 font-bold py-3 rounded-xl hover:bg-blue-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={18} className={isCloudSyncing ? 'animate-spin' : ''} /> 
                {isCloudSyncing ? 'SYNCING...' : 'FORCE SYNC FROM CLOUD'}
              </button>
              
              <button
                onClick={logout}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> SIGN OUT
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Sign in to save your progress to the cloud and access it from any device.
              </p>
              
              {/* Local Mode Indicator for Guest Users */}
              <div className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Local Mode - Data on device only
                </span>
              </div>
              
              <button
                onClick={login}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={18} /> SYNC WITH GOOGLE
              </button>
            </div>
          )}
        </section>

        {/* --- TROPHY CASE --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6 text-yellow-500">
            <Trophy size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Trophy Room</h3>
          </div>

          <TrophyRoom unlockedBadges={unlockedBadges} badgeUnlocks={badgeUnlocks} />
        </section>

        {/* --- DANGER ZONE (SETTINGS) --- */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Settings size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">App Settings</h3>
          </div>

          {/* Unit Toggle */}
          <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-black italic uppercase text-xs mb-0.5 tracking-tight">System Units</h4>
                <p className="text-[8px] text-zinc-500 font-bold uppercase">Imperial / Metric conversion</p>
              </div>
              
              <button 
                onClick={toggleUnits}
                className="relative w-20 h-8 bg-zinc-900 border border-zinc-800 rounded-full p-1 flex items-center transition-colors hover:border-zinc-700"
              >
                <div className={`absolute w-8 h-6 bg-blue-600 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-900/40 ${unit === 'kg' ? 'translate-x-10' : 'translate-x-0'}`}>
                  <span className="text-[9px] font-black text-white uppercase">{unit}</span>
                </div>
                <div className="w-full flex justify-around text-[8px] font-black text-zinc-700 uppercase">
                  <span>LBS</span>
                  <span>KG</span>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full bg-red-900/10 text-red-400 border border-red-900/30 font-bold py-3 rounded-xl hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> RESET ALL PROGRESS
          </button>
          <p className="text-[10px] text-red-900/50 text-center mt-3 uppercase font-bold">
            Warning: This action cannot be undone.
          </p>
        </section>

      </div>
    </div>
  );
}
