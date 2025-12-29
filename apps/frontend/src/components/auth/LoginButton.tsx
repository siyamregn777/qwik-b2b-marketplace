import { component$, $, useSignal, useTask$ } from '@builder.io/qwik';
import { login, logout, getUser } from '~/utils/zitadel-auth';

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

  const handleLogin = $(async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
      // Show user-friendly error
      alert('Login failed. Please check:\n1. Zitadel server is running\n2. Correct client ID configured\n3. Redirect URI matches');
    }
  });

  const handleLogout = $(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage and reload if logout fails
      localStorage.clear();
      window.location.href = '/';
    }
  });

  // Show loading state
  if (loading.value) {
    return (
      <div class="flex items-center space-x-2">
        <div class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        <span class="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Show user info and logout button
  if (user.value) {
    const userEmail = user.value.profile?.email || 'User';
    const userName = user.value.profile?.name || userEmail.split('@')[0];
    
    return (
      <div class="flex items-center space-x-4">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {userName}
          </p>
          <p class="text-xs text-gray-500 truncate max-w-[120px]">
            {userEmail}
          </p>
        </div>
        
        <button
          onClick$={handleLogout}
          class="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Show login button for unauthenticated users
  return (
    <button
      onClick$={handleLogin}
      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>Login with Zitadel</span>
    </button>
  );
});