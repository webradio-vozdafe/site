import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogOut, User, Lock, Loader2, Sliders, ShieldCheck } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const LoginView: React.FC = () => {
  const { setIsControlPanelOpen, setActiveTab } = useRadio();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const isAdminEmail = currentUser.email === 'vibraefm@gmail.com' || currentUser.email === 'webradiovozdafe@gmail.com';
            setIsAdmin(data.role === 'admin' || isAdminEmail);
          } else {
            // Auto register user in users collection
            const isAdminEmail = currentUser.email === 'vibraefm@gmail.com' || currentUser.email === 'webradiovozdafe@gmail.com';
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: isAdminEmail ? 'admin' : 'listener',
              createdAt: new Date().toISOString()
            }, { merge: true });
            setIsAdmin(isAdminEmail);
          }

          // Direct user to control panel upon successful login detection
          setIsControlPanelOpen(true);
        } catch (err) {
          console.error("Error checking user role:", err);
          if (currentUser.email === 'vibraefm@gmail.com' || currentUser.email === 'webradiovozdafe@gmail.com') {
            setIsAdmin(true);
            setIsControlPanelOpen(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });
  }, [setIsControlPanelOpen]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      
      // Ensure user document exists and open control panel directly
      const userRef = doc(db, 'users', loggedUser.uid);
      const userDoc = await getDoc(userRef);
      const isAdminEmail = loggedUser.email === 'vibraefm@gmail.com' || loggedUser.email === 'webradiovozdafe@gmail.com';

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: loggedUser.uid,
          email: loggedUser.email,
          role: isAdminEmail ? 'admin' : 'listener',
          createdAt: new Date().toISOString()
        });
      } else if (isAdminEmail && userDoc.data().role !== 'admin') {
        await setDoc(userRef, { role: 'admin' }, { merge: true });
      }

      setIsControlPanelOpen(true);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg("Não foi possível concluir o login com o Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <div 
      style={{
        background: `
          radial-gradient(ellipse at 78% 45%, rgba(80, 123, 86, .35), transparent 45%),
          radial-gradient(ellipse at 23% 6%, rgba(100, 129, 91, .25), transparent 40%),
          radial-gradient(circle at 50% 90%, rgba(16, 43, 40, .95), #0c211f),
          var(--forest, #102b28)
        `,
        minHeight: '100vh'
      }}
      className="flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden"
    >
      <div 
        style={{
          background: 'rgba(16, 43, 40, 0.95)',
          borderColor: 'rgba(230, 184, 107, 0.35)'
        }}
        className="backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border relative z-10"
      >
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-serif font-extrabold tracking-wide mb-1 text-white">Painel do Estúdio</h2>
        <p className="text-slate-300 mb-6 text-xs">Área restrita e segura da Rádio Vóz da Fé</p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {!user ? (
          <div className="space-y-4">
            <button 
              onClick={handleLogin} 
              className="w-full flex items-center justify-center gap-3 bg-[var(--gold)] hover:bg-[#d4a355] text-slate-950 font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-black/30 cursor-pointer text-sm" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Entrar com Google</span>
                </>
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('ao-vivo'); window.location.hash = ''; }}
              className="w-full py-2.5 text-xs text-slate-300 hover:text-[var(--gold)] transition-colors cursor-pointer"
            >
              Voltar para a programação ao vivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[rgba(12,33,31,0.85)] p-3.5 rounded-2xl border border-[rgba(230,184,107,0.25)]">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-amber-500" />
              ) : (
                <User className="w-10 h-10 text-slate-400 bg-slate-700 p-2 rounded-full" />
              )}
              <div className="text-left overflow-hidden">
                <p className="font-semibold text-sm text-white truncate">{user.displayName || 'Usuário'}</p>
                <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> {isAdmin ? 'Administrador do Estúdio' : 'Ouvinte Cadastrado'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setActiveTab('ao-vivo');
                setIsControlPanelOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[var(--gold)] hover:bg-[#d4a355] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-black/30 cursor-pointer text-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Abrir Painel de Controle do Estúdio</span>
            </button>

            <button 
              onClick={() => { setActiveTab('ao-vivo'); window.location.hash = ''; }}
              className="w-full flex items-center justify-center gap-2 bg-[rgba(12,33,31,0.8)] hover:bg-[rgba(12,33,31)] text-slate-200 border border-[rgba(255,255,255,0.1)] py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs font-semibold"
            >
              Voltar à Rádio
            </button>

            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 border border-rose-800/60 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs"
            >
              <LogOut className="w-4 h-4" /> Sair da Conta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
