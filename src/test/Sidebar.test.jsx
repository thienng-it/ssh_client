import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

describe('Sidebar Component', () => {
  const mockHosts = [
    { id: '1', name: 'Production Server', ip: '192.168.1.10' },
    { id: '2', name: 'Staging DB', ip: '10.0.0.5' }
  ];

  it('renders SSH Client title', () => {
    const mockFn = vi.fn();
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId={null}
        onSelectHost={mockFn}
        onNewConnection={mockFn}
      />
    );
    
    expect(screen.getByText('SSH Client')).toBeInTheDocument();
  });

  it('renders all hosts', () => {
    const mockFn = vi.fn();
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId={null}
        onSelectHost={mockFn}
        onNewConnection={mockFn}
      />
    );
    
    expect(screen.getByText('Production Server')).toBeInTheDocument();
    expect(screen.getByText('Staging DB')).toBeInTheDocument();
  });

  it('calls onSelectHost when host is clicked', () => {
    const mockOnSelectHost = vi.fn();
    const mockOnNewConnection = vi.fn();
    
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId={null}
        onSelectHost={mockOnSelectHost}
        onNewConnection={mockOnNewConnection}
      />
    );
    
    fireEvent.click(screen.getByText('Production Server'));
    expect(mockOnSelectHost).toHaveBeenCalledWith('1');
  });

  it('calls onNewConnection when New Connection button is clicked', () => {
    const mockOnSelectHost = vi.fn();
    const mockOnNewConnection = vi.fn();
    
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId={null}
        onSelectHost={mockOnSelectHost}
        onNewConnection={mockOnNewConnection}
      />
    );
    
    fireEvent.click(screen.getByText('New Connection'));
    expect(mockOnNewConnection).toHaveBeenCalled();
  });

  it('highlights active host', () => {
    const mockFn = vi.fn();
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId="1"
        onSelectHost={mockFn}
        onNewConnection={mockFn}
      />
    );
    
    const activeHost = screen.getByText('Production Server').parentElement;
    expect(activeHost).toHaveStyle({ backgroundColor: 'var(--bg-card)' });
  });

  it('renders Settings button', () => {
    const mockFn = vi.fn();
    render(
      <Sidebar
        hosts={mockHosts}
        activeHostId={null}
        onSelectHost={mockFn}
        onNewConnection={mockFn}
      />
    );
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
