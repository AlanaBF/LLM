import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-green-300 p-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-permanent-marker text-center leading-none">
          <span className="text-red-600">le</span>
          <span className="text-blue-700">Traducteur</span>
        </h1>
        <h5 className="text-navy font-dosis text-lg md:text-xl mt-2">
          Translate & Learn  🇫🇷  🇩🇪  🇪🇸  🇮🇹
        </h5>
        <div className="flex gap-3 mt-4">
          <NavLink
            to="/translate"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full font-dosis font-semibold transition-all ${
                isActive
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-navy hover:bg-navy hover:text-white'
              }`
            }
          >
            Translate
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full font-dosis font-semibold transition-all ${
                isActive
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-navy hover:bg-navy hover:text-white'
              }`
            }
          >
            Learn
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full font-dosis font-semibold transition-all ${
                isActive
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-navy hover:bg-navy hover:text-white'
              }`
            }
          >
            Practice
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
