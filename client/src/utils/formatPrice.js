export const formatPrice = (price, currency) => {
    const rate = 300; // 1 USD = 300 LKR (Static Rate for demo)
    
    if (currency === "LKR") {
      return `LKR ${(price * rate).toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };