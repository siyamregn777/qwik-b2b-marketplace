import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { getUser } from '~/utils/zitadel-auth';
import UserMenu from '../auth/UserMenu';

export default component$(() => {
  const user = useSignal<any>(null);
  const loading = useSignal(true);

  useTask$(async () => {
    try {
      const currentUser = await getUser();
      user.value = currentUser;
    } catch (error) {
      console.error('Error getting user for header:', error);
    } finally {
      loading.value = false;
    }
  });

  return (
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Logo */}
          <div class="flex items-center">
            <Link href="/" class="flex items-center space-x-2 group">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-900 transition-all duration-200">
                <span class="text-white font-bold text-sm">B2B</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold text-gray-900">Marketplace</span>
                <span class="text-xs text-gray-500 -mt-1">Multi-Vendor Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav class="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Dashboard
              <span class="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></span>
            </Link>
            <Link 
              href="/products" 
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Products
              <span class="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></span>
            </Link>
            <Link 
              href="/chat" 
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
            >
              Chat
              <span class="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></span>
            </Link>
            
            {/* Admin Panel Link - Show based on user role from Zitadel */}
            {user.value?.profile?.role === 'admin' && (
              <a 
                href={import.meta.env.VITE_PUBLIC_API_URL + '/admin'}
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin Panel</span>
              </a>
            )}
            
            {/* Show user's email/name in header for larger screens */}
            {user.value?.profile?.email && (
              <div class="hidden lg:flex items-center space-x-2 pl-8 border-l border-gray-200">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600">
                  {user.value.profile.name || user.value.profile.email.split('@')[0]}
                </span>
              </div>
            )}
          </nav>

          {/* User Menu & Mobile Menu Button */}
          <div class="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* User Menu */}
            {!loading.value && <UserMenu />}
            
            {loading.value && (
              <div class="animate-pulse flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div class="md:hidden border-t border-gray-200 mt-2 pt-2 pb-3">
          <div class="flex flex-col space-y-2">
            <Link 
              href="/" 
              class="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/products" 
              class="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              href="/chat" 
              class="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Chat
            </Link>
            
            {/* Admin Panel Mobile */}
            {user.value?.profile?.role === 'admin' && (
              <a 
                href={import.meta.env.VITE_PUBLIC_API_URL + '/admin'}
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin Panel</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});