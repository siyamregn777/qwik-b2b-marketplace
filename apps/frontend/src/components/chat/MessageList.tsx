import { component$, useSignal, useTask$ } from '@builder.io/qwik';

export default component$(() => {
  const messages = useSignal([
    {
      id: 1,
      sender: 'Seller Support',
      text: 'Welcome to B2B Marketplace! How can I help you today?',
      time: '10:00 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      text: 'I need pricing for industrial bearings, MOQ 500 units',
      time: '10:02 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Seller Support',
      text: 'I\'ll connect you with our sales specialist for custom pricing',
      time: '10:03 AM',
      isOwn: false,
    },
    {
      id: 4,
      sender: 'Sales Specialist',
      text: 'Hello! I can provide bulk pricing for industrial bearings. Do you need specific certifications?',
      time: '10:05 AM',
      isOwn: false,
    },
  ]);

  return (
    <div class="space-y-4">
      {messages.value.map(msg => (
        <div
          key={msg.id}
          class={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
        >
          <div
            class={`max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.isOwn
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            <div class="flex items-center mb-1">
              <span class={`text-sm font-medium ${msg.isOwn ? 'text-blue-100' : 'text-gray-700'}`}>
                {msg.sender}
              </span>
              <span class={`text-xs ml-2 ${msg.isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                {msg.time}
              </span>
            </div>
            <p class="text-sm">{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
});