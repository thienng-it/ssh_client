import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const TerminalView = ({ host }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm
        const term = new Terminal({
            theme: {
                background: '#11111b',
                foreground: '#cdd6f4',
                cursor: '#f5e0dc',
                cursorAccent: '#11111b',
                selectionBackground: '#585b70',
                black: '#45475a',
                red: '#f38ba8',
                green: '#a6e3a1',
                yellow: '#f9e2af',
                blue: '#89b4fa',
                magenta: '#f5c2e7',
                cyan: '#94e2d5',
                white: '#bac2de',
                brightBlack: '#585b70',
                brightRed: '#f38ba8',
                brightGreen: '#a6e3a1',
                brightYellow: '#f9e2af',
                brightBlue: '#89b4fa',
                brightMagenta: '#f5c2e7',
                brightCyan: '#94e2d5',
                brightWhite: '#a6adc8',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            cursorBlink: true,
            allowProposedApi: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        term.writeln(`\x1b[1;32m➜\x1b[0m Connecting to \x1b[1;36m${host.name}\x1b[0m (${host.ip})...`);
        setTimeout(() => {
            term.writeln(`Authenticated to ${host.name}.`);
            term.writeln('');
            term.write(`\x1b[1;34m${host.name}\x1b[0m@\x1b[1;32muser\x1b[0m:~$ `);
        }, 800);

        // Simple Echo
        term.onData(data => {
            const code = data.charCodeAt(0);
            if (code === 13) { // Enter
                term.write('\r\n');
                term.write(`\x1b[1;34m${host.name}\x1b[0m@\x1b[1;32muser\x1b[0m:~$ `);
            } else if (code === 127) { // Backspace
                term.write('\b \b');
            } else {
                term.write(data);
            }
        });

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, [host]);

    // Refit on host change (if container size changed, though unlikely here for now)
    useEffect(() => {
        if (fitAddonRef.current) {
            // Slight delay to allow layout to settle
            setTimeout(() => fitAddonRef.current.fit(), 100);
        }
    }, [host]);

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--bg-terminal)'
            }}
        >
            <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default TerminalView;
