
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Room, Desk, RoomUtility, DeskUtility, BookingDuration } from '@/types';

// Create a custom render function that includes providers
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators with proper typing
export const createMockRoom = (overrides = {}): Room => ({
  id: 'room-test-1',
  name: 'Test Room',
  floor: 1,
  capacity: 10,
  utilities: [
    { type: 'wifi', available: true },
    { type: 'whiteboard', available: true }
  ] as RoomUtility[],
  ...overrides
});

export const createMockDesk = (overrides = {}): Desk => ({
  id: 'desk-test-1',
  name: 'Test Desk',
  roomId: 'room-test-1',
  status: 'available' as const,
  position: { x: 20, y: 30 },
  type: 'standard',
  utilities: [
    { type: 'monitor', available: true, quantity: 1 },
    { type: 'dockingStation', available: true }
  ] as DeskUtility[],
  ...overrides
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
