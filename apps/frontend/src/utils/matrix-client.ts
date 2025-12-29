import { createClient, ICreateClientOpts, MatrixClient, RoomEvent, MatrixEvent, EventType } from 'matrix-js-sdk';

// Configuration for Matrix client
export const matrixConfig: ICreateClientOpts = {
  baseUrl: import.meta.env.VITE_PUBLIC_MATRIX_HOMESERVER_URL || 'https://matrix.org',
  userId: typeof window !== 'undefined' ? localStorage.getItem('matrix_user_id') || undefined : undefined,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('matrix_access_token') || undefined : undefined,
};

// Singleton Matrix client instance
let matrixClient: MatrixClient | null = null;

export function getMatrixClient(): MatrixClient {
  if (!matrixClient) {
    matrixClient = createClient(matrixConfig);
  }
  return matrixClient;
}

export async function loginToMatrix(userId: string, password: string): Promise<void> {
  const client = getMatrixClient();
  
  try {
    const response = await client.login('m.login.password', {
      identifier: {
        type: 'm.id.user',
        user: userId,
      },
      password: password,
    });
    
    // Store credentials
    if (typeof window !== 'undefined') {
      localStorage.setItem('matrix_user_id', response.user_id);
      localStorage.setItem('matrix_access_token', response.access_token);
    }
    
    // Update client with new credentials
    matrixConfig.userId = response.user_id;
    matrixConfig.accessToken = response.access_token;
    
    // Reinitialize client
    matrixClient = createClient(matrixConfig);
    
    console.log('Matrix login successful:', response.user_id);
  } catch (error) {
    console.error('Matrix login failed:', error);
    throw error;
  }
}

export async function sendMessage(roomId: string, message: string): Promise<void> {
  const client = getMatrixClient();
  
  try {
    const content = {
      msgtype: 'm.text',
      body: message,
    };
    
    // Use the correct event type constant
    await client.sendEvent(roomId, 'm.room.message', content);
    console.log('Message sent to room:', roomId);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

export async function createRoom(name: string, isDirect = false): Promise<string> {
  const client = getMatrixClient();
  
  try {
    const options: any = {
      preset: isDirect ? 'trusted_private_chat' : 'public_chat',
      visibility: 'private',
      name: name,
    };
    
    if (isDirect) {
      options.is_direct = true;
    }
    
    const response = await client.createRoom(options);
    console.log('Room created:', response.room_id);
    return response.room_id;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}

// Get messages from a room
export async function getRoomMessages(roomId: string, limit = 50): Promise<any[]> {
  const client = getMatrixClient();
  
  try {
    const room = client.getRoom(roomId);
    if (!room) {
      return [];
    }
    
    const events = room.getLiveTimeline().getEvents();
    return events.slice(-limit).map(event => ({
      id: event.getId(),
      sender: event.getSender(),
      content: event.getContent(),
      timestamp: event.getTs(),
      type: event.getType(),
    }));
  } catch (error) {
    console.error('Failed to get room messages:', error);
    return [];
  }
}

// Listen for new messages
export function onMessage(callback: (roomId: string, event: any) => void): () => void {
  const client = getMatrixClient();
  
  const handler = (event: MatrixEvent, room: any) => {
    if (event.getType() === 'm.room.message') {
      callback(room.roomId, {
        id: event.getId(),
        sender: event.getSender(),
        content: event.getContent(),
        timestamp: event.getTs(),
      });
    }
  };
  
  client.on(RoomEvent.Timeline, handler);
  
  // Return unsubscribe function
  return () => {
    client.removeListener(RoomEvent.Timeline, handler);
  };
}

// Check if user is logged in to Matrix
export function isMatrixLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('matrix_access_token');
}

// Logout from Matrix
export function logoutFromMatrix(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('matrix_user_id');
    localStorage.removeItem('matrix_access_token');
  }
  matrixClient?.stopClient();
  matrixClient = null;
}

// Get user rooms
export async function getUserRooms(): Promise<any[]> {
  const client = getMatrixClient();
  
  try {
    await client.startClient({ initialSyncLimit: 10 });
    const rooms = client.getRooms();
    return rooms.map(room => ({
      id: room.roomId,
      name: room.name,
      members: room.getJoinedMembers(),
      lastMessage: room.timeline[room.timeline.length - 1],
    }));
  } catch (error) {
    console.error('Failed to get user rooms:', error);
    return [];
  }
}

// Simple send message for demo purposes (doesn't require login)
export function sendDemoMessage(roomId: string, message: string): void {
  console.log('Demo: Sending message to Matrix');
  console.log('Room:', roomId);
  console.log('Message:', message);
  console.log('Matrix Server:', import.meta.env.VITE_PUBLIC_MATRIX_HOMESERVER_URL);
  
  // In a real implementation, this would use the Matrix SDK
  // For demo purposes, we just log it
  if (typeof window !== 'undefined') {
    const demoMessages = JSON.parse(localStorage.getItem('matrix_demo_messages') || '[]');
    demoMessages.push({
      roomId,
      message,
      timestamp: new Date().toISOString(),
      sender: 'demo_user',
    });
    localStorage.setItem('matrix_demo_messages', JSON.stringify(demoMessages));
  }
}

// Get demo messages
export function getDemoMessages(roomId?: string): any[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const demoMessages = JSON.parse(localStorage.getItem('matrix_demo_messages') || '[]');
    if (roomId) {
      return demoMessages.filter((msg: any) => msg.roomId === roomId);
    }
    return demoMessages;
  } catch {
    return [];
  }
}

// Clear type error by casting to any for sendEvent
// This is a workaround for type inconsistencies in matrix-js-sdk
export async function sendMessageWorkaround(roomId: string, message: string): Promise<void> {
  const client = getMatrixClient();
  
  try {
    const content = {
      msgtype: 'm.text',
      body: message,
    };
    
    // Type workaround
    await (client as any).sendEvent(roomId, 'm.room.message', content);
    console.log('Message sent to room:', roomId);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

// Initialize client on module load (client-side only)
if (typeof window !== 'undefined') {
  // Start client only if we have credentials
  if (isMatrixLoggedIn()) {
    const client = getMatrixClient();
    client.startClient({ initialSyncLimit: 10 }).catch(console.error);
  }
}