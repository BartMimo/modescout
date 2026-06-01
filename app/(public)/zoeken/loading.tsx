import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-11 bg-[#E8E8E2] rounded-xl w-full max-w-xl mb-8 animate-pulse" />
      <div className="flex gap-2 mb-8">
        <div className="h-9 w-24 bg-[#E8E8E2] rounded-full animate-pulse" />
        <div className="h-9 w-20 bg-[#E8E8E2] rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  )
}
