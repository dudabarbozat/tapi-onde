# TapiOnde — de onde é este prato?

Jogo de geografia gastronômica: você vê os ingredientes e uma dica de um prato típico da América Latina e marca no mapa de onde ele vem. Quanto mais perto, mais pontos.

**Jogar:** https://dudabarbozat.github.io/tapi-onde/

## Para quem

Quem gosta de comida, de viagem ou de geografia, e professores que querem um jeito leve de falar de cultura latino-americana.

## Como funciona

- Escolha um entre 10 países: Brasil, Argentina, México, Colômbia, Peru, Chile, Equador, Venezuela, Bolívia e Uruguai.
- A cada rodada aparecem os ingredientes e uma dica. Você marca a origem no mapa e confirma.
- O resultado mostra a distância, a pontuação (de 100 a 1.000), a foto do prato, uma curiosidade e como ele é feito.
- Uma partida tem 5 pratos.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · Leaflet

Sem backend: os pratos ficam em `src/data/pratos.json` e as fotos em `public/pratos/`.

## Como rodar

```bash
npm ci
npm run dev
```

## Conteúdo

Cada prato tem a origem, os ingredientes e o preparo conferidos na fonte indicada no próprio jogo. As fotos são do [Wikimedia Commons](https://commons.wikimedia.org/), com autor e licença exibidos junto de cada imagem. Mapa © colaboradores do [OpenStreetMap](https://www.openstreetmap.org/copyright); fronteiras do mapa de escolha: [Natural Earth](https://www.naturalearthdata.com/) (domínio público).

## Licença

Código sob [MIT](LICENSE). Fotos sob as licenças indicadas em cada uma.
