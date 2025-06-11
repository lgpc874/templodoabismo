import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold text-center py-20">
          🏛️ TEMPLO DO ABISMO
        </h1>
        <p className="text-center text-gray-400">
          Site limpo - Pronto para começar do zero
        </p>
      </div>
    </QueryClientProvider>
  );
}

export default App;