'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LayoutDashboard, ListTodo, Menu, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserMenu } from './user-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Task Manager
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/tasks" 
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Tasks
                </Link>
                
                <div className="hidden md:block">
                  <UserMenu user={user || { name: '', email: '', createdAt: '' }} onLogout={handleLogout} />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/login" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                    Masuk
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Daftar
                  </Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu and user menu */}
          <div className="flex items-center space-x-2 md:hidden">
            {isAuthenticated && (
              <UserMenu user={user || { name: '', email: '', createdAt: '' }} onLogout={handleLogout} className="md:hidden" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Tasks
                </Link>
                <div className="pt-2 border-t">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Daftar
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
