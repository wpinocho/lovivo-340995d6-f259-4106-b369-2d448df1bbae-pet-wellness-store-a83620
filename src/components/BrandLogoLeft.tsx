import { useSettings } from '@/contexts/SettingsContext'
import { getLogoUrl } from '@/lib/logo-utils'

export const BrandLogoLeft = () => {
  const { logos } = useSettings()

  if (!logos) {
    return (
      <h1 className="text-xl font-light text-foreground tracking-tight">
        Pet <span className="font-semibold">Wellness</span>
      </h1>
    )
  }

  const mainLogoUrl = getLogoUrl(logos, 'main_logo')

  if (!mainLogoUrl) {
    return (
      <h1 className="text-xl font-light text-foreground tracking-tight">
        Pet <span className="font-semibold">Wellness</span>
      </h1>
    )
  }

  return (
    <a href="/" aria-label="Home">
      <img 
        src={mainLogoUrl} 
        alt="Main logo"
        className="h-9 w-auto object-contain" 
      />
    </a>
  )
}