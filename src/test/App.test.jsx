import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the Layout component
vi.mock('../components/Layout', () => ({
  default: () => <div data-testid="layout">Layout Component</div>,
}));

describe('App Component', () => {
  it('renders Layout component', () => {
    render(<App />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Layout Component')).toBeInTheDocument();
  });
});
