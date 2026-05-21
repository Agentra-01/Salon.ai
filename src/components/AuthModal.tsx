import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name, phone);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('ADMIN_EXISTS_PASSWORD_MISMATCH')) {
        setError(err.message.replace('Error: ', '').replace('ADMIN_EXISTS_PASSWORD_MISMATCH:', '').trim());
      } else if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain') || err.message?.includes('unauthorized client')) {
        setError('unauthorized-domain: This domain is not authorized in Firebase.');
      } else if (err.code === 'auth/invalid-credential' || err.message?.includes('invalid-credential')) {
        if (isSignUp) {
          setError('invalid-credential: Check your registration details, or ensure that the Email/Password authentication provider is enabled in your Firebase console.');
        } else {
          setError('Invalid email or password. Please verify your credentials or create a new profile if you do not have an account yet.');
        }
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.message?.includes('CONFIGURATION_NOT_FOUND') || err.code === 'auth/operation-not-allowed') {
        setError('operation-not-allowed: Registering method is not enabled. Please enable Email/Password provider in the Firebase Console.');
      } else {
        setError(err.code || err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain') || err.message?.includes('unauthorized client')) {
        setError('unauthorized-domain: This domain is not authorized in Firebase.');
      } else if (err.code === 'auth/invalid-credential' || err.message?.includes('invalid-credential')) {
        setError('invalid-credential: Core authentication issue. Verify that the Google sign-in provider is enabled and configured in your Firebase Console.');
      } else if (err.message?.includes('CONFIGURATION_NOT_FOUND') || err.code === 'auth/operation-not-allowed') {
        setError('operation-not-allowed: Google sign-in provider is not enabled in the Firebase Console.');
      } else {
        setError(err.code || err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTroubleshootingSteps = (errStr: string) => {
    const isDomainError = errStr.toLowerCase().includes('unauthorized-domain') || 
                          errStr.toLowerCase().includes('unauthorized client') || 
                          errStr.toLowerCase().includes('auth-domain');
    const isCredentialError = errStr.toLowerCase().includes('invalid-credential') || 
                              errStr.toLowerCase().includes('invalid_api_key');

    if (isDomainError) {
      const currentHost = window.location.hostname;
      const devHost = 'ais-dev-g5jgwnl6tabhb7ia3lug6s-806527329393.asia-east1.run.app';
      const preHost = 'ais-pre-g5jgwnl6tabhb7ia3lug6s-806527329393.asia-east1.run.app';

      return (
        <div className="mt-3 p-4 bg-amber-50 text-amber-950 rounded-2xl border border-amber-200 text-[11px] leading-relaxed space-y-3 text-left">
          <p className="font-bold flex items-center gap-1.5 text-amber-800 text-xs">
            <span>⚠️ Firebase Authorized Domains Setup Required</span>
          </p>
          <p>
            Your current preview domain is not yet trusted by your Firebase web app config. You have two excellent options to resolve this:
          </p>
          
          <div className="space-y-1.5 border-l-2 border-brand-nude/40 pl-3">
            <p className="font-bold text-brand-black">Option A: Use standard Email/Password (Instant & Easy)</p>
            <p className="text-[10px] text-gray-600">
              Switch to <strong>Create Profile</strong> status below. Standard Email & Password registration works instantly from any domain without any Firebase authorized domain console setup!
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-amber-600/45 pl-3">
            <p className="font-bold text-brand-black">Option B: Enable Google Login (Requires 2 Minutes Setup)</p>
            <p className="text-[10px] text-gray-600">
              Add both preview domains in your Firebase console to enable Google Sign-In popups:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[10px] text-gray-700">
              <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-semibold text-amber-800 hover:text-amber-950">Firebase Console</a>.</li>
              <li>Go to <strong className="font-medium text-brand-black">Authentication</strong> &gt; <strong className="font-medium text-brand-black">Settings</strong> &gt; <strong className="font-medium text-brand-black">Authorized domains</strong>.</li>
              <li>Click <strong className="font-semibold text-brand-black">Add domain</strong> and authorize these two preview hostnames:</li>
              <div className="mt-1.5 space-y-1 font-mono text-[9px]">
                <div className="flex items-center justify-between bg-white/75 p-1 px-2 rounded border border-amber-200/60 select-all">
                  <span>{currentHost}</span>
                </div>
                {currentHost !== devHost && (
                  <div className="flex items-center justify-between bg-white/75 p-1 px-2 rounded border border-amber-200/60 select-all">
                    <span>{devHost}</span>
                  </div>
                )}
                {currentHost !== preHost && (
                  <div className="flex items-center justify-between bg-white/75 p-1 px-2 rounded border border-amber-200/60 select-all">
                    <span>{preHost}</span>
                  </div>
                )}
              </div>
            </ol>
          </div>
        </div>
      );
    }

    if (isCredentialError) {
      if (!isSignUp) {
        return (
          <div className="mt-3 p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-200 text-[11px] leading-relaxed space-y-2 text-left">
            <p className="font-bold flex items-center gap-1.5 text-amber-800 text-xs">
              <span>🗝️ Need a Salon Account?</span>
            </p>
            <p>
              If you haven't registered a profile yet, click <strong className="font-semibold text-brand-nude">Create Profile</strong> below first. Password logins only work after you have registered!
            </p>
          </div>
        );
      }
      return (
        <div className="mt-3 p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-200 text-[11px] leading-relaxed space-y-2 text-left">
          <p className="font-bold flex items-center gap-1.5 text-amber-800">
            <span>🔒 Email / Password Configuration</span>
          </p>
          <p>
            This error usually means Email/Password sign-in is disabled or your details are entered incorrectly.
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-[10px]">
            <li>
              <strong>New user registration?</strong> Make sure <strong>Email/Password</strong> provider is enabled in the Firebase Console under:
              <br /><span className="text-amber-800 font-semibold font-mono">Authentication &gt; Sign-in method &gt; Email/Password</span>.
            </li>
            <li>
              <strong>Already registered?</strong> Ensure you have clicked "Create Profile" first if you didn't create an account, or verify your email and password.
            </li>
          </ol>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden">
          {/* Backdrop (separate fixed sibling, handles background dimming) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/85 backdrop-blur-md z-[510]"
          />

          {/* Dialog Scroll Container (separately scrollable if viewport is small) */}
          <div className="fixed inset-0 z-[520] overflow-y-auto flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden z-10 glass-morphism border border-brand-blush my-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="bg-brand-black p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center space-x-2 text-brand-gold mb-3">
                <Sparkles size={16} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Dolores Beauty Salon</span>
              </div>
              <h3 className="text-3xl font-serif">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-white/60 mt-2 font-light">
                {isSignUp 
                  ? 'Join Dolores salon for exclusive updates & easy appointment booking.' 
                  : 'Sign in to schedule your personalized luxury beauty session.'}
              </p>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              {error && (
                <div className="space-y-2">
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-light leading-relaxed border border-red-100 text-left">
                    {error}
                  </div>
                  {getTroubleshootingSteps(error)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">Your Name</label>
                      <div className="flex items-center border-b border-brand-blush py-2 focus-within:border-brand-nude transition-colors">
                        <User className="text-brand-nude mr-3 flex-shrink-0" size={16} />
                        <input
                          required
                          type="text"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">Phone Number</label>
                      <div className="flex items-center border-b border-brand-blush py-2 focus-within:border-brand-nude transition-colors">
                        <Phone className="text-brand-nude mr-3 flex-shrink-0" size={16} />
                        <input
                          required
                          type="tel"
                          placeholder="+1 (123) 456-7890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">Email Address</label>
                  <div className="flex items-center border-b border-brand-blush py-2 focus-within:border-brand-nude transition-colors">
                    <Mail className="text-brand-nude mr-3 flex-shrink-0" size={16} />
                    <input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">Password</label>
                  <div className="flex items-center border-b border-brand-blush py-2 focus-within:border-brand-nude transition-colors">
                    <Lock className="text-brand-nude mr-3 flex-shrink-0" size={16} />
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 bg-brand-black text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-brand-nude transition-all shadow-md relative overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Please wait...</span>
                    </span>
                  ) : (
                    isSignUp ? 'Create VIP Profile' : 'Sign In'
                  )}
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-brand-blush"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-medium">Or continue with</span>
                <div className="flex-grow border-t border-brand-blush"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-4 border border-brand-blush text-brand-black text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-brand-blush transition-all flex items-center justify-center space-x-3"
              >
                <Star size={14} className="text-brand-gold fill-brand-gold animate-pulse" />
                <span>Google Account</span>
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-brand-black/60 font-light">
                  {isSignUp ? 'Already a client?' : 'New to Dolores salon?'}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                    className="ml-1 text-brand-nude font-medium underline hover:text-brand-black transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Create Profile'}
                  </button>
                </p>
              </div>

              {/* Note about credentials */}
              <div className="pt-2 border-t border-brand-blush/30">
                <p className="text-[9px] text-gray-400 leading-relaxed text-center">
                  🔐 Connections powered by Firebase. Note for creators: Ensure your web providers (Email or Google login) are enabled under Authentication in the Firebase Console.
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
