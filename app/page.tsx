"use client";

import { navItems } from "../data";

import Hero from "./(hero)/Hero";
import { FloatingNav } from "./(hero)/_components/FloatingNav";
import Footer from "./(hero)/Footer";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="w-screen">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Footer/>
      </div>
    </main>
  );
};

export default Home;