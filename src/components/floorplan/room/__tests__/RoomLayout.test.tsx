
import React from 'react';
import { render, screen } from '../../../../test-utils/test-helpers';
import RoomLayout from '../RoomLayout';
import { createMockRoom } from '../../../../test-utils/test-helpers';

describe('RoomLayout', () => {
  const mockRoom = createMockRoom();
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  it('renders correctly with room information', () => {
    render(<RoomLayout room={mockRoom}>{mockChildren}</RoomLayout>);
    
    // Check if room name is displayed
    expect(screen.getByText(mockRoom.name)).toBeInTheDocument();
    
    // Check if children content is rendered
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    
    // Check if door element is rendered
    const doorElement = document.querySelector('.absolute.-left-1');
    expect(doorElement).toBeInTheDocument();
    
    // Check if window element is rendered
    const windowElement = document.querySelector('.absolute.top-0.left-1\\/4');
    expect(windowElement).toBeInTheDocument();
  });

  it('renders with different room names', () => {
    const customRoom = createMockRoom({ name: 'Custom Room Name' });
    render(<RoomLayout room={customRoom}>{mockChildren}</RoomLayout>);
    expect(screen.getByText('Custom Room Name')).toBeInTheDocument();
  });
});
