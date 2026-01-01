import React from 'react';
import { Server, Plus, Settings } from 'lucide-react';

const Sidebar = ({ hosts, activeHostId, onSelectHost, onNewConnection }) => {
    return (
        <div style={{
            width: '240px',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        }}>
            <div style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                SSH Client
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-sm)' }}>
                <div style={{
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    paddingLeft: 'var(--spacing-xs)'
                }}>
                    HOSTS
                </div>

                {hosts.map(host => (
                    <div
                        key={host.id}
                        onClick={() => onSelectHost(host.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginBottom: '4px',
                            backgroundColor: activeHostId === host.id ? 'var(--bg-card)' : 'transparent',
                            color: activeHostId === host.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            transition: 'var(--transition-fast)'
                        }}
                    >
                        <Server size={16} />
                        <span style={{ fontSize: '0.9rem' }}>{host.name}</span>
                    </div>
                ))}
            </div>

            <div style={{
                padding: 'var(--spacing-md)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
            }}>
                <button
                    onClick={onNewConnection}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                    }}
                >
                    <Plus size={16} />
                    New Connection
                </button>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                }}>
                    <Settings size={16} />
                    Settings
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
