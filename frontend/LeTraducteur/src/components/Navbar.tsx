import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-[#2cd0fa] p-4">
      <div className="flex items-center justify-center">
      <h1 className="text-navy font-permanent-marker text-4xl md:text-6xl lg:text-8xl xl:text-9xl bg-[#2cd0fa]">
          LeTraducteur
        </h1>        <h5 className="text-navy font-dosis">The Translator</h5>
      </div>
    </nav>
  );
};

export default Navbar;