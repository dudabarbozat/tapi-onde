
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
  categoria?: 'prato-principal' | 'sobremesa' | 'bebida' | 'aperitivo';
  dificuldade?: 'facil' | 'medio' | 'dificil';
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
  },
  {
    code: 'EC',
    name: 'Equador',
    flag: '🇪🇨',
    description: 'Explore a gastronomia andina equatoriana'
  },
  {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    description: 'Conheça os sabores venezuelanos'
  },
  {
    code: 'BO',
    name: 'Bolívia',
    flag: '🇧🇴',
    description: 'Descubra a culinária do altiplano'
  },
  {
    code: 'UY',
    name: 'Uruguai',
    flag: '🇺🇾',
    description: 'Saboreie a tradição gastronômica uruguaia'
  }
];

export const recipes: Recipe[] = [
  // BRASIL - Região Norte
  {
    id: 'br-01',
    prato: 'Paca no Tucumã',
    ingredientes: ['paca', 'tucumã', 'pimenta de cheiro', 'cheiro verde'],
    estado: 'Amazonas',
    pais: 'Brasil',
    latitude: -3.1190,
    longitude: -60.0217,
    dica: 'Prato típico da Amazônia que combina proteína local com fruto regional.',
    regiao: 'Norte',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'br-02',
    prato: 'Tambaqui de Banda',
    ingredientes: ['tambaqui', 'farinha de mandioca', 'limão', 'alho', 'cominho'],
    estado: 'Amazonas',
    pais: 'Brasil',
    latitude: -3.1190,
    longitude: -60.0217,
    dica: 'Peixe amazônico grelhado, servido com farinha de mandioca torrada.',
    regiao: 'Norte',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },
  {
    id: 'br-03',
    prato: 'Açaí na Tigela',
    ingredientes: ['açaí', 'banana', 'granola', 'mel', 'castanha do pará'],
    estado: 'Pará',
    pais: 'Brasil',
    latitude: -1.4558,
    longitude: -48.4902,
    dica: 'Fruta sagrada da Amazônia, rica em antioxidantes e energia.',
    regiao: 'Norte',
    categoria: 'sobremesa',
    dificuldade: 'facil'
  },
  {
    id: 'br-04',
    prato: 'Tacacá',
    ingredientes: ['tucumã', 'camarão seco', 'jambu', 'broto de feijão', 'goma de mandioca'],
    estado: 'Pará',
    pais: 'Brasil',
    latitude: -1.4558,
    longitude: -48.4902,
    dica: 'Sopa tradicional paraense servida em cuias, com jambu que causa dormência na boca.',
    regiao: 'Norte',
    categoria: 'prato-principal',
    dificuldade: 'dificil'
  },

  // BRASIL - Região Nordeste
  {
    id: 'br-05',
    prato: 'Carne de Sol com Mandioca',
    ingredientes: ['carne de sol', 'mandioca', 'manteiga de garrafa', 'coentro'],
    estado: 'Pernambuco',
    pais: 'Brasil',
    latitude: -8.0476,
    longitude: -34.8770,
    dica: 'Esse prato é tradicional no sertão nordestino, conhecido pela preservação da carne com sal.',
    regiao: 'Nordeste',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'br-06',
    prato: 'Acarajé',
    ingredientes: ['feijão fradinho', 'dendê', 'camarão', 'vatapá', 'caruru'],
    estado: 'Bahia',
    pais: 'Brasil',
    latitude: -12.9714,
    longitude: -38.5014,
    dica: 'Comida de santo afro-brasileira, vendida pelas baianas do acarajé.',
    regiao: 'Nordeste',
    categoria: 'aperitivo',
    dificuldade: 'dificil'
  },
  {
    id: 'br-07',
    prato: 'Moqueca de Peixe',
    ingredientes: ['peixe branco', 'leite de coco', 'dendê', 'tomate', 'pimentão'],
    estado: 'Bahia',
    pais: 'Brasil',
    latitude: -12.9714,
    longitude: -38.5014,
    dica: 'Prato baiano cozido no dendê, servido tradicionalmente em panela de barro.',
    regiao: 'Nordeste',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'br-08',
    prato: 'Baião de Dois',
    ingredientes: ['arroz', 'feijão verde', 'linguiça', 'bacon', 'queijo coalho'],
    estado: 'Ceará',
    pais: 'Brasil',
    latitude: -3.7327,
    longitude: -38.5267,
    dica: 'Prato nordestino que mistura arroz e feijão, popular no interior.',
    regiao: 'Nordeste',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },

  // BRASIL - Região Sudeste  
  {
    id: 'br-09',
    prato: 'Feijoada',
    ingredientes: ['feijão preto', 'linguiça', 'bacon', 'costela de porco', 'farinha de mandioca'],
    estado: 'Rio de Janeiro',
    pais: 'Brasil',
    latitude: -22.9068,
    longitude: -43.1729,
    dica: 'Considerado o prato nacional do Brasil, tradicionalmente servido às quartas e sábados.',
    regiao: 'Sudeste',
    categoria: 'prato-principal',
    dificuldade: 'dificil'
  },
  {
    id: 'br-10',
    prato: 'Pão de Açúcar',
    ingredientes: ['farinha de trigo', 'açúcar', 'ovos', 'manteiga', 'fermento'],
    estado: 'Rio de Janeiro',
    pais: 'Brasil',
    latitude: -22.9068,
    longitude: -43.1729,
    dica: 'Pãozinho doce carioca, tradicionalmente consumido no café da manhã.',
    regiao: 'Sudeste',
    categoria: 'sobremesa',
    dificuldade: 'medio'
  },
  {
    id: 'br-11',
    prato: 'Brigadeiro',
    ingredientes: ['leite condensado', 'chocolate em pó', 'manteiga', 'granulado'],
    estado: 'São Paulo',
    pais: 'Brasil',
    latitude: -23.5505,
    longitude: -46.6333,
    dica: 'Doce brasileiro criado nos anos 1940, tradicional em festas de aniversário.',
    regiao: 'Sudeste',
    categoria: 'sobremesa',
    dificuldade: 'facil'
  },
  {
    id: 'br-12',
    prato: 'Virado à Paulista',
    ingredientes: ['feijão', 'farinha de mandioca', 'linguiça', 'ovo', 'couve'],
    estado: 'São Paulo',
    pais: 'Brasil',
    latitude: -23.5505,
    longitude: -46.6333,
    dica: 'Prato paulista tradicional, mistura de ingredientes refogados.',
    regiao: 'Sudeste',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },

  // BRASIL - Região Sul
  {
    id: 'br-13',
    prato: 'Churrasco Gaúcho',
    ingredientes: ['picanha', 'linguiça', 'sal grosso', 'farofa', 'chimichurri'],
    estado: 'Rio Grande do Sul',
    pais: 'Brasil',
    latitude: -30.0346,
    longitude: -51.2177,
    dica: 'Tradição gaúcha de assar carnes na brasa, servida em rodízio.',
    regiao: 'Sul',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'br-14',
    prato: 'Barreado',
    ingredientes: ['carne bovina', 'toucinho', 'cominho', 'farinha de mandioca', 'banana'],
    estado: 'Paraná',
    pais: 'Brasil',
    latitude: -25.4284,
    longitude: -49.2733,
    dica: 'Prato paranaense cozido lentamente em panela de barro lacrada.',
    regiao: 'Sul',
    categoria: 'prato-principal',
    dificuldade: 'dificil'
  },

  // BRASIL - Centro-Oeste
  {
    id: 'br-15',
    prato: 'Pintado Pintado',
    ingredientes: ['pintado', 'farinha de mandioca', 'limão', 'pimenta', 'cheiro verde'],
    estado: 'Mato Grosso',
    pais: 'Brasil',
    latitude: -15.6014,
    longitude: -56.0979,
    dica: 'Peixe do Pantanal, grelhado e servido com farofa de banana.',
    regiao: 'Centro-Oeste',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },

  // PERU
  {
    id: 'pe-01',
    prato: 'Ceviche',
    ingredientes: ['peixe branco', 'limão', 'cebola roxa', 'ají amarillo', 'batata doce'],
    pais: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    dica: 'Prato nacional peruano onde o peixe é "cozido" no ácido do limão.',
    regiao: 'Costa',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'pe-02',
    prato: 'Lomo Saltado',
    ingredientes: ['carne de boi', 'batata', 'cebola', 'tomate', 'soja', 'arroz'],
    pais: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    dica: 'Fusão entre culinária peruana e chinesa, saltado em wok.',
    regiao: 'Costa',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'pe-03',
    prato: 'Ají de Gallina',
    ingredientes: ['frango', 'ají amarillo', 'leite', 'pão', 'nozes', 'queijo'],
    pais: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    dica: 'Prato cremoso peruano com frango desfiado em molho picante.',
    regiao: 'Costa',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'pe-04',
    prato: 'Anticuchos',
    ingredientes: ['coração de boi', 'ají panca', 'alho', 'vinagre', 'cominho'],
    pais: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    dica: 'Espetinhos peruanos marinados, tradição das ruas de Lima.',
    regiao: 'Costa',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'pe-05',
    prato: 'Quinoa Soup',
    ingredientes: ['quinoa', 'verduras', 'carne', 'batata', 'milho'],
    pais: 'Peru',
    latitude: -13.5319,
    longitude: -71.9675,
    dica: 'Sopa nutritiva dos Andes, rica em proteínas da quinoa sagrada.',
    regiao: 'Sierra',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },

  // MÉXICO
  {
    id: 'mx-01',
    prato: 'Tacos al Pastor',
    ingredientes: ['carne de porco', 'abacaxi', 'cebola', 'coentro', 'tortilla de milho'],
    pais: 'México',
    latitude: 19.4326,
    longitude: -99.1332,
    dica: 'Herança da imigração libanesa no México, cozido em trompo vertical.',
    regiao: 'Cidade do México',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'mx-02',
    prato: 'Guacamole',
    ingredientes: ['abacate', 'limão', 'cebola', 'tomate', 'coentro', 'pimenta'],
    pais: 'México',
    latitude: 19.4326,
    longitude: -99.1332,
    dica: 'Molho asteca feito com abacate, tradicionalmente preparado no molcajete.',
    regiao: 'Cidade do México',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'mx-03',
    prato: 'Mole Poblano',
    ingredientes: ['chocolate', 'chiles', 'especiarias', 'frango', 'sementes'],
    pais: 'México',
    latitude: 19.0413,
    longitude: -98.2063,
    dica: 'Molho complexo com mais de 20 ingredientes, patrimônio de Puebla.',
    regiao: 'Puebla',
    categoria: 'prato-principal',
    dificuldade: 'dificil'
  },
  {
    id: 'mx-04',
    prato: 'Quesadillas',
    ingredientes: ['tortilla', 'queijo', 'flor de abóbora', 'huitlacoche', 'salsa'],
    pais: 'México',
    latitude: 19.4326,
    longitude: -99.1332,
    dica: 'Tortilla recheada e dobrada, pode levar diversos ingredientes tradicionais.',
    regiao: 'Cidade do México',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'mx-05',
    prato: 'Pozole',
    ingredientes: ['milho cacahuazintle', 'carne de porco', 'chile', 'alface', 'rábano'],
    pais: 'México',
    latitude: 20.6597,
    longitude: -103.3496,
    dica: 'Sopa ritual pré-hispânica, tradicionalmente servida em celebrações.',
    regiao: 'Jalisco',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },

  // COLÔMBIA
  {
    id: 'co-01',
    prato: 'Arepas',
    ingredientes: ['farinha de milho pré-cozida', 'água', 'sal', 'queijo branco'],
    pais: 'Colômbia',
    latitude: 4.7110,
    longitude: -74.0721,
    dica: 'Presente no café da manhã colombiano, pode ser recheada com diversos ingredientes.',
    regiao: 'Bogotá',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'co-02',
    prato: 'Bandeja Paisa',
    ingredientes: ['feijão', 'arroz', 'carne moída', 'chicharrón', 'ovo', 'abacate'],
    pais: 'Colômbia',
    latitude: 6.2442,
    longitude: -75.5812,
    dica: 'Prato completo de Antioquia, representa a abundância da região.',
    regiao: 'Antioquia',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'co-03',
    prato: 'Sancocho',
    ingredientes: ['frango', 'carne', 'mandioca', 'batata', 'milho', 'plátano'],
    pais: 'Colômbia',
    latitude: 4.7110,
    longitude: -74.0721,
    dica: 'Sopa tradicional colombiana, varia de ingredientes por region.',
    regiao: 'Nacional',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'co-04',
    prato: 'Empanadas Colombianas',
    ingredientes: ['farinha de milho', 'carne', 'batata', 'cebola', 'cominho'],
    pais: 'Colômbia',
    latitude: 4.7110,
    longitude: -74.0721,
    dica: 'Empanada feita com farinha de milho, tradicionalmente frita.',
    regiao: 'Nacional',
    categoria: 'aperitivo',
    dificuldade: 'medio'
  },

  // ARGENTINA
  {
    id: 'ar-01',
    prato: 'Asado',
    ingredientes: ['carne bovina', 'sal grosso', 'chimichurri', 'morcilla'],
    pais: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    dica: 'Tradição argentina de churrasco que reúne família e amigos aos fins de semana.',
    regiao: 'Buenos Aires',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'ar-02',
    prato: 'Empanadas Argentinas',
    ingredientes: ['farinha de trigo', 'carne moída', 'cebola', 'azeitona', 'ovo'],
    pais: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    dica: 'Empanada argentina tradicionalmente assada no forno.',
    regiao: 'Buenos Aires',
    categoria: 'aperitivo',
    dificuldade: 'medio'
  },
  {
    id: 'ar-03',
    prato: 'Alfajores',
    ingredientes: ['farinha', 'manteiga', 'doce de leite', 'coco ralado', 'açúcar'],
    pais: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    dica: 'Doce argentino com biscoitos recheados de doce de leite.',
    regiao: 'Buenos Aires',
    categoria: 'sobremesa',
    dificuldade: 'medio'
  },
  {
    id: 'ar-04',
    prato: 'Locro',
    ingredientes: ['milho branco', 'feijão', 'abóbora', 'carne', 'chorizo'],
    pais: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    dica: 'Ensopado espesso tradicionalmente consumido nas datas pátrias.',
    regiao: 'Nacional',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },

  // CHILE
  {
    id: 'cl-01',
    prato: 'Empanadas de Pino',
    ingredientes: ['carne moída', 'cebola', 'azeitona', 'ovo cozido', 'massa de trigo'],
    pais: 'Chile',
    latitude: -33.4489,
    longitude: -70.6693,
    dica: 'Empanada chilena tradicional, especialmente consumida nas Festas Pátrias.',
    regiao: 'Santiago',
    categoria: 'aperitivo',
    dificuldade: 'medio'
  },
  {
    id: 'cl-02',
    prato: 'Cazuela',
    ingredientes: ['frango', 'abóbora', 'batata', 'milho', 'arroz', 'cenoura'],
    pais: 'Chile',
    latitude: -33.4489,
    longitude: -70.6693,
    dica: 'Sopa chilena com verduras e carne, tradicionalmente de inverno.',
    regiao: 'Santiago',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },
  {
    id: 'cl-03',
    prato: 'Completo Italiano',
    ingredientes: ['pão', 'vinha', 'abacate', 'tomate', 'maionese'],
    pais: 'Chile',
    latitude: -33.4489,
    longitude: -70.6693,
    dica: 'Hot dog chileno com cores da bandeira italiana: verde, branco e vermelho.',
    regiao: 'Santiago',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'cl-04',
    prato: 'Curanto',
    ingredientes: ['mariscos', 'carne', 'batata', 'milho', 'linguiça', 'folhas'],
    pais: 'Chile',
    latitude: -41.4693,
    longitude: -72.9424,
    dica: 'Prato tradicional de Chiloé, cozido em buraco na terra com pedras quentes.',
    regiao: 'Chiloé',
    categoria: 'prato-principal',
    dificuldade: 'dificil'
  },

  // EQUADOR
  {
    id: 'ec-01',
    prato: 'Ceviche Ecuatoriano',
    ingredientes: ['camarão', 'limão', 'cebola roxa', 'tomate', 'coentro', 'banana'],
    pais: 'Equador',
    latitude: -2.1894,
    longitude: -79.8890,
    dica: 'Versão equatoriana do ceviche, tradicionalmente feito com camarão.',
    regiao: 'Costa',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'ec-02',
    prato: 'Locro de Papa',
    ingredientes: ['batata', 'queijo', 'leite', 'cebola', 'alho', 'coentro'],
    pais: 'Equador',
    latitude: -0.2298,
    longitude: -78.5249,
    dica: 'Sopa cremosa de batata tradicional da região andina equatoriana.',
    regiao: 'Sierra',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },
  {
    id: 'ec-03',
    prato: 'Fritada',
    ingredientes: ['carne de porco', 'cebola', 'alho', 'cominho', 'chicha de jora'],
    pais: 'Equador',
    latitude: -0.2298,
    longitude: -78.5249,
    dica: 'Carne de porco refogada, tradicionalmente servida com llapingachos.',
    regiao: 'Sierra',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },

  // VENEZUELA
  {
    id: 've-01',
    prato: 'Arepas Venezuelanas',
    ingredientes: ['farinha de milho', 'água', 'sal', 'queijo branco', 'carne desfiada'],
    pais: 'Venezuela',
    latitude: 10.4806,
    longitude: -66.9036,
    dica: 'Arepa venezuelana tradicionalmente mais espessa que a colombiana.',
    regiao: 'Nacional',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },
  {
    id: 've-02',
    prato: 'Pabellón Criollo',
    ingredientes: ['carne desfiada', 'feijão preto', 'arroz', 'banana frita', 'queijo'],
    pais: 'Venezuela',
    latitude: 10.4806,
    longitude: -66.9036,
    dica: 'Prato nacional venezuelano que representa as cores da bandeira.',
    regiao: 'Nacional',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 've-03',
    prato: 'Tequeños',
    ingredientes: ['massa de trigo', 'queijo branco', 'óleo', 'sal'],
    pais: 'Venezuela',
    latitude: 10.4806,
    longitude: -66.9036,
    dica: 'Aperitivo venezuelano de queijo envolvido em massa e frito.',
    regiao: 'Nacional',
    categoria: 'aperitivo',
    dificuldade: 'medio'
  },

  // BOLÍVIA
  {
    id: 'bo-01',
    prato: 'Salteñas',
    ingredientes: ['farinha', 'carne', 'batata', 'azeitona', 'ovo', 'caldo'],
    pais: 'Bolívia',
    latitude: -17.7833,
    longitude: -63.1821,
    dica: 'Empanada boliviana suculenta, tradicionalmente consumida pela manhã.',
    regiao: 'Nacional',
    categoria: 'aperitivo',
    dificuldade: 'dificil'
  },
  {
    id: 'bo-02',
    prato: 'Llajwa',
    ingredientes: ['tomate', 'locoto', 'quirquiña', 'sal', 'água'],
    pais: 'Bolívia',
    latitude: -17.7833,
    longitude: -63.1821,
    dica: 'Molho picante boliviano, acompanha quase todas as refeições.',
    regiao: 'Nacional',
    categoria: 'aperitivo',
    dificuldade: 'facil'
  },
  {
    id: 'bo-03',
    prato: 'Sopa de Quinoa',
    ingredientes: ['quinoa', 'verduras', 'carne de llama', 'batata', 'cebola'],
    pais: 'Bolívia',
    latitude: -17.7833,
    longitude: -63.1821,
    dica: 'Sopa nutritiva do altiplano boliviano, rica em proteínas andinas.',
    regiao: 'Altiplano',
    categoria: 'prato-principal',
    dificuldade: 'facil'
  },

  // URUGUAI
  {
    id: 'uy-01',
    prato: 'Chivito',
    ingredientes: ['carne', 'presunto', 'queijo', 'ovo', 'tomate', 'alface', 'pão'],
    pais: 'Uruguai',
    latitude: -34.9011,
    longitude: -56.1645,
    dica: 'Sanduíche uruguaio gigante, considerado o prato nacional.',
    regiao: 'Montevidéu',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'uy-02',
    prato: 'Asado Uruguaio',
    ingredientes: ['carne bovina', 'sal', 'chimichurri uruguaio', 'morcilla'],
    pais: 'Uruguai',
    latitude: -34.9011,
    longitude: -56.1645,
    dica: 'Tradição do churrasco uruguaio, similar ao argentino mas com suas particularidades.',
    regiao: 'Nacional',
    categoria: 'prato-principal',
    dificuldade: 'medio'
  },
  {
    id: 'uy-03',
    prato: 'Torta Frita',
    ingredientes: ['farinha', 'gordura', 'sal', 'água', 'fermento'],
    pais: 'Uruguai',
    latitude: -34.9011,
    longitude: -56.1645,
    dica: 'Pão frito uruguaio tradicionalmente consumido em dias de chuva com mate.',
    regiao: 'Nacional',
    categoria: 'aperitivo',
    dificuldade: 'facil'
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
      case 'EC':
        return recipe.pais === 'Equador';
      case 'VE':
        return recipe.pais === 'Venezuela';
      case 'BO':
        return recipe.pais === 'Bolívia';
      case 'UY':
        return recipe.pais === 'Uruguai';
      default:
        return false;
    }
  });
};

export const getRecipesByCategory = (category: string): Recipe[] => {
  return recipes.filter(recipe => recipe.categoria === category);
};

export const getRecipesByDifficulty = (difficulty: string): Recipe[] => {
  return recipes.filter(recipe => recipe.dificuldade === difficulty);
};
