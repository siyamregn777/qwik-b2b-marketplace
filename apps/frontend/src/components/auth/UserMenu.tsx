import { component$, $, useSignal, useTask$ } from '@builder.io/qwik';
import { getUser, logout } from '~/utils/zitadel-auth';

export default component$(() => {
  const user = useSignal<any>(null);
  const loading = useSignal(true);

  useTask$(async () => {
    try {
      const currentUser = await getUser();
      user.value = currentUser;
    } catch (error) {
      console.error('Error getting user:', error);
    } finally {
      loading.value = false;
    }
  });

  const handleLogout = $(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  });

  if (loading.value) {
    return (
      <div class="flex items-center space-x-4">
        <div class="animate-pulse w-20 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!user.value) {
    return (
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">Guest</span>
      </div>
    );
  }

  return (
    <div class="flex items-center space-x-4 group relative">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-gray-900">
          {user.value.profile?.name || 'User'}
        </p>
        <p class="text-xs text-gray-500 truncate max-w-[120px]">
          {user.value.profile?.email || 'user@example.com'}
        </p>
      </div>
      
      <div class="relative">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
          {user.value.profile?.picture ? (
            <img 
              src={user.value.profile.picture} 
              alt={user.value.profile?.name || 'User'}
              class="w-10 h-10 rounded-full"
            />
          ) : (
            <span class="text-blue-600 font-medium">
              {user.value.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        
        {/* Dropdown Menu - Hidden by default, shown on hover */}
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900 truncate">
              {user.value.profile?.name || 'User'}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {user.value.profile?.email || 'user@example.com'}
            </p>
          </div>
          <div class="py-1">
            <a 
              href="/profile" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile Settings
            </a>
            <a 
              href="/orders" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              My Orders
            </a>
            <a 
              href="/messages" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Messages
            </a>
          </div>
          <div class="border-t border-gray-100 pt-1">
            <button
              onClick$={handleLogout}
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});