import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from '../components/Layout';

// Mock the child components
vi.mock('../components/Sidebar', () => ({
  default: ({ hosts, onSelectHost, onNewConnection }) => (
    <div data-testid="sidebar">
      <div>Sidebar</div>
      {hosts.map(host => (
        <button key={host.id} onClick={() => onSelectHost(host.id)}>
          {host.name}
        </button>
      ))}
      <button onClick={onNewConnection}>New Connection</button>
    </div>
  ),
}));

vi.mock('../components/TerminalView', () => ({
  default: ({ host }) => (
    <div data-testid="terminal-view">
      Terminal: {host.name}
    </div>
  ),
}));

vi.mock('../components/HostManager', () => ({
  default: ({ onSave }) => (
    <div data-testid="host-manager">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({ name: 'New Host', ip: '1.1.1.1', id: '3' });
      }}>
        <button type="submit">Save</button>
      </form>
    </div>
  ),
}));

describe('Layout Component', () => {
  it('renders sidebar and initial hosts', () => {
    render(<Layout />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Production Server')).toBeInTheDocument();
    expect(screen.getByText('Staging DB')).toBeInTheDocument();
  });

  it('shows LandingPage by default when no host is selected', () => {
    render(<Layout />);
    
    expect(screen.getByText('Modern SSH Client')).toBeInTheDocument();
    expect(screen.queryByTestId('terminal-view')).not.toBeInTheDocument();
  });

  it('shows TerminalView when a host is selected', () => {
    render(<Layout />);
    
    const productionButton = screen.getByText('Production Server');
    fireEvent.click(productionButton);
    
    expect(screen.getByTestId('terminal-view')).toBeInTheDocument();
    expect(screen.getByText('Terminal: Production Server')).toBeInTheDocument();
    expect(screen.queryByTestId('host-manager')).not.toBeInTheDocument();
  });

  it('switches between hosts', () => {
    render(<Layout />);
    
    // Select first host
    fireEvent.click(screen.getByText('Production Server'));
    expect(screen.getByText('Terminal: Production Server')).toBeInTheDocument();
    
    // Select second host
    fireEvent.click(screen.getByText('Staging DB'));
    expect(screen.getByText('Terminal: Staging DB')).toBeInTheDocument();
  });

  it('shows HostManager when New Connection is clicked', () => {
    render(<Layout />);
    
    // First select a host
    fireEvent.click(screen.getByText('Production Server'));
    expect(screen.getByTestId('terminal-view')).toBeInTheDocument();
    
    // Then click New Connection
    fireEvent.click(screen.getByText('New Connection'));
    expect(screen.getByTestId('host-manager')).toBeInTheDocument();
    expect(screen.queryByTestId('terminal-view')).not.toBeInTheDocument();
  });

  it('shows HostManager when New Connection is clicked and returns to landing after save', async () => {
    const user = userEvent.setup();
    render(<Layout />);
    
    // Click New Connection
    await user.click(screen.getByText('New Connection'));
    
    // Should show HostManager
    expect(await screen.findByTestId('host-manager')).toBeInTheDocument();
    expect(screen.getByText('New Connection')).toBeInTheDocument();
  });
});
