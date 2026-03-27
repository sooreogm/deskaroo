
import React from 'react';
import { render, screen, fireEvent } from '../../test-utils/test-helpers';
import FloorPlan from '../FloorPlan';
import { createMockRoom, createMockDesk } from '../../test-utils/test-helpers';
import { BookingDuration } from '@/types';

// Mock the utility functions
jest.mock('../../utils/bookings', () => ({
  getBookingsByDate: jest.fn(() => [
    {
      id: 'booking-1',
      deskId: 'desk-1',
      status: 'confirmed',
      duration: 'full-day' as BookingDuration
    }
  ])
}));

describe('FloorPlan Integration', () => {
  const mockRoom = createMockRoom();
  const mockDesks = [
    createMockDesk({ id: 'desk-1', roomId: 'room-test-1', status: 'booked' }),
    createMockDesk({ id: 'desk-2', roomId: 'room-test-1' })
  ];
  const mockBookings = ['desk-1'];
  const mockOnDeskSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the complete floor plan with all components', () => {
    render(
      <FloorPlan 
        room={mockRoom}
        desks={mockDesks}
        bookings={mockBookings}
        selectedDesk={null}
        onDeskSelect={mockOnDeskSelect}
      />
    );
    
    // Check if room information is displayed
    expect(screen.getByText(`${mockRoom.name} - Floor ${mockRoom.floor}`)).toBeInTheDocument();
    expect(screen.getByText(`Capacity: ${mockRoom.capacity} desks`)).toBeInTheDocument();
    
    // Check if desks are rendered
    expect(screen.getByText('Test Desk')).toBeInTheDocument();
    
    // Check if room utilities section is rendered
    expect(screen.getByText('Room Utilities:')).toBeInTheDocument();
    
    // Check if the legend is rendered
    expect(screen.getByText('Available (1)')).toBeInTheDocument();
    expect(screen.getByText('Booked (1)')).toBeInTheDocument();
  });

  it('calls onDeskSelect when an available desk is clicked', () => {
    render(
      <FloorPlan 
        room={mockRoom}
        desks={mockDesks}
        bookings={mockBookings}
        selectedDesk={null}
        onDeskSelect={mockOnDeskSelect}
      />
    );
    
    // Find the available desk and click it
    // Note: This might be challenging in a real test due to absolute positioning
    // This is a simplified approach for the test
    const availableDesk = screen.getByText('Test Desk').closest('div');
    fireEvent.click(availableDesk);
    
    // Check if onDeskSelect was called with the correct desk ID
    expect(mockOnDeskSelect).toHaveBeenCalledWith('desk-2');
  });

  it('highlights the selected desk', () => {
    render(
      <FloorPlan 
        room={mockRoom}
        desks={mockDesks}
        bookings={mockBookings}
        selectedDesk="desk-2"
        onDeskSelect={mockOnDeskSelect}
      />
    );
    
    // This would be implementation-specific, but typically would add a specific CSS class
    // or style to the selected desk element
    const selectedDesk = screen.getByText('Test Desk').closest('div');
    expect(selectedDesk).toHaveClass('desk-selected');
  });
});
