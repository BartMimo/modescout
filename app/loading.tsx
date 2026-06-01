import { ProductCardSkeleton, BrandCardSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-[#0D0D0D] px-4 py-20 md:py-32 text-center">
        <div className="animate-pulse space-y-4 max-w-lg mx-auto">
          <div className="h-3 bg-[#222] rounded w-48 mx-auto" />
          <div className="h-10 bg-[#222] rounded w-full" />
          <div className="h-10 bg-[#222] rounded w-3/4 mx-auto" />
          <div className="h-5 bg-[#1a1a1a] rounded w-96 mx-auto" />
        </div>
      </div>

      {/* Brands skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-7 bg-[#E8E8E2] rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => <BrandCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-[#E0E0DA]">
        <div className="h-7 bg-[#E8E8E2] rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
