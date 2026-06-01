import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import CartProvider from '@/components/shop/CartProvider'
import BottomNav from '@/components/shop/BottomNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </CartProvider>
  )
}
