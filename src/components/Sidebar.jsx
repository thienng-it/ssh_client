import React from 'react';
import { Server, Plus, Settings, Edit2, Trash2, Moon, Sun, X, Terminal } from 'lucide-react';

const Sidebar = ({ hosts, activeHostId, onSelectHost, onNewConnection, onEditHost, onDeleteHost, theme, onToggleTheme, isOpen, onClose, onShowCommands }) => {
    return (
        <>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998,
                        display: 'none'
                    }}
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}
            <div style={{
                width: '240px',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'relative',
                zIndex: 999,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}
            className="sidebar" data-testid="sidebar"
            >
                <div style={{
                    padding: 'var(--spacing-md)',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>SSH Client</span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'none'
                        }}
                        className="sidebar-close"
                    >
                        <X size={18} />
                    </button>
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
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            borderRadius: '6px',
                            marginBottom: '4px',
                            transition: 'var(--transition-fast)',
                            position: 'relative'
                        }}
                    >
                        <div
                            onClick={() => onSelectHost(host.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                flex: 1,
                                cursor: 'pointer',
                                padding: 'var(--spacing-sm)',
                                borderRadius: '6px',
                                backgroundColor: activeHostId === host.id ? 'var(--accent-primary)' : 'var(--bg-card)',
                                color: activeHostId === host.id ? '#fff' : 'var(--text-primary)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: activeHostId === host.id ? 'none' : '1px solid var(--border-color)'
                            }}
                        >
                            <Server size={16} style={{ color: activeHostId === host.id ? '#fff' : 'var(--accent-secondary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: activeHostId === host.id ? '600' : '500' }}>{host.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditHost(host.id); }}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--accent-secondary)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '4px',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    transition: 'var(--transition-fast)'
                                }}
                                title="Edit"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-secondary)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteHost(host.id); }}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--accent-error)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '4px',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    transition: 'var(--transition-fast)'
                                }}
                                title="Delete"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-error)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                <div style={{
                    marginTop: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    paddingLeft: 'var(--spacing-xs)'
                }}>
                    COMMANDS
                </div>

                <button
                    onClick={onShowCommands}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        width: '100%',
                        textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <Terminal size={16} />
                    Manage Commands
                </button>
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
                        color: theme === 'dark' ? 'var(--bg-base)' : '#fff',
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

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                        onClick={onToggleTheme}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}>
                        <Settings size={16} />
                    </button>
                </div>
                
                <div style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: 'var(--spacing-sm)'
                }}>
                    v{__APP_VERSION__}
                </div>
            </div>
            </div>
        </>
    );
};

export default Sidebar;
