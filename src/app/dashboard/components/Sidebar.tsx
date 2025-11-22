"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  Home, 
  User as UserIcon, 
  ChevronRight, 
  ChevronLeft,
  LayoutDashboard
} from "lucide-react";
import { createClient } from "@/lib/supabase/client"; 
import { useRouter } from "next/navigation";
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Initialize the client-side Supabase client
  const supabase = createClient();

  // Get user initial
  const userInitial = user.email ? user.email[0].toUpperCase() : 'U';

  // Handle clicking outside the user menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#0f0518] border-r border-white/10 transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Toggle */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-in fade-in duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-bold text-white">LearnFlow</span>
          </div>
        )}
        {isCollapsed && (
           <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
             <span className="text-white font-bold">L</span>
           </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'absolute -right-3 top-8 bg-[#1e1b2e] border border-white/10 rounded-full p-1' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 px-4 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-600/10 text-purple-300 border border-purple-600/20 transition-all group">
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium truncate animate-in fade-in">Dashboard</span>}
        </button>
      </div>

      {/* User Section (Bottom) */}
      <div className="p-4 border-t border-white/5 relative" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all ${isMenuOpen ? 'bg-white/5' : ''} ${isCollapsed ? 'justify-center' : ''}`}
        >
          {/* Circular Avatar Button */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-[#0f0518] shadow-lg shrink-0">
            <span className="text-white font-bold text-lg">{userInitial}</span>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
          )}
        </button>

        {/* Popover Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1e1b2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 min-w-[200px] z-50 ml-1">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-white/5">
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Account</p>
              </div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
                <UserIcon className="w-4 h-4" /> Profile
              </button>
              <button 
                onClick={handleGoHome}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
              <div className="border-t border-white/5 my-1"></div>
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};