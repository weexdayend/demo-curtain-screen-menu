import { FullScreenMenu } from "@/components/FullScreenMenu";

export default function Home() {
  return (
    <main className="min-h-screen bg-(--cream) text-(--ink)">
      <FullScreenMenu />

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 text-white mix-blend-difference">
        <a href="#home" className="text-xs font-semibold uppercase tracking-[0.3em]">
          UIGERHANA
        </a>
      </header>

      <section id="home" className="relative min-h-screen overflow-hidden bg-[#17130f] text-[#e8e5dc]">
        <img
          src="/assets/store.jpg"
          alt="Editorial storefront"
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-60"
        />
        <div className="relative z-10 flex min-h-screen items-end p-6 pb-16 md:p-10">
          <div>
            <h1 className="max-w-4xl text-6xl font-semibold uppercase leading-[0.82] tracking-[-0.06em] md:text-9xl">
              Curtain
              <br />
              Transition
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
}
