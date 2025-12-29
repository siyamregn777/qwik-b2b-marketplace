import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const SimpleChat = component$(() => {
  const message = useSignal('');
  const messages = useSignal<string[]>([]);

  useVisibleTask$(async () => {
    // Mock messages for demo
    messages.value = [
      'Welcome to the chat!',
      'This is a demo of Matrix integration',
      'In production, this would connect to your Matrix server',
      'Using matrix-js-sdk package',
    ];
  });

  const sendMessage = $(() => {
    if (message.value.trim()) {
      messages.value = [...messages.value, `You: ${message.value}`];
      message.value = '';
    }
  });

  return (
    <div class="border rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-4">Simple Chat (Matrix Demo)</h3>
      <div class="h-64 overflow-y-auto mb-4 p-2 border rounded">
        {messages.value.map((msg, idx) => (
          <div key={idx} class="mb-2 p-2 bg-gray-50 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div class="flex gap-2">
        <input
          type="text"
          class="flex-1 border rounded px-3 py-2"
          value={message.value}
          onInput$={(e) => message.value = (e.target as HTMLInputElement).value}
          onKeyPress$={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick$={sendMessage}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        Note: Using matrix-js-sdk package. In production, connects to provided Matrix server.
      </p>
    </div>
  );
});