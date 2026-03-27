
import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils/test-helpers';
import DeskPositioner from '../DeskPositioner';
import { createMockDesk } from '../../../../test-utils/test-helpers';
import { BookingDuration } from '@/types';

describe('DeskPositioner', () => {
  const mockRoomSize = { width: 400, height: 300 };
  const mockScale = 1;
  const mockPadding = 40;
  const mockOnDeskSelect = jest.fn();
  const mockOnHover = jest.fn();
  
  const mockDesks = [
    createMockDesk({ id: 'desk-1', name: 'Desk 1', position: { x: 10, y: 20 } }),
    createMockDesk({ id: 'desk-2', name: 'Desk 2', position: { x: 50, y: 60 }, status: 'booked' })
  ];
  
  const mockBookings = ['desk-2'];
  const mockDeskBookingMap: Record<string, BookingDuration> = { 'desk-2': 'full-day' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders multiple desks correctly', () => {
    render(
      <DeskPositioner 
        roomDesks={mockDesks}
        roomSize={mockRoomSize}
        scale={mockScale}
        padding={mockPadding}
        bookings={mockBookings}
        selectedDesk={null}
        hoveredDesk={null}
        deskBookingMap={mockDeskBookingMap}
        onDeskSelect={mockOnDeskSelect}
        onHover={mockOnHover}
      />
    );
    
    // Check if desk names are displayed
    expect(screen.getByText('Desk 1')).toBeInTheDocument();
    expect(screen.getByText('Desk 2')).toBeInTheDocument();
  });

  it('calls onDeskSelect when an available desk is clicked', () => {
    render(
      <DeskPositioner 
        roomDesks={mockDesks}
        roomSize={mockRoomSize}
        scale={mockScale}
        padding={mockPadding}
        bookings={mockBookings}
        selectedDesk={null}
        hoveredDesk={null}
        deskBookingMap={mockDeskBookingMap}
        onDeskSelect={mockOnDeskSelect}
        onHover={mockOnHover}
      />
    );
    
    // Find the first desk (available) and click it
    const availableDesk = screen.getByText('Desk 1').closest('div');
    fireEvent.click(availableDesk);
    
    // Check if onDeskSelect was called with the correct desk ID
    expect(mockOnDeskSelect).toHaveBeenCalledWith('desk-1');
  });

  it('does not call onDeskSelect when a booked desk is clicked', () => {
    render(
      <DeskPositioner 
        roomDesks={mockDesks}
        roomSize={mockRoomSize}
        scale={mockScale}
        padding={mockPadding}
        bookings={mockBookings}
        selectedDesk={null}
        hoveredDesk={null}
        deskBookingMap={mockDeskBookingMap}
        onDeskSelect={mockOnDeskSelect}
        onHover={mockOnHover}
      />
    );
    
    // Find the second desk (booked) and click it
    const bookedDesk = screen.getByText('Desk 2').closest('div');
    fireEvent.click(bookedDesk);
    
    // onDeskSelect should not be called
    expect(mockOnDeskSelect).not.toHaveBeenCalled();
  });

  it('calls onHover when mouse enters/leaves a desk', () => {
    render(
      <DeskPositioner 
        roomDesks={mockDesks}
        roomSize={mockRoomSize}
        scale={mockScale}
        padding={mockPadding}
        bookings={mockBookings}
        selectedDesk={null}
        hoveredDesk={null}
        deskBookingMap={mockDeskBookingMap}
        onDeskSelect={mockOnDeskSelect}
        onHover={mockOnHover}
      />
    );
    
    // Find a desk and trigger hover events
    const desk = screen.getByText('Desk 1').closest('div');
    
    // Mouse enter
    fireEvent.mouseEnter(desk);
    expect(mockOnHover).toHaveBeenCalledWith('desk-1');
    
    // Mouse leave
    fireEvent.mouseLeave(desk);
    expect(mockOnHover).toHaveBeenCalledWith(null);
  });
});
