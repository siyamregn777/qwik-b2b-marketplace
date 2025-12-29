import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import { getUser } from '~/utils/zitadel-auth';

export default component$(() => {
  const user = useSignal<any>(null);
  const message = useSignal('');
  const messages = useSignal<string[]>([
    'Welcome to B2B Marketplace Chat!',
    'This is a demo of Matrix SDK integration.',
    'Real messages will be sent when Matrix server is provided.',
  ]);

  // Get user info on component mount
  useTask$(async () => {
    try {
      const currentUser = await getUser();
      user.value = currentUser;
    } catch (error) {
      console.error('Error getting user for chat:', error);
    }
  });

  const handleSend = $(async () => {
    if (!message.value.trim()) return;

    // Add message to list
    const userName = user.value?.profile?.name || 'You';
    const newMessage = `${userName}: ${message.value}`;
    
    messages.value = [...messages.value, newMessage];
    message.value = '';

    // Simulate response
    setTimeout(() => {
      const responses = [
        'Thanks for your message!',
        'Can you provide more details?',
        'Our sales team will contact you shortly.',
        'Would you like a product catalog?',
        'I can help you with pricing information.',
        'Let me check the availability for you.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      messages.value = [...messages.value, `Seller Support: ${randomResponse}`];
    }, 1000);
  });

  const handleKeyPress = $((event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  });

  return (
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Messages Container */}
      <div class="h-64 overflow-y-auto p-4 space-y-3">
        {messages.value.map((msg, index) => {
          const isUserMessage = msg.startsWith('You:') || 
            (user.value?.profile?.name && msg.includes(user.value.profile.name));
          
          return (
            <div 
              key={index} 
              class={`p-3 rounded-lg max-w-[80%] transition-all duration-200 ${
                isUserMessage
                  ? 'bg-blue-100 ml-auto border border-blue-200'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <p class="text-sm font-medium">
                {msg.split(':')[0]}: 
                <span class="font-normal ml-1">{msg.split(':').slice(1).join(':')}</span>
              </p>
              <p class="text-xs text-gray-500 mt-1 text-right">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div class="border-t border-gray-200 p-4">
        {!user.value ? (
          <div class="text-center py-4">
            <div class="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-yellow-700 text-sm">
                Please login to send messages
              </span>
            </div>
          </div>
        ) : (
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-sm font-medium">
                  {user.value.profile?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span class="text-sm text-gray-700">
                {user.value.profile?.name || 'User'}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <textarea
                bind:value={message}
                onKeyPress$={handleKeyPress}
                placeholder={`Type your message here, ${user.value.profile?.name || 'User'}...`}
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                rows={2}
              />
              <button
                onClick$={handleSend}
                disabled={!message.value.trim()}
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>
        )}
        
        <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Matrix SDK Ready</span>
            <span class="text-gray-400">•</span>
            <span>Server: {import.meta.env.VITE_PUBLIC_MATRIX_HOMESERVER_URL}</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="hidden sm:inline">Press Enter to send</span>
            <span class="text-gray-400">•</span>
            <span>Connected as {user.value?.profile?.name || 'Guest'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});