import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div>
      <div className="bg-[#0D0D0D] px-4 py-16 md:py-24 text-center">
        <div className="animate-pulse space-y-3 max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#222] mx-auto" />
          <div className="h-8 bg-[#222] rounded w-48 mx-auto" />
          <div className="h-4 bg-[#1a1a1a] rounded w-64 mx-auto" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-7 bg-[#E8E8E2] rounded w-32 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
