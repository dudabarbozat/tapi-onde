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
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.auth.signUp({
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  if (showOnboarding) {
    return <div className="min-h-screen bg-leaf-600 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <div className="text-center mb-12">
            <img src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" alt="TapiOnde Logo" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-5xl font-heading font-bold text-white mb-4">TapiOnde</h1>
            <p className="text-xl text-green-200">Descubra os Sabores da América Latina</p>
          </div>

          {/* Onboarding Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">
                  Descubra Receitas
                </h3>
                <p className="text-green-200 text-sm">
                  Explore pratos tradicionais de diferentes países da América Latina e aprenda sobre suas origens.
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">
                  Localize Origens
                </h3>
                <p className="text-green-200 text-sm">
                  Use suas habilidades de detetive gastronômico para identificar onde cada prato é tradicionalmente preparado.
                </p>
              </CardContent>
            </Card>

            <Card className="cyber-card text-center">
              <CardContent className="p-6 bg-green-800">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">
                  Ganhe Pontos
                </h3>
                <p className="text-green-200 text-sm">
                  Acumule pontos baseados na precisão de suas respostas e torne-se um expert em culinária latina.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button onClick={() => setShowOnboarding(false)} className="cyber-start-button text-2xl px-12 py-6">
              COMEÇAR JORNADA
            </Button>
          </div>

          {/* Creator Info */}
          <div className="text-center mt-12 text-green-200">
            <p className="text-sm">Criado por <span className="font-semibold text-white">Eduarda Barboza</span></p>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-leaf-600 flex items-center justify-center p-6">
      <Card className="cyber-card w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/lovable-uploads/8bfc5af9-403d-4df4-8dea-debdb93da4e5.png" alt="TapiOnde Logo" className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl font-heading text-white">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
                <Input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} className="pl-10 bg-green-700/50 border-green-600/50 text-white placeholder-green-300" required={!isLogin} />
              </div>}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-green-700/50 border-green-600/50 text-white placeholder-green-300" required />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" size={18} />
              <Input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 bg-green-700/50 border-green-600/50 text-white placeholder-green-300" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                {error}
              </div>}

            <Button type="submit" disabled={loading} className="w-full cyber-button">
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-green-300 hover:text-white transition-colors">
              {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
            </button>
          </div>

          {/* Creator Info */}
          <div className="text-center mt-8 text-green-200 text-sm">
            <p>Criado por <span className="font-semibold text-white">Eduarda Barboza</span></p>
          </div>
        </CardContent>
      </Card>
    </div>;
};