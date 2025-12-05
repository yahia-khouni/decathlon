import { motion } from 'framer-motion';
import { LoadingCard } from '@/components/ui';
import type { Product } from '@/types';
import { ShoppingCart, Star, ExternalLink, RotateCcw, CheckCircle } from 'lucide-react';
import DecathlonLogo from '@/assets/Decathlon.png';

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRestart: () => void;
  onRetry: () => void;
}

export function ProductsSection({ 
  products, 
  isLoading, 
  error, 
  onRestart,
  onRetry 
}: ProductsSectionProps) {
  if (isLoading) {
    return (
      <LoadingCard 
        message="Recherche des équipements..."
        submessage="Notre IA sélectionne les meilleurs produits Decathlon pour accompagner vos exercices."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Top White Bar */}
        <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
          <div className="container mx-auto flex items-center">
            <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
          </div>
        </div>
        
        {/* Main Section */}
        <div 
          className="flex-1 flex items-center justify-center px-4"
          style={{ background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)" }}
        >
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>
              Une erreur est survenue
            </h3>
            <p className="mb-6" style={{ color: '#6b7280' }}>{error}</p>
            <button
              onClick={onRetry}
              style={{
                background: '#ffeb00',
                color: '#1a1a2e',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>

        {/* Bottom White Bar */}
        <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
          <span className="text-sm text-gray-500">
            Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
          </span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
          <div className="container mx-auto flex items-center">
            <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
          </div>
        </div>
        <div 
          className="flex-1 flex items-center justify-center px-4"
          style={{ background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)" }}
        >
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>
              Aucun produit trouvé
            </h3>
            <p className="mb-6" style={{ color: '#6b7280' }}>
              Nous n'avons pas pu trouver de produits correspondants.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={onRetry}
                style={{
                  background: 'rgba(0, 130, 195, 0.1)',
                  color: '#0082c3',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Réessayer
              </button>
              <button
                onClick={onRestart}
                style={{
                  background: '#ffeb00',
                  color: '#1a1a2e',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Recommencer
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
          <span className="text-sm text-gray-500">
            Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Product Counter - Fixed Top Right Corner */}
      <div 
        style={{ 
          position: 'fixed',
          top: '25px',
          right: '40px',
          zIndex: 50,
          background: 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ color: '#ffeb00', fontWeight: '700', fontSize: '14px' }}>
          {products.length}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500' }}>
          produits
        </span>
      </div>

      {/* Top White Bar with Decathlon Logo */}
      <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
        <div className="container mx-auto flex items-center">
          <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
        </div>
      </div>

      {/* Main Section with Blue Gradient */}
      <section
        id="products"
        className="flex-1 relative overflow-auto"
        style={{
          background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 0',
          minHeight: '0',
        }}
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '24px' }}
          >
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '50px',
                marginBottom: '12px',
                background: 'rgba(255, 152, 0, 0.2)',
                border: '1px solid rgba(255, 152, 0, 0.3)'
              }}
            >
              <ShoppingCart className="w-4 h-4" style={{ color: '#ff9800' }} />
              <span className="font-medium" style={{ color: '#ff9800' }}>Équipements recommandés</span>
            </div>
            <h2 
              style={{ 
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '8px',
                color: 'white', 
                textShadow: '0 2px 10px rgba(0,0,0,0.2)' 
              }}
            >
              Complétez votre entraînement
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto', fontSize: '14px' }}>
              Découvrez les équipements Decathlon sélectionnés par notre IA pour optimiser vos exercices.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {products.map((product, index) => (
              <motion.div
                key={product.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px 32px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#ffeb00' }} />
                <div style={{ textAlign: 'left' }}>
                  <h3 
                    style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '700', 
                      color: 'white', 
                      marginBottom: '2px',
                    }}
                  >
                    Votre programme est prêt !
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>
                    Commencez dès aujourd'hui
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onRestart}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Recommencer
                </button>
                <button 
                  onClick={() => window.open('https://www.decathlon.fr', '_blank')}
                  style={{
                    background: '#ffeb00',
                    color: '#1a1a2e',
                    fontWeight: '700',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 20px rgba(255, 235, 0, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Visiter Decathlon.fr
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom White Bar */}
      <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
        <span className="text-sm text-gray-500">
          Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
        </span>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      className="hover:scale-[1.02]"
    >
      {/* Image */}
      <div 
        style={{ 
          position: 'relative',
          height: '160px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          overflow: 'hidden',
        }}
      >
        <motion.img
          src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
          alt={product.label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '12px',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Product';
          }}
        />
        
        {/* Badge */}
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <span 
            style={{
              background: 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '50px',
            }}
          >
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
          {product.brand}
        </span>

        {/* Name */}
        <h3 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '13px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.label}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3"
                style={{
                  color: i < Math.floor(product.rating) ? '#ffeb00' : '#e5e7eb',
                  fill: i < Math.floor(product.rating) ? '#ffeb00' : 'transparent',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
          {product.description}
        </p>

        {/* Price & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f3f4f6', marginTop: 'auto' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0082c3' }}>
            {product.price.toFixed(2)}€
          </span>
          <button
            onClick={() => window.open(product.url, '_blank')}
            style={{
              background: '#ffeb00',
              color: '#1a1a2e',
              fontWeight: '600',
              padding: '6px 14px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease',
            }}
          >
            Voir
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
