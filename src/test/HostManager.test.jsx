import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HostManager from '../components/HostManager';

describe('HostManager Component', () => {
  it('renders the form with all fields', () => {
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    expect(screen.getByText('New Connection')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Production Server')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('22')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('root')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Host/i })).toBeInTheDocument();
  });

  it('has default port value of 22', () => {
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    const portInput = screen.getByPlaceholderText('22');
    expect(portInput).toHaveValue('22');
  });

  it('updates form fields when typing', async () => {
    const user = userEvent.setup();
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    const nameInput = screen.getByPlaceholderText('Production Server');
    const ipInput = screen.getByPlaceholderText('192.168.1.1');
    const usernameInput = screen.getByPlaceholderText('root');
    
    await user.type(nameInput, 'Test Server');
    await user.type(ipInput, '192.168.1.100');
    await user.type(usernameInput, 'admin');
    
    expect(nameInput).toHaveValue('Test Server');
    expect(ipInput).toHaveValue('192.168.1.100');
    expect(usernameInput).toHaveValue('admin');
  });

  it('calls onSave with form data when submitted', async () => {
    const user = userEvent.setup();
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    await user.type(screen.getByPlaceholderText('Production Server'), 'Test Server');
    await user.type(screen.getByPlaceholderText('192.168.1.1'), '192.168.1.100');
    await user.type(screen.getByPlaceholderText('root'), 'admin');
    
    const submitButton = screen.getByRole('button', { name: /Save Host/i });
    await user.click(submitButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test Server',
      ip: '192.168.1.100',
      username: 'admin',
      port: '22'
    });
  });

  it('requires name field', async () => {
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    const nameInput = screen.getByPlaceholderText('Production Server');
    expect(nameInput).toBeRequired();
  });

  it('requires ip field', async () => {
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    const ipInput = screen.getByPlaceholderText('192.168.1.1');
    expect(ipInput).toBeRequired();
  });

  it('can update port number', async () => {
    const user = userEvent.setup();
    const mockOnSave = vi.fn();
    render(<HostManager onSave={mockOnSave} />);
    
    const portInput = screen.getByPlaceholderText('22');
    await user.clear(portInput);
    await user.type(portInput, '2222');
    
    expect(portInput).toHaveValue('2222');
  });
});
