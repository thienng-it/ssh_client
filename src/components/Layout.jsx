/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TerminalView from './TerminalView';
import HostManager from './HostManager';
import LandingPage from './LandingPage';
import Modal from './Modal';
import CommandManager from './CommandManager';
import { saveHosts, loadHosts, saveTheme, loadTheme, saveCommands, loadCommands } from '../utils/storage';
import { Menu } from 'lucide-react';

const Layout = () => {
    const [hosts, setHosts] = useState([]);
    const [activeHostId, setActiveHostId] = useState(null);
    const [showNewConnection, setShowNewConnection] = useState(false);
    const [editingHostId, setEditingHostId] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [isLoaded, setIsLoaded] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, hostId: null });
    const [switchEditModal, setSwitchEditModal] = useState({ isOpen: false, targetAction: null });
    const [commands, setCommands] = useState([]);
    const [showCommands, setShowCommands] = useState(false);

    // Initialize from localStorage on mount
     
    useEffect(() => {
        const savedHosts = loadHosts();
        const savedCommands = loadCommands();
        const savedTheme = loadTheme();
        const initialHosts = savedHosts.length > 0 ? savedHosts : [
            { id: '1', name: 'Production Server', ip: '192.168.1.10', username: 'root', port: '22' },
            { id: '2', name: 'Staging DB', ip: '10.0.0.5', username: 'admin', port: '22' }
        ];
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        setHosts(initialHosts);
        setCommands(savedCommands);
        setTheme(savedTheme);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            saveHosts(hosts);
        }
    }, [hosts, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            saveCommands(commands);
        }
    }, [commands, isLoaded]);

    const handleToggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const activeHost = hosts.find(h => h.id === activeHostId);
    const editingHost = hosts.find(h => h.id === editingHostId);

    const handleSelectHost = (id) => {
        if (editingHostId || showNewConnection) {
            setSwitchEditModal({ isOpen: true, targetAction: () => {
                setActiveHostId(id);
                setShowNewConnection(false);
                setEditingHostId(null);
                setSidebarOpen(false);
            }});
        } else {
            setActiveHostId(id);
            setShowNewConnection(false);
            setEditingHostId(null);
            setSidebarOpen(false);
        }
    };

    const handleNewConnection = () => {
        if (editingHostId) {
            setSwitchEditModal({ isOpen: true, targetAction: () => {
                setActiveHostId(null);
                setShowNewConnection(true);
                setEditingHostId(null);
                setSidebarOpen(false);
            }});
        } else {
            setActiveHostId(null);
            setShowNewConnection(true);
            setEditingHostId(null);
            setSidebarOpen(false);
        }
    };

    const handleEditHost = (id) => {
        if (editingHostId && editingHostId !== id) {
            setSwitchEditModal({ isOpen: true, targetAction: () => {
                setActiveHostId(null);
                setShowNewConnection(false);
                setEditingHostId(id);
                setSidebarOpen(false);
            }});
        } else if (showNewConnection) {
            setSwitchEditModal({ isOpen: true, targetAction: () => {
                setActiveHostId(null);
                setShowNewConnection(false);
                setEditingHostId(id);
                setSidebarOpen(false);
            }});
        } else {
            setActiveHostId(null);
            setShowNewConnection(false);
            setEditingHostId(id);
            setSidebarOpen(false);
        }
    };

    const handleDeleteHost = (id) => {
        setDeleteModal({ isOpen: true, hostId: id });
    };

    const confirmDelete = () => {
        setHosts(hosts.filter(h => h.id !== deleteModal.hostId));
        if (activeHostId === deleteModal.hostId) setActiveHostId(null);
    };

    const confirmSwitchEdit = () => {
        if (switchEditModal.targetAction) {
            switchEditModal.targetAction();
        }
    };

    const handleSaveHost = (hostData) => {
        if (editingHostId) {
            setHosts(hosts.map(h => h.id === editingHostId ? { ...hostData, id: editingHostId } : h));
            setEditingHostId(null);
        } else {
            setHosts([...hosts, { ...hostData, id: Date.now().toString() }]);
            setShowNewConnection(false);
        }
        setActiveHostId(null);
    };

    const handleSaveCommand = (commandData) => {
        setCommands([...commands, commandData]);
    };

    const handleEditCommand = (command) => {
        // For simplicity, we'll just delete and re-add
        setCommands(commands.filter(c => c.id !== command.id));
    };

    const handleDeleteCommand = (id) => {
        setCommands(commands.filter(c => c.id !== id));
    };

    const handleExecuteCommand = (command) => {
        // Send command to active terminal if connected
        if (activeHostId && window.terminalRef?.current) {
            window.terminalRef.current.write(command.command + '\r');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar
                hosts={hosts}
                activeHostId={activeHostId}
                onSelectHost={handleSelectHost}
                onNewConnection={handleNewConnection}
                onEditHost={handleEditHost}
                onDeleteHost={handleDeleteHost}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onShowCommands={() => {
                    setActiveHostId(null);
                    setShowNewConnection(false);
                    setEditingHostId(null);
                    setShowCommands(true);
                    setSidebarOpen(false);
                }}
            />

            <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', overflow: 'hidden', position: 'relative' }}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            position: 'absolute',
                            top: 'var(--spacing-md)',
                            left: 'var(--spacing-md)',
                            zIndex: 100,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            display: 'none',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                        className="menu-button"
                    >
                        <Menu size={20} />
                    </button>

                {activeHost ? (
                    <TerminalView host={activeHost} />
                ) : showNewConnection || editingHost ? (
                    <HostManager onSave={handleSaveHost} editingHost={editingHost} />
                ) : showCommands ? (
                    <CommandManager 
                        commands={commands}
                        onSave={handleSaveCommand}
                        onEdit={handleEditCommand}
                        onDelete={handleDeleteCommand}
                        onExecute={handleExecuteCommand}
                    />
                ) : (
                    <LandingPage onNewConnection={handleNewConnection} hostsCount={hosts.length} />
                )}
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, hostId: null })}
                title="Delete Host"
                onConfirm={confirmDelete}
                confirmText="Delete"
            >
                Are you sure you want to delete this host? This action cannot be undone.
            </Modal>

            <Modal
                isOpen={switchEditModal.isOpen}
                onClose={() => setSwitchEditModal({ isOpen: false, targetAction: null })}
                title="Unsaved Changes"
                onConfirm={confirmSwitchEdit}
                confirmText="Discard Changes"
            >
                You have unsaved changes. Are you sure you want to discard them?
            </Modal>
        </div>
    );
};

export default Layout;
