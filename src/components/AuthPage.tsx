
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage = ({
  onAuthSuccess
}: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message || 'Erro ao processar autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login com Google');
    }
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-leaf-600 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" 
              alt="TapiOnde Logo" 
              className="w-24 h-24 mx-auto mb-4" 
            />
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              TapiOnde
            </h1>
            <p className="text-xl text-green-200" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Descubra os Sabores da América Latina
            </p>
          </div>

          {/* Onboarding Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800/90">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Descubra Receitas
                </h3>
                <p className="text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Explore pratos tradicionais de diferentes países da América Latina e aprenda sobre suas origens.
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800/90">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Localize Origens
                </h3>
                <p className="text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Use suas habilidades de detetive gastronômico para identificar onde cada prato é tradicionalmente preparado.
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800/90">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Ganhe Pontos
                </h3>
                <p className="text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                  Acumule pontos baseados na precisão de suas respostas e torne-se um expert em culinária latina.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button 
              onClick={() => setShowOnboarding(false)} 
              className="cyber-start-button text-2xl px-12 py-6"
            >
              COMEÇAR JORNADA
            </Button>
          </div>

          {/* Creator Info */}
          <div className="text-center mt-12 text-green-200">
            <p className="text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Criado por <span className="font-semibold text-white">Eduarda Barboza</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leaf-600 flex items-center justify-center p-6">
      <Card className="cyber-card w-full max-w-md">
        <CardHeader className="text-center bg-green-800/90">
          <img 
            src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" 
            alt="TapiOnde Logo" 
            className="w-16 h-16 mx-auto mb-4" 
          />
          <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="bg-green-800/90">
          {/* Google Login Button */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleAuth}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center gap-3 py-3"
              style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <hr className="border-green-600/50" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-800/90 px-3 text-green-200 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              ou
            </span>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
                <Input 
                  type="text" 
                  placeholder="Nome completo" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="pl-10 bg-green-700/40 border-green-600/30 text-white placeholder-green-300" 
                  required={!isLogin} 
                  style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10 bg-green-700/40 border-green-600/30 text-white placeholder-green-300" 
                required 
                style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-10 pr-10 bg-green-700/40 border-green-600/30 text-white placeholder-green-300" 
                required 
                style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full cyber-button">
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-green-300 hover:text-white transition-colors"
              style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
            >
              {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
            </button>
          </div>

          {/* Creator Info */}
          <div className="text-center mt-8 text-green-200 text-sm">
            <p style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Criado por <span className="font-semibold text-white">Eduarda Barboza</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
