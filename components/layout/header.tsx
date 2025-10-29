"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, useHydrateAuthFromStorage } from "@/hooks/useAuthStore";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/hooks/useUsers";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId, token, clear } = useAuthStore();
  const { user, fetchUserById, loading } = useUsers();
  
  // Hydrate auth state from localStorage
  const isHydrated = useHydrateAuthFromStorage();
  
  // Fetch user data when token is available
  useEffect(() => {
    if (token && userId) {
      fetchUserById(userId);
    }
  }, [token, fetchUserById, userId]);

  console.log(userId);
  // Skip rendering on auth pages or while hydrating
  const isAuthPage = ['/login', '/register'].some(
    (path) => pathname.startsWith(path)
  );

  if (isAuthPage || !isHydrated) {
    return null;
  }

  const handleLogout = () => {
    clear();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">TaskFlow</span>
            </Link>
          </div>

          {/* Navigation - Only show when authenticated */}
          {token && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/tasks" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Tasks
              </Link>
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                {loading ? (
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full"
                        aria-label="User menu"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user?.avatar} 
                            alt={user?.name || 'User'} 
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name
                              ? user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/profile" 
                          className="w-full flex items-center cursor-pointer"
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}