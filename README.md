# TapiOnde — de onde é este prato?

Jogo educativo de geografia pela comida da América Latina: a partir dos ingredientes e de uma dica, a pessoa descobre em qual estado, província ou região nasceu um prato típico.

**Jogar:** https://dudabarbozat.github.io/tapi-onde/

## Para quem

Professores e estudantes do ensino fundamental e médio, e qualquer pessoa curiosa por comida, viagem e geografia. Funciona no navegador, sem cadastro.

## Como funciona

- Escreva o seu nome e escolha um país da América Latina no mapa, ou jogue em grupo (2 a 6 pessoas no mesmo aparelho).
- Depois da contagem, o cronômetro começa. Cada rodada mostra os ingredientes e uma dica.
- No mapa do país, toque no estado (ou província, região, departamento) de origem e confirme.
- Acertar o lugar vale 1.000 pontos; errando, a pontuação cai com a distância. Responder rápido dá até 300 pontos de bônus, proporcional ao acerto.
- O resultado mostra o lugar certo no mapa, a foto, uma curiosidade, como o prato é feito e a fonte. Ao fim dos 5 pratos aparece o resumo da partida.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · Leaflet

Sem backend:

- `src/data/pratos.json`: os pratos; o campo `estado` é calculado a partir das coordenadas.
- `public/pratos/`: as fotos.
- `public/estados/`: as divisões internas de cada país, carregadas só quando o país é jogado.
- `src/data/america-latina.json`: as fronteiras do mapa de escolha.

## Como rodar

```bash
npm ci
npm run dev
```

## Conteúdo

Cada prato tem a origem, os ingredientes e o preparo conferidos na fonte indicada no próprio jogo. As fotos são do [Wikimedia Commons](https://commons.wikimedia.org/), com autor e licença exibidos junto de cada imagem. Fronteiras de países e estados: [Natural Earth](https://www.naturalearthdata.com/) (domínio público), simplificadas.

## Licença

Código sob [MIT](LICENSE). Fotos sob as licenças indicadas em cada uma.
