import { WebSocketServer } from 'ws';
import { Client } from 'ssh2';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
    let sshClient = null;
    let stream = null;

    ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'connect') {
            sshClient = new Client();
            
            sshClient.on('ready', () => {
                ws.send(JSON.stringify({ type: 'status', message: 'connected' }));
                
                sshClient.shell({ term: 'xterm-256color' }, (err, s) => {
                    if (err) {
                        ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        return;
                    }
                    stream = s;
                    stream.on('data', (d) => ws.send(JSON.stringify({ type: 'data', data: d.toString('base64') })));
                    stream.on('close', () => ws.send(JSON.stringify({ type: 'status', message: 'closed' })));
                });
            });

            sshClient.on('error', (err) => ws.send(JSON.stringify({ type: 'error', message: err.message })));

            sshClient.connect({
                host: msg.host,
                port: msg.port || 22,
                username: msg.username,
                password: msg.password,
                privateKey: msg.privateKey,
            });
        } else if (msg.type === 'data' && stream) {
            stream.write(Buffer.from(msg.data, 'base64'));
        } else if (msg.type === 'resize' && stream) {
            stream.setWindow(msg.rows, msg.cols, msg.height, msg.width);
        }
    });

    ws.on('close', () => {
        stream?.close();
        sshClient?.end();
    });
});

console.log('SSH WebSocket server running on ws://localhost:3001');
