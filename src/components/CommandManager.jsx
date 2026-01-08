import React, { useState } from 'react';
import { Plus, Terminal, Edit2, Trash2, Play } from 'lucide-react';

const CommandManager = ({ commands, onSave, onEdit, onDelete, onExecute }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', command: '', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim() && formData.command.trim()) {
            onSave({ ...formData, id: Date.now().toString() });
            setFormData({ name: '', command: '', description: '' });
            setShowForm(false);
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-md)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
            }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Commands</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: 'var(--accent-color)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Plus size={16} />
                    Add Command
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: '8px',
                    marginBottom: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <input
                        type="text"
                        placeholder="Command name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Command (e.g., ls -la, docker ps)"
                        value={formData.command}
                        onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{
                            background: 'var(--accent-color)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            Save
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gap: '8px' }}>
                {commands.map(cmd => (
                    <div key={cmd.id} style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: 'var(--spacing-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '4px'
                            }}>
                                <Terminal size={16} color="var(--accent-color)" />
                                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                                    {cmd.name}
                                </span>
                            </div>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-tertiary)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                marginBottom: cmd.description ? '4px' : '0'
                            }}>
                                {cmd.command}
                            </div>
                            {cmd.description && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {cmd.description}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => onExecute(cmd)}
                                style={{
                                    background: 'var(--accent-color)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Execute command"
                            >
                                <Play size={14} />
                            </button>
                            <button
                                onClick={() => onEdit(cmd)}
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    padding: '6px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => onDelete(cmd.id)}
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    padding: '6px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommandManager;
