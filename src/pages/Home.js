import React from 'react';
import Hearts from '../components/Hearts';

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen font-mono relative">
      <Hearts />
      {/* <Porter 
        text="<3" 
        count={4} 
        speed={5} 
        color="#ff69b4" 
        size="1.5em"
        sentences={[
          "Welcome to Porter Robinson",
          "Everything to Me",
          "Toronto 09/21/24",
          "Enjoy the show!"
        ]}
      /> */}
      {/* snow */}
      {/* <Snow text="<3" count={1000} speed={1} color="#ff69b4" size="1.5em" /> */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto p-4 relative z-10">
          <header className="p-4 mb-8 text-center">
            <h1 className="text-5xl font-bold uppercase tracking-widest text-white">Everything to Me</h1>
          </header>
          <main className="p-8 text-center">
            <section className="mb-6">
              <p className="text-2xl font-semibold text-yellow-400">Text Art Inspired By Porter Robinson <br/> Toronto 09/21/24.</p>
            </section>
            <section>
              {/* <Falling text="♥" count={100} speed={3} /> */}
            </section>
          </main>
          <footer className="mt-8 p-4 text-center">
            <p className="text-xl text-white">Jacky :) ~ @jacky__liu</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;