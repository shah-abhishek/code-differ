import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 p-4">
      <ul className="space-y-2">
        <li><a href="#" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a></li>
        <li><a href="#" className="block p-2 hover:bg-gray-200 rounded">Settings</a></li>
        <li><a href="#" className="block p-2 hover:bg-gray-200 rounded">Profile</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;