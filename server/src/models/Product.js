/**
 * Product Model
 * Represents a Decathlon product with label and URL
 */

const fs = require('fs');
const path = require('path');
const { DECATHLON_BASE_URL } = require('../config/constants');

class Product {
  /**
   * Create a Product instance
   * @param {Object} data - Product data from JSON
   */
  constructor(data) {
    this.label = data.label || '';
    this.url = data.url || '';
    // Additional fields with defaults or extracted from label/url
    this.brand = data.brand || this._extractBrand();
    this.description = data.description || this._generateDescription();
    this.price = data.price || this._generatePrice();
    this.rating = data.rating || this._generateRating();
    this.reviews = data.reviews || this._generateReviews();
    this.image = data.image || this._generateImageUrl();
  }

  /**
   * Extract brand from URL or label
   * @returns {string} Brand name
   * @private
   */
  _extractBrand() {
    // Check for marketplace products (mp/ in url)
    if (this.url.includes('/mp/')) {
      const match = this.url.match(/\/mp\/([^/]+)\//);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1).replace(/-/g, ' ');
      }
    }
    
    // Check for known brands in label
    const knownBrands = ['Garmin', 'Domyos', 'Kalenji', 'Kiprun', 'Quechua', 'Forclaz', 'Btwin', 'Van Rysel', 'Rockrider', 'Nabaiji', 'Aptonia', 'Nyamba'];
    const labelLower = this.label.toLowerCase();
    for (const brand of knownBrands) {
      if (labelLower.includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
    return 'Decathlon';
  }

  /**
   * Generate a description from label
   * @returns {string} Product description
   * @private
   */
  _generateDescription() {
    return `${this.label}. Produit de qualité sélectionné par Decathlon pour accompagner votre entraînement.`;
  }

  /**
   * Generate a realistic price based on product type
   * @returns {number} Price in euros
   * @private
   */
  _generatePrice() {
    const labelLower = this.label.toLowerCase();
    
    // High-end electronics
    if (labelLower.includes('garmin') || labelLower.includes('montre') || labelLower.includes('gps')) {
      return Math.floor(Math.random() * 300) + 150; // 150-450€
    }
    
    // Fitness equipment
    if (labelLower.includes('tapis') || labelLower.includes('vélo') || labelLower.includes('velo')) {
      return Math.floor(Math.random() * 200) + 100; // 100-300€
    }
    
    // Accessories
    if (labelLower.includes('casque') || labelLower.includes('bande') || labelLower.includes('gourde')) {
      return Math.floor(Math.random() * 50) + 20; // 20-70€
    }
    
    // Default mid-range
    return Math.floor(Math.random() * 60) + 20; // 20-80€
  }

  /**
   * Generate realistic rating
   * @returns {number} Rating out of 5
   * @private
   */
  _generateRating() {
    // Most Decathlon products have good ratings (3.5-5)
    return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  }

  /**
   * Generate realistic review count
   * @returns {number} Number of reviews
   * @private
   */
  _generateReviews() {
    return Math.floor(Math.random() * 500) + 10;
  }

  /**
   * Generate image URL from product URL
   * @returns {string} Image URL
   * @private
   */
  _generateImageUrl() {
    // Try to construct a Decathlon product image URL
    // Format: https://contents.mediadecathlon.com/p{productId}/k$...
    const match = this.url.match(/R-p-(\d+)/);
    if (match) {
      return `https://contents.mediadecathlon.com/p${match[1]}/sq/200x200/`;
    }
    
    // For marketplace products, use a placeholder
    return 'https://contents.mediadecathlon.com/s894037/k$d26c4de3bb9d2c8aa58e8a3e3b1d3f47/sq/200x200/decathlon-logo.jpg';
  }

  /**
   * Load all products from JSON file
   * @param {string} filePath - Path to products.json
   * @returns {Map<string, Product>} Map of products keyed by lowercase label
   */
  static loadAll(filePath) {
    const absolutePath = path.resolve(filePath);
    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    const productsData = JSON.parse(rawData);

    const productsMap = new Map();

    for (const data of productsData) {
      const product = new Product(data);
      // Key by lowercase label for case-insensitive lookup
      productsMap.set(product.label.toLowerCase(), product);
    }

    return productsMap;
  }

  /**
   * Get list of product labels for LLM prompt
   * @param {Map<string, Product>} productsMap - Map of products
   * @returns {string[]} Array of product labels
   */
  static getLabelsList(productsMap) {
    const labels = [];
    for (const product of productsMap.values()) {
      labels.push(product.label);
    }
    return labels;
  }

  /**
   * Get full Decathlon URL for this product
   * @returns {string} Full product URL
   */
  getFullUrl() {
    // If URL already starts with http, return as-is
    if (this.url.startsWith('http')) {
      return this.url;
    }
    // Otherwise prepend Decathlon base URL
    return `${DECATHLON_BASE_URL}${this.url}`;
  }

  /**
   * Serialize product for API response
   * @returns {Object} JSON-serializable object
   */
  toJSON() {
    return {
      label: this.label,
      brand: this.brand,
      description: this.description,
      price: this.price,
      rating: this.rating,
      reviews: this.reviews,
      url: this.getFullUrl(),
      image: this.image,
    };
  }
}

module.exports = Product;
