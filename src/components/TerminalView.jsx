import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const TerminalView = ({ host }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const wsRef = useRef(null);

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
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

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
                    term.write('\r\n');
                    term.write(`\x1b[1;34m${host.username}@${host.name}\x1b[0m:~$ `);
                } else if (code === 127) {
                    term.write('\b \b');
                } else {
                    term.write(data);
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

    return (
        <div style={{ height: '100%', width: '100%', padding: 'var(--spacing-md)', backgroundColor: 'var(--bg-terminal)' }}>
            <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default TerminalView;
