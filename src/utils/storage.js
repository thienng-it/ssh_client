// Simple XOR encryption for localStorage (better than plaintext)
// Note: For production, use Web Crypto API or store credentials server-side
const KEY = 'ssh_client_key_v1';

const encrypt = (text) => {
    return btoa(String.fromCharCode(...new TextEncoder().encode(text).map((b, i) => b ^ KEY.charCodeAt(i % KEY.length))));
};

const decrypt = (encoded) => {
    try {
        const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes.map((b, i) => b ^ KEY.charCodeAt(i % KEY.length)));
    } catch {
        return null;
    }
};

export const saveHosts = (hosts) => {
    try {
        localStorage.setItem('ssh_hosts', encrypt(JSON.stringify(hosts)));
    } catch (e) {
        console.error('Failed to save hosts:', e);
    }
};

export const loadHosts = () => {
    try {
        const data = localStorage.getItem('ssh_hosts');
        if (!data) return [];
        const decrypted = decrypt(data);
        return decrypted ? JSON.parse(decrypted) : [];
    } catch (e) {
        console.error('Failed to load hosts:', e);
        return [];
    }
};

export const saveTheme = (theme) => localStorage.setItem('theme', theme);
export const loadTheme = () => localStorage.getItem('theme') || 'dark';
