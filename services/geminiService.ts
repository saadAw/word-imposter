import { GoogleGenAI } from "@google/genai";

const PROMPT = `
Generiere ein Spiel-Setup für 'Word Imposter' auf Deutsch.
1. Wähle ein komplett alltägliches, einfaches deutsches Substantiv.
2. Erstelle einen extrem subtilen und vagen Hinweis für dieses Wort. Der Hinweis darf KEINE direkte Eigenschaft, Kategorie, Funktion oder Definition sein. Er sollte eine sehr breite Assoziation oder einen abstrakten Kontext darstellen.
Beispiele für extrem subtile Hinweise:
- Wort: 'Baum', Subtiler Hinweis: 'Kann groß sein'
- Wort: 'Wasser', Subtiler Hinweis: 'Manchmal fließend'
Gib das Ergebnis als einzelnes JSON-Objekt mit den Schlüsseln "secretWord" und "hint" zurück. Gib NUR das JSON-Objekt zurück.
`;

export const generateWordAndHint = async (): Promise<{ secretWord: string; hint: string }> => {
    // API_KEY is expected to be available as an environment variable
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API-Schlüssel ist nicht konfiguriert.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

        if (parsedData && typeof parsedData.secretWord === 'string' && typeof parsedData.hint === 'string') {
            return parsedData;
        } else {
            throw new Error("Ungültiges Datenformat von der KI-Antwort.");
        }
    } catch (e) {
        console.error("Fehler bei der Generierung von Wort und Hinweis:", e);
        if (e instanceof Error) {
            throw new Error(`Konnte keine gültige Antwort von der KI erhalten. Grund: ${e.message}`);
        }
        throw new Error("Ein unbekannter Fehler ist bei der Kommunikation mit der KI aufgetreten.");
    }
};
