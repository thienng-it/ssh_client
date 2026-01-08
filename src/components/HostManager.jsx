import React, { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';

const HostManager = ({ onSave, editingHost }) => {
    const [formData, setFormData] = useState(editingHost || {
        name: '',
        ip: '',
        username: '',
        port: '22',
        password: '',
        privateKey: ''
    });
    const [authType, setAuthType] = useState(editingHost?.privateKey ? 'key' : 'password');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, privateKey: authType === 'key' ? formData.privateKey : undefined });
    };

    const inputStyle = {
        width: '100%', padding: '12px', backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)', borderRadius: '6px',
        color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'
    };
    const labelStyle = { display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' };

    return (
        <div style={{ padding: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto', color: 'var(--text-primary)' }} data-testid="host-manager">
            <h2 style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>
                {editingHost ? 'Edit Connection' : 'New Connection'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div>
                    <label style={labelStyle}>Host Name</label>
                    <input type="text" name="name" placeholder="Production Server" value={formData.name} onChange={handleChange} style={inputStyle} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={labelStyle}>IP Address / Hostname</label>
                        <input type="text" name="ip" placeholder="192.168.1.1" value={formData.ip} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Port</label>
                        <input type="text" name="port" placeholder="22" value={formData.port} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Username</label>
                    <input type="text" name="username" placeholder="root" value={formData.username} onChange={handleChange} style={inputStyle} required />
                </div>
                <div>
                    <label style={labelStyle}>Authentication</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                        {['password', 'key'].map((type) => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input type="radio" checked={authType === type} onChange={() => setAuthType(type)} />
                                {type === 'password' ? 'Password' : 'Private Key'}
                            </label>
                        ))}
                    </div>
                </div>
                {authType === 'password' ? (
                    <div style={{ position: 'relative' }}>
                        <label style={labelStyle}>Password</label>
                        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} style={inputStyle} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                ) : (
                    <div>
                        <label style={labelStyle}>Private Key (PEM format)</label>
                        <textarea name="privateKey" placeholder="-----BEGIN OPENSSH PRIVATE KEY-----" value={formData.privateKey} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', fontFamily: 'monospace', fontSize: '12px' }} />
                    </div>
                )}
                <button type="submit" style={{ marginTop: 'var(--spacing-md)', padding: '12px', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                    <Save size={18} /> {editingHost ? 'Update Host' : 'Save Host'}
                </button>
            </form>
        </div>
    );
};

export default HostManager;
