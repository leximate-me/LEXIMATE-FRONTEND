import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { isAuthenticated, logOut } = useAuth();
  return (
    <nav className="bg-zinc-900 p-4 flex justify-between items-center rounded-md">
      <Link to="/">
        <h1 className="text-white text-xl font-semibold">Task Manager</h1>
      </Link>
      <div
        className="flex space-x-4 items-center
      "
      >
        {isAuthenticated ? (
          <>
            <Link to="/tasks/new">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                New
              </button>
            </Link>
            <Link to="/tasks">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Tasks
              </button>
            </Link>
            <Link to="/profile">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Profile
              </button>
            </Link>
            <Link
              to="/"
              onClick={() => {
                logOut();
              }}
            >
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                logaut
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
