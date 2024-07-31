import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-green-300 p-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-permanent-marker text-center leading-none ">
          <span className="text-red-600">le</span>
          <span className="text-blue-700">Traducteur</span>
          <span>{" "}</span>
          <span className="text-black">der</span>
          <span className="text-yellow-500">Übersetzer</span>
        </h1>
        <h5 className="text-navy font-dosis text-lg md:text-xl mt-4">
          The EN ↔ FR | DE Bridge Translator
        </h5>
      </div>
    </nav>
  );
};

export default Navbar;