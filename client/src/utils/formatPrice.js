export const formatPrice = (price, currency) => {
    const rate = 300; 
    
    if (currency === "LKR") {
      return `LKR ${(price * rate).toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };