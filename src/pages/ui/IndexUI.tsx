import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { CollectionCard } from '@/components/CollectionCard';
import { FloatingCart } from '@/components/FloatingCart';
import { NewsletterSection } from '@/components/NewsletterSection';
import { EcommerceTemplate } from '@/templates/EcommerceTemplate';
import { PetSelector } from '@/components/PetSelector';
import type { UseIndexLogicReturn } from '@/components/headless/HeadlessIndex';
import { ArrowRight } from 'lucide-react';

/**
 * EDITABLE UI - IndexUI
 * 
 * Minimal Japanese style pet wellness store homepage
 */

interface IndexUIProps {
  logic: UseIndexLogicReturn;
}

export const IndexUI = ({ logic }: IndexUIProps) => {
  const {
    collections,
    loading,
    loadingCollections,
    selectedCollectionId,
    filteredProducts,
    handleViewCollectionProducts,
    handleShowAllProducts,
  } = logic;

  return (
    <EcommerceTemplate 
      showCart={true}
    >
      {/* Hero Section - Minimal Japanese Aesthetic */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/hero-pet.jpg" 
            alt="Premium pet wellness"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background"></div>
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight">
                  Natural
                  <br />
                  <span className="font-semibold">Wellness</span>
                  <br />
                  for Pets
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Premium nutrition crafted with care. Because they deserve the best.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-base"
                  onClick={() => {
                    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base"
                  onClick={() => {
                    document.getElementById('pet-selector')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Find Your Match
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Selector Section */}
      <section id="pet-selector" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PetSelector 
            onSelection={(petType, age, breed) => {
              console.log('Selected:', { petType, age, breed })
              // Scroll to products
              document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </div>
      </section>

      {/* Collections Section */}
      {!loadingCollections && collections.length > 0 && (
        <section id="collections" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Shop by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Carefully curated selections for every need
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <CollectionCard 
                  key={collection.id} 
                  collection={collection} 
                  onViewProducts={handleViewCollectionProducts} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                {selectedCollectionId 
                  ? collections.find(c => c.id === selectedCollectionId)?.name || 'Products'
                  : 'Featured Products'
                }
              </h2>
              <p className="text-muted-foreground">
                Premium quality for your beloved companions
              </p>
            </div>
            {selectedCollectionId && (
              <Button 
                variant="outline" 
                onClick={handleShowAllProducts}
              >
                View All
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products available in this category.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleShowAllProducts}
              >
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-medium text-foreground">Natural Ingredients</h3>
              <p className="text-muted-foreground">
                Only the finest natural ingredients, sourced responsibly
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-medium text-foreground">Science-Backed</h3>
              <p className="text-muted-foreground">
                Formulated with veterinary nutritionists for optimal health
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-medium text-foreground">Made with Love</h3>
              <p className="text-muted-foreground">
                Every product crafted with care for your pet's wellbeing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      <FloatingCart />
    </EcommerceTemplate>
  );
};