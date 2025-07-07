'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Enhanced Left side - Logo */}
        <Link href="/">
          <div className="flex items-center space-x-3 group">
            <Logo size={32} className="interactive-scale" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-amber-200 transition-all duration-300">
              WorkFlow AI
            </h1>
          </div>
        </Link>

        {/* Enhanced Center - Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#pricing"
            className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium relative group"
          >
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <a
            href="#marketplace"
            className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium relative group"
          >
            MarketPlace
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#workflows"
            className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium relative group"
          >
            Workflows
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>

        {/* Enhanced Right side - Get Started Button */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors backdrop-blur-sm border border-slate-700/30"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Enhanced Get Started Button */}
          <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold">
            Get Started
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <a
              href="#pricing"
              className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#marketplace"
              className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MarketPlace
            </a>
            <a
              href="#workflows"
              className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workflows
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 