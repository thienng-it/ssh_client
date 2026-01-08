import React from 'react';
import { Server, Plus } from 'lucide-react';

const LandingPage = ({ onNewConnection, hostsCount }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            padding: 'var(--spacing-xl)'
        }}>
            <Server size={64} style={{ color: 'var(--accent-primary)', marginBottom: 'var(--spacing-lg)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
                Modern SSH Client
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', textAlign: 'center', maxWidth: '400px' }}>
                {hostsCount > 0 
                    ? 'Select a host from the sidebar to start a session'
                    : 'Get started by adding your first SSH connection'}
            </p>
            {hostsCount === 0 && (
                <button
                    onClick={onNewConnection}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: '12px 24px',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                    }}
                >
                    <Plus size={20} />
                    Add Connection
                </button>
            )}
        </div>
    );
};

export default LandingPage;
