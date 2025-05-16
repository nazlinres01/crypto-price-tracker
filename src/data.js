// data.js
export const mockCryptoData = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 51432,
    price_change_percentage_24h: 2.34,
    price_change_percentage_7d: 5.67,
    market_cap: 980000000000,
    volume_24h: 28000000000,
    circulating_supply: 19423843,
    sparkline: "M0,36L6,32L12,35L18,38L24,33L30,40L36,38L42,50L48,52L54,50L60,48L66,50L72,54L78,56L84,60L90,58L96,62L102,60L108,58L114,56L120,54"
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2780.42,
    price_change_percentage_24h: -1.12,
    price_change_percentage_7d: 3.45,
    market_cap: 334000000000,
    volume_24h: 15000000000,
    circulating_supply: 120000000,
    sparkline: "M0,50L6,48L12,52L18,50L24,48L30,45L36,42L42,40L48,38L54,40L60,42L66,45L72,48L78,50L84,52L90,50L96,48L102,45L108,42L114,40L120,38"
  },
  // Diğer coinler...
];

export const marketStats = {
  totalMarketCap: 1960000000000,
  totalVolume24h: 85000000000,
  btcDominance: 42.5,
  activeCryptocurrencies: 12543,
  upcomingIcos: 32,
  ongoingIcos: 15,
  endedIcos: 278
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2
  }).format(price);
};

export const formatLargeNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (num) => {
  return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
};