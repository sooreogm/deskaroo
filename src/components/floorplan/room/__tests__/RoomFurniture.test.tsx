
import React from 'react';
import { render, screen } from '../../../../test-utils/test-helpers';
import RoomFurniture from '../RoomFurniture';
import { createMockRoom } from '../../../../test-utils/test-helpers';
import { RoomUtility } from '@/types';

describe('RoomFurniture', () => {
  it('renders tables based on room capacity', () => {
    const room = createMockRoom({ capacity: 8 });
    render(<RoomFurniture room={room} />);
    
    // Should render 2 tables (capacity 8 / 4 = 2)
    const tableLabelTexts = screen.getAllByText(/Table \d+/);
    expect(tableLabelTexts).toHaveLength(2);
  });

  it('renders utilities when they are available', () => {
    const room = createMockRoom({
      utilities: [
        { type: 'whiteboard', available: true },
        { type: 'projector', available: true }
      ] as RoomUtility[]
    });
    
    render(<RoomFurniture room={room} />);
    
    // Check if whiteboard and projector are rendered
    expect(screen.getByText('Whiteboard')).toBeInTheDocument();
    expect(screen.getByText('Projector')).toBeInTheDocument();
  });

  it('does not render utilities when they are not available', () => {
    const room = createMockRoom({
      utilities: [
        { type: 'whiteboard', available: false },
        { type: 'projector', available: false }
      ] as RoomUtility[]
    });
    
    render(<RoomFurniture room={room} />);
    
    // Utilities should not be rendered
    expect(screen.queryByText('Whiteboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Projector')).not.toBeInTheDocument();
  });
});
