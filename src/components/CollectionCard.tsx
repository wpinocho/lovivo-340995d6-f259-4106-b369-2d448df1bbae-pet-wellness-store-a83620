import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Collection } from '@/lib/supabase'

interface CollectionCardProps {
  collection: Collection
  onViewProducts: (collectionId: string) => void
}

export const CollectionCard = ({ collection, onViewProducts }: CollectionCardProps) => {
  return (
    <Card className="group bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          {collection.image ? (
            <img 
              src={collection.image} 
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-3">
          <h3 className="text-foreground font-medium text-lg">
            {collection.name}
          </h3>
          
          {collection.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {collection.description}
            </p>
          )}
          
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
            onClick={() => onViewProducts(collection.id)}
          >
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}