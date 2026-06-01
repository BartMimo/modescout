import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0D0D0D] text-[#F5F5EF] px-4 h-14 flex items-center">
        <Link href="/" className="text-lg font-bold">
          Mode<span className="text-[#CDFF00]">Scout</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[#F5F5EF]">
        {children}
      </main>
    </div>
  )
}
