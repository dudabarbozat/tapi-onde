
export interface Recipe {
  id: string;
  prato: string;
  ingredientes: string[];
  estado?: string;
  pais: string;
  latitude: number;
  longitude: number;
  dica: string;
  regiao?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  description: string;
}

export const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    description: 'Descobra os sabores únicos de cada região brasileira'
  },
  {
    code: 'PE',
    name: 'Peru',
    flag: '🇵🇪',
    description: 'Explore a rica herança culinária andina'
  },
  {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    description: 'Mergulhe nos sabores picantes e tradicionais'
  },
  {
    code: 'CO',
    name: 'Colômbia',
    flag: '🇨🇴',
    description: 'Saboreie a diversidade gastronômica colombiana'
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    description: 'Conheça os pratos tradicionais das pampas'
  },
  {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    description: 'Descubra os sabores do longo país andino'
  }
];

export const recipes: Recipe[] = [
  {
    id: '1',
    prato: 'Carne de Sol com Mandioca',
    ingredientes: ['mandioca', 'carne de sol', 'manteiga de garrafa', 'coentro'],
    estado: 'Pernambuco',
    pais: 'Brasil',
    latitude: -8.0476,
    longitude: -34.8770,
    dica: 'Esse prato é tradicional no sertão nordestino, conhecido pela preservação da carne com sal.',
    regiao: 'Nordeste'
  },
  {
    id: '2',
    prato: 'Feijoada',
    ingredientes: ['feijão preto', 'linguiça', 'bacon', 'costela de porco', 'farinha de mandioca'],
    estado: 'Rio de Janeiro',
    pais: 'Brasil',
    latitude: -22.9068,
    longitude: -43.1729,
    dica: 'Considerado o prato nacional do Brasil, tradicionalmente servido às quartas e sábados.',
    regiao: 'Sudeste'
  },
  {
    id: '3',
    prato: 'Paca no Tucumã',
    ingredientes: ['paca', 'tucumã', 'pimenta de cheiro', 'cheiro verde'],
    estado: 'Amazonas',
    pais: 'Brasil',
    latitude: -3.1190,
    longitude: -60.0217,
    dica: 'Prato típico da Amazônia que combina proteína local com fruto regional.',
    regiao: 'Norte'
  },
  {
    id: '4',
    prato: 'Ceviche',
    ingredientes: ['peixe branco', 'limão', 'cebola roxa', 'ají amarillo', 'batata doce'],
    pais: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    dica: 'Prato nacional peruano onde o peixe é "cozido" no ácido do limão.',
    regiao: 'Costa'
  },
  {
    id: '5',
    prato: 'Tacos al Pastor',
    ingredientes: ['carne de porco', 'abacaxi', 'cebola', 'coentro', 'tortilla de milho'],
    pais: 'México',
    latitude: 19.4326,
    longitude: -99.1332,
    dica: 'Herança da imigração libanesa no México, cozido em trompo vertical.',
    regiao: 'Cidade do México'
  },
  {
    id: '6',
    prato: 'Arepas',
    ingredientes: ['farinha de milho pré-cozida', 'água', 'sal', 'queijo branco'],
    pais: 'Colômbia',
    latitude: 4.7110,
    longitude: -74.0721,
    dica: 'Presente no café da manhã colombiano, pode ser recheada com diversos ingredientes.',
    regiao: 'Bogotá'
  },
  {
    id: '7',
    prato: 'Asado',
    ingredientes: ['carne bovina', 'sal grosso', 'chimichurri', 'morcilla'],
    pais: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    dica: 'Tradição argentina de churrasco que reúne família e amigos aos fins de semana.',
    regiao: 'Buenos Aires'
  },
  {
    id: '8',
    prato: 'Empanadas de Pino',
    ingredientes: ['carne moída', 'cebola', 'azeitona', 'ovo cozido', 'massa de trigo'],
    pais: 'Chile',
    latitude: -33.4489,
    longitude: -70.6693,
    dica: 'Empanada chilena tradicional, especialmente consumida nas Festas Pátrias.',
    regiao: 'Santiago'
  }
];

export const getRecipesByCountry = (countryCode: string): Recipe[] => {
  return recipes.filter(recipe => {
    switch (countryCode) {
      case 'BR':
        return recipe.pais === 'Brasil';
      case 'PE':
        return recipe.pais === 'Peru';
      case 'MX':
        return recipe.pais === 'México';
      case 'CO':
        return recipe.pais === 'Colômbia';
      case 'AR':
        return recipe.pais === 'Argentina';
      case 'CL':
        return recipe.pais === 'Chile';
      default:
        return false;
    }
  });
};
