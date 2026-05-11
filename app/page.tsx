export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <section className="w-full max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          Vida e Tarefas
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-6xl">
          Sistema JK
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
          MVP local do segundo cerebro pessoal de John Kevin, iniciando pela
          base simples para organizar vida e tarefas.
        </p>
      </section>
    </main>
  );
}
