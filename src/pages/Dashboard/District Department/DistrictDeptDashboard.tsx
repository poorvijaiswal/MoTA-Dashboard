import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;