import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, updateProfile, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, Mail, LogOut, ShieldCheck, Sliders, ArrowLeft, Radio, Phone, MapPin, Lock, CheckCircle2, AlertCircle, Loader2, Bell } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const ProfileView: React.FC = () => {
  const { setIsControlPanelOpen, setActiveTab } = useRadio();
  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Push notifications state
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setName(currentUser.displayName || '');
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          const isAdminEmail = currentUser.email === 'vibraefm@gmail.com' || currentUser.email === 'webradiovozdafe@gmail.com';
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPhone(data.phone || '');
            setAddress(data.address || '');
            setIsAdmin(data.role === 'admin' || isAdminEmail);
          } else {
            setIsAdmin(isAdminEmail);
          }
        } catch {
          const isAdminEmail = currentUser.email === 'vibraefm@gmail.com' || currentUser.email === 'webradiovozdafe@gmail.com';
          setIsAdmin(isAdminEmail);
        }
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushSupported(true);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleTogglePushNotifications = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      setPushEnabled(false);
      setPushStatus('Notificações pausadas para esta sessão.');
      setTimeout(() => setPushStatus(''), 3500);
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        setPushStatus('Notificações ativadas! Você receberá avisos da programação.');
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { notificationsEnabled: true }, { merge: true });
        }
      } else {
        setPushEnabled(false);
        setPushStatus('Permissão de notificações não concedida no navegador.');
      }
    } catch (err) {
      console.error(err);
      setPushStatus('Não foi possível alterar a permissão de notificações.');
    }
    setTimeout(() => setPushStatus(''), 4000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // 1. Update display name in Auth
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // 2. Update password if provided
      if (newPassword) {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        if (isGoogleUser) {
          throw new Error('Contas logadas via Google não utilizam senha. Gerencie sua senha pela Conta Google.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        if (newPassword.length < 6) {
          throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
        }
        await updatePassword(user, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      // 3. Update additional info in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: name,
        phone,
        address,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccessMsg('Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao atualizar perfil. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveTab('ao-vivo');
    window.location.hash = '';
  };

  if (!user) {
    return (
      <div 
        style={{
          background: 'linear-gradient(135deg, #102b28 0%, #0c211f 100%)',
          minHeight: '70vh'
        }}
        className="flex flex-col items-center justify-center p-6 text-slate-100"
      >
        <div 
          style={{
            background: 'rgba(16, 43, 40, 0.9)',
            border: '1px solid rgba(230, 184, 107, 0.3)',
            borderRadius: '16px'
          }}
          className="p-8 text-center max-w-sm w-full shadow-2xl backdrop-blur-md"
        >
          <User className="w-16 h-16 text-[var(--gold)] mx-auto mb-4 bg-[rgba(12,33,31,0.8)] p-3 rounded-2xl border border-[rgba(230,184,107,0.2)]" />
          <h2 className="text-xl font-serif font-bold mb-2 text-white">Conta de Usuário</h2>
          <p className="text-slate-300 text-xs mb-6">Você não está conectado no momento.</p>
          <button 
            onClick={() => setActiveTab('login')} 
            className="w-full bg-[var(--gold)] hover:bg-[#d4a355] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-black/30"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #102b28 0%, #0c211f 100%)',
        minHeight: '80vh'
      }}
      className="flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 py-12"
    >
      <div 
        style={{
          background: 'rgba(16, 43, 40, 0.92)',
          border: '1px solid rgba(230, 184, 107, 0.3)',
          borderRadius: '20px'
        }}
        className="shadow-2xl w-full max-w-xl p-6 sm:p-8 backdrop-blur-md relative"
      >
        {/* Top Navigation / Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(255,255,255,0.1)]">
          <button 
            onClick={() => { setActiveTab('ao-vivo'); window.location.hash = ''; }}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--gold)]" /> Voltar à Rádio
          </button>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-[rgba(230,184,107,0.15)] text-[var(--gold)] border border-[rgba(230,184,107,0.3)]">
            Meu Perfil
          </span>
        </div>

        {/* User Identity Header */}
        <div className="flex flex-col items-center text-center mb-8">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Foto de perfil" className="w-20 h-20 rounded-full mb-3 border-2 border-[var(--gold)] shadow-md shadow-black/40 object-cover" />
          ) : (
            <User className="w-20 h-20 text-[var(--gold)] bg-[rgba(12,33,31,0.9)] p-4 rounded-full mb-3 border border-[var(--gold)]/30" />
          )}
          <h2 className="text-2xl font-serif font-bold text-white">{name || user.displayName || 'Ouvinte Vóz da Fé'}</h2>
          <p className="text-slate-300 flex items-center justify-center gap-1.5 mt-1 text-xs">
            <Mail className="w-3.5 h-3.5 text-[var(--gold)]" /> {user.email}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-xs font-semibold mt-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Administrador do Estúdio' : 'Ouvinte Cadastrado'}</span>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Endereço (Cidade / Estado / Rua)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: São Paulo - SP"
                className="w-full bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-3">Alterar Senha (Opcional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notificações Push (PWA) */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-2">Notificações da Rádio (PWA)</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(12,33,31,0.8)] border border-[rgba(230,184,107,0.25)]">
              <div className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${pushEnabled ? 'text-[var(--gold)]' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-semibold text-white">Avisos da Programação & Cultos</p>
                  <p className="text-[11px] text-slate-400">
                    {pushSupported 
                      ? (pushEnabled ? 'Notificações ativadas no dispositivo' : 'Receba avisos de programas ao vivo no seu navegador')
                      : 'Notificações push não suportadas neste navegador'}
                  </p>
                </div>
              </div>
              {pushSupported && (
                <button
                  type="button"
                  onClick={handleTogglePushNotifications}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pushEnabled
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
                >
                  {pushEnabled ? 'Ativado' : 'Ativar'}
                </button>
              )}
            </div>
            {pushStatus && (
              <p className="text-[11px] text-amber-300 mt-1.5 px-1">{pushStatus}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[var(--gold)] hover:bg-[#d4a355] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-black/30 cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <span>Salvar Alterações</span>}
          </button>
        </form>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)] space-y-3">
          {isAdmin && (
            <button 
              onClick={() => setIsControlPanelOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[rgba(230,184,107,0.15)] hover:bg-[rgba(230,184,107,0.25)] text-[var(--gold)] border border-[var(--gold)]/40 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs"
            >
              <Sliders className="w-4 h-4" />
              <span>Abrir Painel de Controle do Estúdio</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveTab('ao-vivo')}
              className="flex items-center justify-center gap-2 bg-[rgba(12,33,31,0.8)] hover:bg-[rgba(12,33,31)] text-slate-200 border border-[rgba(255,255,255,0.1)] py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs font-semibold"
            >
              <Radio className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Ouvir Rádio</span>
            </button>

            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center gap-2 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/60 py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
