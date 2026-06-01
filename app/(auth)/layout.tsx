import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-[#F2F2F2] px-4 h-14 flex items-center">
        <Link href="/" className="font-black text-xl">
          Mode<span className="bg-[#CDFF00] px-1 rounded">Scout</span>
        </Link>
      </header>
      <main className="flex-1 flex items-start md:items-center justify-center px-4 pt-8 pb-12 bg-white">
        {children}
      </main>
    </div>
  )
}
