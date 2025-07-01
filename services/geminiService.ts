import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY Umgebungsvariable nicht gesetzt. KI-Funktionen sind deaktiviert.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "DEIN_API_SCHLUESSEL_FEHLT" });

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

export const generateWordAndHint = async (): Promise<{ secretWord: string; hint: string }> => {
    if (!process.env.API_KEY) {
        throw new Error("API-Schlüssel ist nicht konfiguriert.");
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
        
        // Remove markdown fences if they exist
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);

        if (typeof parsedData.secretWord === 'string' && typeof parsedData.hint === 'string') {
            return {
                secretWord: parsedData.secretWord,
                hint: parsedData.hint,
            };
        } else {
            throw new Error("Ungültiges Datenformat von der KI-Antwort.");
        }
    } catch (e) {
        console.error("Fehler beim Generieren des Inhalts oder Parsen von JSON von Gemini:", e);
        throw new Error("Konnte keine gültige Antwort von der KI erhalten. Bitte überprüfe die Konsole für Details.");
    }
};