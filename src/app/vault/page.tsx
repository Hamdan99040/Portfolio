'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';

export default function VaultLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1 = Login, 2 = 2FA OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if admin is already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.push('/vault/dashboard');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.requireOtp) {
        setStep(2);
      } else {
        setError(data.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Unable to access security node.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/vault/dashboard');
      } else {
        setError(data.error || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      console.error(err);
      setError('Security verification node unreachable.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 mt-4 tracking-widest uppercase">Connecting to Security Node...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-1/4 w-[35rem] h-[35rem] bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-[30rem] h-[30rem] bg-purple-500/[0.03] blur-[120px] pointer-events-none" />

      {/* Return home shortcut */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Portfolio
      </Link>

      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-outfit font-extrabold text-2xl text-white tracking-wide">
            Secure Documents Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Portals Verification Gateway
          </p>
        </div>

        {/* Security Alert info card */}
        <div className="glassmorphism rounded-2xl p-4 border-l-2 border-indigo-500 bg-indigo-950/20 text-[10px] sm:text-xs text-slate-400 mb-6 text-left flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-white block mb-0.5">Authorization Required</span>
            This gateway provides access to sensitive academic transcripts and personal IDs. Logins are fully audited.
            <span className="block mt-1 font-semibold text-indigo-400">Demo Code: admin@portfolio.com | admin123 | 2FA: 123456</span>
          </div>
        </div>

        {/* Login Form card */}
        <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-6 text-left animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* Phase 1: Credentials entry */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@portfolio.com"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 text-white placeholder-slate-700 text-sm transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Security Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 text-white placeholder-slate-700 text-sm transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Verify Credentials
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Phase 2: 2FA OTP Card */
            <form onSubmit={handleOtpSubmit} className="space-y-5 animate-fade-in">
              <div className="space-y-2 text-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Enter 2-Factor OTP Code
                </label>
                
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  disabled={loading}
                  className="w-full tracking-[1.5em] text-center font-mono font-bold text-2xl py-3.5 rounded-xl bg-slate-950/60 border border-white/5 focus:border-indigo-500/50 focus:bg-slate-950 text-indigo-400 placeholder-slate-700 outline-none transition-all duration-300"
                />
                
                <p className="text-[10px] text-slate-500 mt-2">
                  A verification code has been generated. Enter code <span className="font-semibold text-indigo-400">123456</span> to authorize this session.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Authorize Session
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setError('');
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-300"
              >
                Go Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
