import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TerminalView from './TerminalView';
import HostManager from './HostManager';

const Layout = () => {
    // Mock State for now
    const [hosts, setHosts] = useState([
        { id: '1', name: 'Production Server', ip: '192.168.1.10' },
        { id: '2', name: 'Staging DB', ip: '10.0.0.5' }
    ]);
    const [activeHostId, setActiveHostId] = useState(null);
    const [_showNewConnection, _setShowNewConnection] = useState(false);

    const activeHost = hosts.find(h => h.id === activeHostId);

    const handleSelectHost = (id) => {
        setActiveHostId(id);
        _setShowNewConnection(false);
    };

    const handleNewConnection = () => {
        setActiveHostId(null);
        _setShowNewConnection(true);
    };

    const handleSaveHost = (newHost) => {
        setHosts([...hosts, { ...newHost, id: Date.now().toString() }]);
        _setShowNewConnection(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <Sidebar
                hosts={hosts}
                activeHostId={activeHostId}
                onSelectHost={handleSelectHost}
                onNewConnection={handleNewConnection}
            />

            <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', overflow: 'hidden', position: 'relative' }}>
                {activeHost ? (
                    <TerminalView host={activeHost} />
                ) : (
                    <HostManager onSave={handleSaveHost} />
                )}
            </div>
        </div>
    );
};

export default Layout;
