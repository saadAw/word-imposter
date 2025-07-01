# Word Imposter - Setup-Anwendung (Glitch-Version)

Dies ist eine minimalistische Web-Anwendung, um heimlich Rollen und Startinformationen (ein geheimes Wort oder einen Hinweis) für das Gesellschaftsspiel "Word Imposter" zuzuweisen. Sie nutzt die Google Gemini KI, um ein faires und unvorhersehbares Wort-Hinweis-Paar zu generieren, sodass selbst der Spielleiter nicht im Voraus eingeweiht ist.

Diese Version ist speziell für das Hosting auf Plattformen wie **Glitch** konfiguriert.

## 🚀 Spielprinzip

1.  Ein Spieler (der "Host" für diese Runde) öffnet die von Glitch bereitgestellte URL.
2.  Er/Sie fügt die Namen aller Mitspieler hinzu.
3.  Durch einen Klick auf "Spiel starten" wird der Server der Anwendung aufgerufen. Dieser fragt sicher die Google KI nach einem Wort/Hinweis.
4.  Gleichzeitig wird zufällig einem Spieler die Rolle "Imposter" zugewiesen.
5.  Die Anwendung zeigt für jeden Spieler eine Karte an. Jeder Spieler kann nun nacheinander zum Bildschirm kommen und sich seine geheime Rolle ansehen.

## ❓ Wie hoste ich das Spiel auf Glitch?

Die Anwendung ist jetzt so konfiguriert, dass sie auf Glitch sofort funktioniert.

**Schritt-für-Schritt-Anleitung für Glitch:**

1.  **Google Gemini API-Schlüssel holen:**
    *   Erhalte deinen kostenlosen API-Schlüssel vom [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Dieser Schlüssel ist geheim!** Teile ihn nicht öffentlich.

2.  **Projekt auf Glitch importieren:**
    *   Gehe zu [glitch.com](https://glitch.com/) und erstelle ein Konto.
    *   Erstelle ein neues Projekt: Klicke auf "New Project" -> "Import from GitHub".
    *   Gib die URL des GitHub-Repositorys für dieses Projekt ein. Glitch wird den Code automatisch importieren.

3.  **API-Schlüssel sicher hinterlegen:**
    *   Warte, bis Glitch das Projekt eingerichtet hat. Klicke dann links im Menü auf "Secrets".
    *   Erstelle eine neue Variable mit dem Namen `API_KEY`.
    *   Füge als Wert deinen geheimen Google Gemini API-Schlüssel ein.
    *   Glitch sorgt dafür, dass dieser Schlüssel sicher für den Server-Teil der App verfügbar ist, ohne im Code oder im Browser aufzutauchen.

4.  **Spielen:**
    *   Glitch startet die Anwendung automatisch. Nach kurzer Zeit sollte oben im Fenster "Your app is running" erscheinen.
    *   Klicke auf "Preview" -> "Preview in a new window", um die App zu öffnen.
    *   Teile diesen Link mit niemandem, da er das Host-Interface ist.
    *   **Verteilen:** Der Host fügt alle Spielernamen hinzu und startet das Spiel. Da es immer noch eine Frontend-Anwendung ist, die auf dem Gerät des Hosts läuft, müssen die Informationen an die Spieler verteilt werden. Am besten funktioniert das über Screen-Sharing (z.B. in Discord). Der Host teilt seinen Bildschirm, startet das Spiel und schickt dann jedem Spieler seine Rolle und sein Wort/Hinweis per **privater Nachricht**.

## 🛠️ Technische Struktur

Falls es dich interessiert: Das Projekt wurde von einer reinen Frontend-Anwendung zu einer Anwendung mit einem kleinen **Backend-Server** (mit Express.js) umgebaut.

*   **Frontend:** Der Code im `src`-Ordner ist die React-Anwendung, die du im Browser siehst. Er wird mit Vite gebaut.
*   **Backend:** Der Code in `server/index.js` ist ein kleiner Server. Er liefert die gebaute Frontend-Anwendung aus und stellt den sicheren `/api/generate`-Endpunkt bereit, der mit dem `API_KEY` die Google-KI aufruft.

Dieses Setup ist Standard für moderne Web-Anwendungen und sorgt für Sicherheit und Stabilität.
