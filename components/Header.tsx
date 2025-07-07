'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  User,
  LogOut,
  Settings,
  ChevronDown,
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((name: string) => name.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <header className={`sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <Logo />
              <h1 className="text-xl font-bold text-slate-200">
                WorkFlow AI
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-slate-300 hover:text-indigo-400 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/marketplace"
              className="text-slate-300 hover:text-indigo-400 transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              href="/#pricing"
              className="text-slate-300 hover:text-indigo-400 transition-colors font-medium"
            >
              Pricing
            </Link>
            {/* AI Playground - Only show when logged in */}
            {user && (
              <Link
                href="/ai-playground"
                className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI Playground
              </Link>
            )}
          </nav>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400">Loading...</span>
              </div>
            ) : user ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors backdrop-blur-sm border border-slate-700/30 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl shadow-black/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <div className="text-sm font-medium text-slate-300">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {user.email}
                      </div>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      href="/ai-playground"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI Playground</span>
                    </Link>
                    
                    <button
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <hr className="my-2 border-slate-700/50" />
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Non-authenticated buttons */
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="border-slate-600 hover:bg-slate-700 text-slate-300 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors backdrop-blur-sm border border-slate-700/30"
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6 text-slate-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/#features"
                className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/marketplace"
                className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/#pricing"
                className="block text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {/* AI Playground - Only show when logged in (mobile) */}
              {user && (
                <Link
                  href="/ai-playground"
                  className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Playground
                </Link>
              )}
              
              {user && (
                <>
                  <hr className="border-slate-700/50" />
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium py-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
              
              {!user && (
                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-600 hover:bg-slate-700 text-slate-300 transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header; 