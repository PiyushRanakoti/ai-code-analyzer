import React from 'react';

const Header = () => {
  return (
    <header className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700 mt-5">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-white to-green-700 mb-4 tracking-tight uppercase animate-gradient-x">
        AI BASED CODE PLAGIARISM DETECTOR
      </h1>
      <p className="text-slate-400 text-base max-w-2xl mx-auto">
        Advanced detection system for identifying AI patterns in source code.
      </p>
    </header>
  );
};

export default Header;
