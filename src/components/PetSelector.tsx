import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dog, Cat } from 'lucide-react'

interface PetSelectorProps {
  onSelection?: (petType: string, age: string, breed: string) => void
}

export const PetSelector = ({ onSelection }: PetSelectorProps) => {
  const [petType, setPetType] = useState<'dog' | 'cat' | null>(null)
  const [age, setAge] = useState<string>('')
  const [breed, setBreed] = useState<string>('')

  const dogBreeds = [
    'Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 
    'Beagle', 'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Mixed Breed'
  ]

  const catBreeds = [
    'Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 
    'British Shorthair', 'Bengal', 'Sphynx', 'Scottish Fold', 'Domestic Shorthair', 'Mixed Breed'
  ]

  const ageGroups = ['Puppy/Kitten (0-1 year)', 'Adult (1-7 years)', 'Senior (7+ years)']

  const handleFindProducts = () => {
    if (petType && age) {
      onSelection?.(petType, age, breed)
    }
  }

  const breeds = petType === 'dog' ? dogBreeds : petType === 'cat' ? catBreeds : []

  return (
    <Card className="p-8 bg-card border-border">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">Find the Perfect Nutrition</h3>
          <p className="text-muted-foreground">Tell us about your companion</p>
        </div>

        {/* Pet Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={petType === 'dog' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setPetType('dog')}
            className="h-24 flex flex-col gap-2"
          >
            <Dog className="h-8 w-8" />
            <span>Dog</span>
          </Button>
          <Button
            variant={petType === 'cat' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setPetType('cat')}
            className="h-24 flex flex-col gap-2"
          >
            <Cat className="h-8 w-8" />
            <span>Cat</span>
          </Button>
        </div>

        {/* Age & Breed Selection */}
        {petType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Age Group</label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Breed (Optional)</label>
              <Select value={breed} onValueChange={setBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  {breeds.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {petType && age && (
          <Button 
            size="lg" 
            className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
            onClick={handleFindProducts}
          >
            Find Recommended Products
          </Button>
        )}
      </div>
    </Card>
  )
}