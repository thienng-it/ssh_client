/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Command, X, Plus } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';
import { loadCommands, saveCommands } from '../utils/storage';

const TerminalView = ({ host }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const wsRef = useRef(null);
    const [showCommands, setShowCommands] = useState(false);
    const [commands, setCommands] = useState([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [hasTypedCommand, setHasTypedCommand] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [commandName, setCommandName] = useState('');

    useEffect(() => {
        setCommands(loadCommands());
    }, []);

    useEffect(() => {
        if (!terminalRef.current) return;

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

        const term = new Terminal({
            theme: isDark ? {
                background: '#11111b',
                foreground: '#cdd6f4',
                cursor: '#f5e0dc',
                cursorAccent: '#11111b',
                selectionBackground: '#585b70',
                black: '#45475a', red: '#f38ba8', green: '#a6e3a1', yellow: '#f9e2af',
                blue: '#89b4fa', magenta: '#f5c2e7', cyan: '#94e2d5', white: '#bac2de',
                brightBlack: '#585b70', brightRed: '#f38ba8', brightGreen: '#a6e3a1',
                brightYellow: '#f9e2af', brightBlue: '#89b4fa', brightMagenta: '#f5c2e7',
                brightCyan: '#94e2d5', brightWhite: '#a6adc8',
            } : {
                background: '#e6e9ef',
                foreground: '#4c4f69',
                cursor: '#dc8a78',
                cursorAccent: '#e6e9ef',
                selectionBackground: '#acb0be',
                black: '#5c5f77', red: '#d20f39', green: '#40a02b', yellow: '#df8e1d',
                blue: '#1e66f5', magenta: '#ea76cb', cyan: '#179299', white: '#acb0be',
                brightBlack: '#6c6f85', brightRed: '#d20f39', brightGreen: '#40a02b',
                brightYellow: '#df8e1d', brightBlue: '#1e66f5', brightMagenta: '#ea76cb',
                brightCyan: '#179299', brightWhite: '#bcc0cc',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            cursorBlink: true,
            rightClickSelectsWord: true,
            allowProposedApi: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Add copy support - listen to selection changes
        terminalRef.current.addEventListener('mouseup', () => {
            const selection = term.getSelection();
            if (selection) {
                // Auto-copy on selection (optional, can be removed if not desired)
                navigator.clipboard.writeText(selection).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        });

        // Add keyboard copy/paste support
        terminalRef.current.addEventListener('keydown', (event) => {
            // Only handle if focus is on terminal, not on input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Cmd+C / Ctrl+C - Copy
            if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
                const selection = term.getSelection();
                if (selection) {
                    navigator.clipboard.writeText(selection).then(() => {
                        console.log('Copied to clipboard:', selection);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                    });
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            // Cmd+V / Ctrl+V - Paste
            if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
                event.preventDefault();
                navigator.clipboard.readText().then(text => {
                    term.paste(text);
                }).catch(err => {
                    console.error('Failed to paste:', err);
                });
            }
        });

        term.writeln(`\x1b[1;32m➜\x1b[0m Connecting to \x1b[1;36m${host.name}\x1b[0m (${host.ip})...`);

        // Check if it's a demo host (mock hosts have id '1' or '2')
        const isDemoHost = host.id === '1' || host.id === '2';

        if (isDemoHost) {
            // Demo mode - fake SSH
            setTimeout(() => {
                term.writeln(`\x1b[1;32mConnected!\x1b[0m (Demo Mode)`);
                term.writeln('');
                term.write(`\x1b[1;34m${host.username}@${host.name}\x1b[0m:~$ `);
            }, 800);

            term.onData((data) => {
                const code = data.charCodeAt(0);
                if (code === 13) {
                    // Get the current line from terminal buffer
                    const buffer = term.buffer.active;
                    const cursorY = buffer.cursorY;
                    const line = buffer.getLine(cursorY);
                    if (line) {
                        const lineText = line.translateToString(true).trim();
                        // Remove prompt (everything after $)
                        const commandMatch = lineText.match(/\$\s*(.+)$/);
                        if (commandMatch && commandMatch[1].trim()) {
                            setCurrentCommand(commandMatch[1].trim());
                        }
                    }
                    term.write('\r\n');
                    term.write(`\x1b[1;34m${host.username}@${host.name}\x1b[0m:~$ `);
                } else if (code === 127) {
                    term.write('\b \b');
                    setHasTypedCommand(true);
                } else {
                    term.write(data);
                    setHasTypedCommand(true);
                }
            });
        } else {
            // Real SSH mode
            const ws = new WebSocket('ws://localhost:3001');
            wsRef.current = ws;

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'connect',
                    host: host.ip,
                    port: parseInt(host.port) || 22,
                    username: host.username,
                    password: host.password,
                    privateKey: host.privateKey,
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'data') {
                    term.write(atob(msg.data));
                } else if (msg.type === 'status' && msg.message === 'connected') {
                    term.writeln('\x1b[1;32mConnected!\x1b[0m\r\n');
                    const { rows, cols } = term;
                    ws.send(JSON.stringify({ type: 'resize', rows, cols, height: rows * 16, width: cols * 8 }));
                } else if (msg.type === 'error') {
                    term.writeln(`\x1b[1;31mError: ${msg.message}\x1b[0m`);
                } else if (msg.type === 'status' && msg.message === 'closed') {
                    term.writeln('\r\n\x1b[1;33mConnection closed.\x1b[0m');
                }
            };

            ws.onerror = () => term.writeln('\x1b[1;31mWebSocket error. Is the server running?\x1b[0m');
            ws.onclose = () => term.writeln('\r\n\x1b[1;33mDisconnected from server.\x1b[0m');

            term.onData((data) => {
                const code = data.charCodeAt(0);
                
                // Track commands - capture from terminal buffer instead of keystrokes
                if (code === 13) { // Enter
                    // Get the current line from terminal buffer
                    const buffer = term.buffer.active;
                    const cursorY = buffer.cursorY;
                    const line = buffer.getLine(cursorY);
                    if (line) {
                        const lineText = line.translateToString(true).trim();
                        // Remove prompt (everything before $)
                        const commandMatch = lineText.match(/\$\s*(.+)$/);
                        if (commandMatch && commandMatch[1].trim()) {
                            setCurrentCommand(commandMatch[1].trim());
                        }
                    }
                } else {
                    setHasTypedCommand(true);
                }
                
                // Send to SSH server
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'data', data: btoa(data) }));
                }
            });

            term.onResize(({ rows, cols }) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'resize', rows, cols, height: rows * 16, width: cols * 8 }));
                }
            });
        }

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            wsRef.current?.close();
            term.dispose();
        };
    }, [host]);

    const executeCommand = (command) => {
        if (xtermRef.current) {
            xtermRef.current.write(command.command + '\r');
        }
    };

    const handleSaveCommand = () => {
        if (commandName.trim() && currentCommand) {
            const newCommand = {
                id: Date.now().toString(),
                name: commandName.trim(),
                command: currentCommand
            };
            const updatedCommands = [...commands, newCommand];
            setCommands(updatedCommands);
            saveCommands(updatedCommands);
            setShowSaveModal(false);
            setCommandName('');
            setCurrentCommand('');
            setHasTypedCommand(false);
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', padding: 'var(--spacing-md)', backgroundColor: 'var(--bg-terminal)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 'var(--spacing-md)', right: 'var(--spacing-md)', zIndex: 100, display: 'flex', gap: '8px' }}>
                {(currentCommand || hasTypedCommand) && (
                    <button
                        onClick={() => setShowSaveModal(true)}
                        style={{
                            background: 'var(--accent-success)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '500'
                        }}
                        title="Save last command"
                    >
                        <Plus size={16} />
                        Save Command
                    </button>
                )}
                <button
                    onClick={() => setShowCommands(!showCommands)}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Command size={16} />
                    Commands
                </button>
            </div>

            {showCommands && commands.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    right: 'var(--spacing-md)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: 'var(--spacing-sm)',
                    zIndex: 100,
                    maxWidth: '300px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                        paddingBottom: 'var(--spacing-xs)',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Quick Commands</span>
                        <button
                            onClick={() => setShowCommands(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px'
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                    {commands.map(cmd => (
                        <button
                            key={cmd.id}
                            onClick={() => executeCommand(cmd)}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                padding: 'var(--spacing-xs)',
                                marginBottom: '4px',
                                cursor: 'pointer',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <div style={{ fontWeight: '500', fontSize: '0.85rem' }}>{cmd.name}</div>
                            <div style={{ 
                                fontFamily: 'monospace', 
                                fontSize: '0.75rem', 
                                color: 'var(--text-muted)',
                                marginTop: '2px'
                            }}>
                                {cmd.command}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showSaveModal && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: 'var(--spacing-lg)',
                    zIndex: 200,
                    minWidth: '300px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                    <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--text-primary)' }}>Save Command</h3>
                    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Command Name
                        </label>
                        <input
                            type="text"
                            value={commandName}
                            onChange={(e) => setCommandName(e.target.value)}
                            placeholder="e.g., List files"
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'var(--bg-base)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Command
                        </label>
                        <input
                            type="text"
                            value={currentCommand || ''}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'var(--bg-base)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => { setShowSaveModal(false); setCommandName(''); }}
                            style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCommand}
                            disabled={!commandName.trim()}
                            style={{
                                padding: '8px 16px',
                                background: 'var(--accent-primary)',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                cursor: commandName.trim() ? 'pointer' : 'not-allowed',
                                opacity: commandName.trim() ? 1 : 0.5,
                                fontWeight: '500'
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default TerminalView;
