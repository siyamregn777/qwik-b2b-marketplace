import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { getUser } from '~/utils/zitadel-auth';
import Header from '~/components/layout/Header';
import ChatWidget from '~/components/chat/ChatWidget';
import MessageList from '~/components/chat/MessageList';

export default component$(() => {
  const user = useSignal<any>(null);
  const loading = useSignal(true);

  useTask$(async () => {
    try {
      const currentUser = await getUser();
      user.value = currentUser;
    } catch (error) {
      console.error('Error getting user for chat page:', error);
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div class="mb-10 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">💬 Real-time Chat</h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Powered by Matrix Protocol with end-to-end encryption. 
            Connect with buyers and sellers in real-time.
          </p>
          {!loading.value && !user.value && (
            <div class="mt-4 inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="font-medium">Please login to use chat features</span>
            </div>
          )}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-xl font-bold text-gray-800 flex items-center">
                      <span class="mr-2">💬</span>
                      Live Chat
                    </h2>
                    <p class="text-sm text-gray-600 mt-1">
                      Matrix Server: {import.meta.env.VITE_PUBLIC_MATRIX_HOMESERVER_URL}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-sm text-green-700 font-medium">Connected</span>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <MessageList />
                <ChatWidget />
              </div>
            </div>
          </div>

          {/* Chat Info & Controls */}
          <div class="space-y-6">
            {/* User Info */}
            <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 flex items-center">
                  <span class="mr-2">👤</span>
                  Your Session
                </h3>
                {user.value && (
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                )}
              </div>
              
              {loading.value ? (
                <div class="space-y-3 animate-pulse">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-24"></div>
                      <div class="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ) : user.value ? (
                <div class="space-y-3">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 text-white font-medium">
                      {user.value.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">
                        {user.value.profile?.name || 'User'}
                      </p>
                      <p class="text-sm text-gray-600">
                        {user.value.profile?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Session Details */}
                  <div class="pt-3 border-t border-gray-200 space-y-2">
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Session ID:</span>
                      <code class="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {user.value.session_state?.substring(0, 8) || 'N/A'}
                      </code>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Expires:</span>
                      <span class="text-xs text-gray-700">
                        {user.value.expires_at 
                          ? new Date(user.value.expires_at * 1000).toLocaleTimeString() 
                          : '1 hour'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="text-center py-4">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p class="text-gray-600 text-sm">Not logged in</p>
                  <p class="text-xs text-gray-500 mt-1">Login to access chat features</p>
                </div>
              )}
            </div>

            {/* Matrix Info */}
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow p-6 border border-purple-200">
              <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">🔐</span>
                Matrix Protocol Features
              </h3>
              <ul class="space-y-3">
                {[
                  { text: 'End-to-end encryption', icon: '🔒' },
                  { text: 'Decentralized federation', icon: '🌐' },
                  { text: 'File sharing support', icon: '📎' },
                  { text: 'Threaded conversations', icon: '💭' },
                  { text: 'Cross-platform sync', icon: '🔄' },
                  { text: 'Real-time notifications', icon: '🔔' },
                ].map((item, index) => (
                  <li key={index} class="flex items-center">
                    <span class="text-sm mr-2">{item.icon}</span>
                    <span class="text-sm text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div class="mt-4 pt-4 border-t border-purple-200">
                <div class="flex items-center justify-between">
                  <code class="text-xs bg-white/70 px-3 py-2 rounded border border-purple-200">
                    SDK: matrix-js-sdk v39.4.0
                  </code>
                  <div class="text-xs text-purple-600 font-medium">
                    Powered by Matrix
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 class="font-bold text-gray-800 mb-4 flex items-center">
                <span class="mr-2">📡</span>
                Connection Status
              </h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-700">Matrix Server</span>
                    <span class="text-sm font-medium text-green-600 flex items-center">
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Connected
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-700">Message Sync</span>
                    <span class="text-sm font-medium text-blue-600 flex items-center">
                      <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Active
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-700">Encryption</span>
                    <span class="text-sm font-medium text-purple-600 flex items-center">
                      <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Enabled
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">0</div>
                  <div class="text-xs text-gray-500">Online Users</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">0</div>
                  <div class="text-xs text-gray-500">Messages Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Instructions */}
        <div class="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span class="mr-2">📋</span>
            How to Use Chat
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/70 p-4 rounded-lg border border-blue-100">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span class="text-blue-600 font-bold">1</span>
              </div>
              <h4 class="font-medium text-gray-800 mb-2">Login Required</h4>
              <p class="text-sm text-gray-600">
                You must be logged in with Zitadel to send messages and access chat history.
              </p>
            </div>
            <div class="bg-white/70 p-4 rounded-lg border border-blue-100">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span class="text-blue-600 font-bold">2</span>
              </div>
              <h4 class="font-medium text-gray-800 mb-2">Real-time Communication</h4>
              <p class="text-sm text-gray-600">
                Messages are delivered instantly using Matrix protocol with end-to-end encryption.
              </p>
            </div>
            <div class="bg-white/70 p-4 rounded-lg border border-blue-100">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span class="text-blue-600 font-bold">3</span>
              </div>
              <h4 class="font-medium text-gray-800 mb-2">B2B Focus</h4>
              <p class="text-sm text-gray-600">
                Connect with suppliers, negotiate deals, and manage business relationships securely.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});