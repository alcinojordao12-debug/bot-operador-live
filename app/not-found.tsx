import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold font-mono text-amber-400 mb-2">404 - Página Não Encontrada</h2>
      <p className="text-sm text-slate-400 mb-6">A sala solicitada não existe no escritório da HUMANO BOT.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-lg transition-colors"
      >
        Voltar ao Escritório
      </Link>
    </div>
  );
}
