
export const generateWordAndHint = async (): Promise<{ secretWord: string; hint: string }> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Try to parse the error message from the server's JSON response
            const errorData = await response.json().catch(() => ({ error: 'Unbekannter Serverfehler.' }));
            throw new Error(errorData.error || `Serverfehler: ${response.statusText}`);
        }

        const data = await response.json();

        if (typeof data.secretWord === 'string' && typeof data.hint === 'string') {
            return data;
        } else {
            throw new Error("Ungültiges Datenformat von der Server-Antwort.");
        }
    } catch (e) {
        console.error("Fehler beim Abrufen der Daten vom Server:", e);
        // Rethrow the error with a user-friendly message
        if (e instanceof Error) {
            throw new Error(`Konnte keine gültige Antwort vom Server erhalten. Grund: ${e.message}`);
        }
        throw new Error("Ein unbekannter Fehler ist aufgetreten.");
    }
};
