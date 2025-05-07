// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-600px)]">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">A página que você está procurando não existe.</p>
    </div>
  );
}
