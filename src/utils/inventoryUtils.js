export const LOW_STOCK_LIMIT = 5;

export const getStockStatus = (quantity) => {
    if (quantity <= 0) return 'outOfStock';
    if (quantity <= LOW_STOCK_LIMIT) return 'lowStock';
    return 'inStock';
};