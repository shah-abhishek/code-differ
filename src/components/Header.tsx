import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">My React App</h1>
      <nav className="flex gap-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About</a>
      </nav>
    </header>
  );
};

export default Header;
