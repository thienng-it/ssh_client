import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

describe('Sidebar Component', () => {
  const mockHosts = [
    { id: '1', name: 'Production Server', ip: '192.168.1.10' },
    { id: '2', name: 'Staging DB', ip: '10.0.0.5' }
  ];

  const defaultProps = {
    hosts: mockHosts,
    activeHostId: null,
    onSelectHost: vi.fn(),
    onNewConnection: vi.fn(),
    onEditHost: vi.fn(),
    onDeleteHost: vi.fn(),
    theme: 'dark',
    onToggleTheme: vi.fn(),
    isOpen: true,
    onClose: vi.fn()
  };

  it('renders SSH Client title', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('SSH Client')).toBeInTheDocument();
  });

  it('renders all hosts', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Production Server')).toBeInTheDocument();
    expect(screen.getByText('Staging DB')).toBeInTheDocument();
  });

  it('calls onSelectHost when host is clicked', () => {
    const mockOnSelectHost = vi.fn();
    render(<Sidebar {...defaultProps} onSelectHost={mockOnSelectHost} />);
    fireEvent.click(screen.getByText('Production Server'));
    expect(mockOnSelectHost).toHaveBeenCalledWith('1');
  });

  it('calls onNewConnection when New Connection button is clicked', () => {
    const mockOnNewConnection = vi.fn();
    render(<Sidebar {...defaultProps} onNewConnection={mockOnNewConnection} />);
    fireEvent.click(screen.getByText('New Connection'));
    expect(mockOnNewConnection).toHaveBeenCalled();
  });

  it('highlights active host', () => {
    render(<Sidebar {...defaultProps} activeHostId="1" />);
    const activeHost = screen.getByText('Production Server').parentElement;
    expect(activeHost).toHaveStyle({ backgroundColor: 'var(--accent-primary)' });
  });

  it('renders Settings button', () => {
    render(<Sidebar {...defaultProps} />);
    const settingsButtons = screen.getAllByRole('button');
    expect(settingsButtons.length).toBeGreaterThan(0);
  });
});
