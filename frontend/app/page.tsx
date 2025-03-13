import Link from "next/link";
export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white overflow-hidden font-sans">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 opacity-50 blur-2xl"></div>

      {/* Main Content */}
      <section className="relative z-10 text-center max-w-5xl p-8">
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-gradient">
          Game Vault
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your ultimate gaming universe — store your collection, rate and review games, and explore personalized recommendations.
        </p>

        {/* Interactive Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* Game Collection */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-black shadow-lg transform hover:scale-105 transition duration-500 cursor-pointer">
            <h2 className="text-3xl font-bold text-white">Game Collection</h2>
            <p className="text-gray-400 mt-2">
              Add and organize your personal game library in one place.
            </p>
           
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-black shadow-lg transform hover:scale-105 transition duration-500 cursor-pointer">
            <h2 className="text-3xl font-bold text-white">Reviews & Ratings</h2>
            <p className="text-gray-400 mt-2">
              Share your thoughts and rate your favorite  games.
            </p>
          </div>

          <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-black shadow-lg transform hover:scale-105 transition duration-500 cursor-pointer">
            <h2 className="text-3xl font-bold text-white">Multimedia Support</h2>
            <p className="text-gray-400 mt-2">
              Upload and showcase game screenshots, trailers, and clips effortlessly.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mt-20">
          <Link href="/sign-in">
            <button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-500 hover:to-purple-400 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-500">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
