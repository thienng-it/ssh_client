import React, { useState } from 'react';
import { Save } from 'lucide-react';

const HostManager = ({ onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        username: '',
        port: '22'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            padding: 'var(--spacing-xl)',
            maxWidth: '600px',
            margin: '0 auto',
            color: 'var(--text-primary)'
        }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>New Connection</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Host Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Production Server"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>IP Address / Hostname</label>
                        <input
                            type="text"
                            name="ip"
                            placeholder="192.168.1.1"
                            value={formData.ip}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Port</label>
                        <input
                            type="text"
                            name="port"
                            placeholder="22"
                            value={formData.port}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="root"
                        value={formData.username}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: 'var(--spacing-md)',
                        padding: '12px',
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        transition: 'opacity 0.2s'
                    }}
                >
                    <Save size={18} />
                    Save Host
                </button>
            </form>
        </div>
    );
};

export default HostManager;
