import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3001; // Glitch provides PORT env var
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Gemini AI Setup (securely on the server) ---
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. The /api/generate endpoint will not work.");
}
// Initialize with a dummy key if not found, to prevent crashes. The endpoint will handle the error.
const ai = new GoogleGenAI(apiKey || "DUMMY_KEY");

const PROMPT = `
Generiere ein Spiel-Setup für 'Word Imposter' auf Deutsch.
1. Wähle ein komplett alltägliches, einfaches deutsches Substantiv.
2. Erstelle einen extrem subtilen und vagen Hinweis für dieses Wort. Der Hinweis darf KEINE direkte Eigenschaft, Kategorie, Funktion oder Definition sein. Er sollte eine sehr breite Assoziation oder einen abstrakten Kontext darstellen, der zum Nachdenken anregt, aber die Möglichkeiten nicht zu sehr einschränkt.

Beispiele für extrem subtile Hinweise:
- Wort: 'Baum', Subtiler Hinweis: 'Kann groß sein' oder 'Steht manchmal'. NICHT: 'Hat Äste'.
- Wort: 'Wasser', Subtiler Hinweis: 'Manchmal fließend' oder 'Kann kühl sein'. NICHT: 'Ist nass'.
- Wort: 'Glück', Subtiler Hinweis: 'Ein Gefühl' oder 'Wird gesucht'. NICHT: 'Ist eine Emotion'.

Gib das Ergebnis als einzelnes JSON-Objekt mit den Schlüsseln "secretWord" und "hint" zurück. Gib NUR das JSON-Objekt zurück.
`;

// --- API Endpoint ---
app.post('/api/generate', async (req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: 'API-Schlüssel ist auf dem Server nicht konfiguriert.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: PROMPT,
            config: {
                responseMimeType: "application/json",
                temperature: 1.0,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);

        if (typeof parsedData.secretWord === 'string' && typeof parsedData.hint === 'string') {
            res.json(parsedData);
        } else {
            throw new Error("Ungültiges Datenformat von der KI-Antwort.");
        }
    } catch (e) {
        console.error("Fehler bei der Kommunikation mit der Gemini API:", e);
        res.status(500).json({ error: 'Fehler beim Generieren des Inhalts von der KI.' });
    }
});

// --- Static File Serving ---
// Vite builds the project into a 'dist' folder. We serve these static files.
const staticPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(staticPath));

// Fallback: Serve index.html for any request that doesn't match a static file.
// This is crucial for single-page applications like React.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
