
-- Criar tabela de receitas no Supabase
CREATE TABLE public.recipes (
  id TEXT PRIMARY KEY,
  prato TEXT NOT NULL,
  ingredientes TEXT[] NOT NULL,
  estado TEXT,
  pais TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  dica TEXT NOT NULL,
  regiao TEXT,
  categoria TEXT CHECK (categoria IN ('prato-principal', 'sobremesa', 'bebida', 'aperitivo')),
  dificuldade TEXT CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir as receitas existentes do código
INSERT INTO public.recipes (id, prato, ingredientes, estado, pais, latitude, longitude, dica, regiao, categoria, dificuldade) VALUES
('br-01', 'Paca no Tucumã', ARRAY['paca', 'tucumã', 'pimenta de cheiro', 'cheiro verde'], 'Amazonas', 'Brasil', -3.1190, -60.0217, 'Prato típico da Amazônia que combina proteína local com fruto regional.', 'Norte', 'prato-principal', 'medio'),
('br-02', 'Tambaqui de Banda', ARRAY['tambaqui', 'farinha de mandioca', 'limão', 'alho', 'cominho'], 'Amazonas', 'Brasil', -3.1190, -60.0217, 'Peixe amazônico grelhado, servido com farinha de mandioca torrada.', 'Norte', 'prato-principal', 'facil'),
('br-03', 'Açaí na Tigela', ARRAY['açaí', 'banana', 'granola', 'mel', 'castanha do pará'], 'Pará', 'Brasil', -1.4558, -48.4902, 'Fruta sagrada da Amazônia, rica em antioxidantes e energia.', 'Norte', 'sobremesa', 'facil'),
('pe-01', 'Ceviche', ARRAY['peixe branco', 'limão', 'cebola roxa', 'ají amarillo', 'batata doce'], NULL, 'Peru', -12.0464, -77.0428, 'Prato nacional peruano onde o peixe é "cozido" no ácido do limão.', 'Costa', 'prato-principal', 'medio'),
('mx-01', 'Tacos al Pastor', ARRAY['carne de porco', 'abacaxi', 'cebola', 'coentro', 'tortilla de milho'], NULL, 'México', 19.4326, -99.1332, 'Herança da imigração libanesa no México, cozido em trompo vertical.', 'Cidade do México', 'prato-principal', 'medio'),
('co-01', 'Arepas', ARRAY['farinha de milho pré-cozida', 'água', 'sal', 'queijo branco'], NULL, 'Colômbia', 4.7110, -74.0721, 'Presente no café da manhã colombiano, pode ser recheada com diversos ingredientes.', 'Bogotá', 'aperitivo', 'facil'),
('ar-01', 'Asado', ARRAY['carne bovina', 'sal grosso', 'chimichurri', 'morcilla'], NULL, 'Argentina', -34.6037, -58.3816, 'Tradição argentina de churrasco que reúne família e amigos aos fins de semana.', 'Buenos Aires', 'prato-principal', 'medio'),
('cl-01', 'Empanadas de Pino', ARRAY['carne moída', 'cebola', 'azeitona', 'ovo cozido', 'massa de trigo'], NULL, 'Chile', -33.4489, -70.6693, 'Empanada chilena tradicional, especialmente consumida nas Festas Pátrias.', 'Santiago', 'aperitivo', 'medio');

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública das receitas (para o jogo)
CREATE POLICY "Recipes are viewable by everyone" ON public.recipes
  FOR SELECT USING (true);

-- Política para permitir apenas usuários autenticados adicionarem receitas
CREATE POLICY "Authenticated users can insert recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir apenas usuários autenticados editarem receitas
CREATE POLICY "Authenticated users can update recipes" ON public.recipes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir apenas usuários autenticados deletarem receitas
CREATE POLICY "Authenticated users can delete recipes" ON public.recipes
  FOR DELETE USING (auth.role() = 'authenticated');
