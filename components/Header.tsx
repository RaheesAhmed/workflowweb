'use client';

import React from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`sticky top-0 z-50 glass-effect bg-gray-900/80 border-b border-gray-700/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left side - Logo */}
         <Link href="/">
        <div className="flex items-center space-x-3">
         
          <Logo size={32} className="interactive-scale" />
          <h1 className="text-xl font-bold text-white">
            WorkFlowAI
          </h1>
         
        </div>
         </Link>

        {/* Center - Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#pricing"
            className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium interactive-scale"
          >
            Pricing
          </Link>
          <a
            href="#marketplace"
            className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium interactive-scale"
          >
            MarketPlace
          </a>
          <a
            href="#workflows"
            className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium interactive-scale"
          >
            Workflows
          </a>
        </nav>

        {/* Right side - Get Started Button */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors interactive-scale">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Get Started Button */}
          <Button className="btn-premium shadow-primary hover:shadow-xl transition-all duration-300">
            Get Started
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden border-t border-gray-700/50 glass-effect bg-gray-900/95">
        <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3">
          <a
            href="#pricing"
            className="block text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2 interactive-scale"
          >
            Pricing
          </a>
          <a
            href="#marketplace"
            className="block text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2 interactive-scale"
          >
            MarketPlace
          </a>
          <a
            href="#workflows"
            className="block text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2 interactive-scale"
          >
            Workflows
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 