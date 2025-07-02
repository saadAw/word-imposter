# Word Imposter - Echtzeit-Multiplayer v3

Dies ist eine Web-Anwendung für das Gesellschaftsspiel "Word Imposter". Sie ermöglicht es einer Gruppe von Spielern, über einen einfachen Link einer Spiel-Lobby beizutreten. Der Host startet das Spiel, und der Server weist jedem Spieler heimlich eine Rolle ("Normaler Spieler" oder "Imposter") und die entsprechende Information (geheimes Wort oder Hinweis) zu.

Diese Version ist eine **echte Echtzeit-Anwendung**, die `socket.io` verwendet und perfekt für das Hosting auf Plattformen wie **Glitch** oder **Replit** geeignet ist.

## 🚀 So wird gespielt

1.  **Hosten & Link teilen:** Eine Person (der Host) stellt die Anwendung auf Glitch bereit (siehe Anleitung unten).
2.  **Link teilen:** Der Host kopiert die URL der Glitch-Anwendung (z.B. `https://dein-projekt.glitch.me`) und teilt sie mit allen Mitspielern.
3.  **Beitreten:** Jeder Spieler öffnet den Link auf seinem eigenen Gerät (Handy, PC etc.), gibt seinen Namen ein und tritt der Lobby bei. Alle sehen in Echtzeit, wer der Lobby beitritt.
4.  **Spiel starten:** Der Host (der erste Spieler, der beigetreten ist) hat einen "Spiel starten"-Button. Sobald mindestens 3 Spieler in der Lobby sind, kann der Host das Spiel starten.
5.  **Rollen erhalten:** Der Server weist jedem Spieler **privat** seine Rolle und sein geheimes Wort/Hinweis zu. Der Bildschirm jedes Spielers wird automatisch aktualisiert, um nur seine eigenen Informationen anzuzeigen.
6.  **Spielen!** Jetzt kann das eigentliche Spiel (das Reden und Raten) beginnen.

Es ist **kein Screen-Sharing** oder das Versenden von privaten Nachrichten mehr nötig!

## ❓ Wie hoste ich das Spiel auf Glitch?

1.  **Google Gemini API-Schlüssel holen:**
    *   Erhalte deinen kostenlosen API-Schlüssel vom [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Dieser Schlüssel ist geheim!** Teile ihn nicht öffentlich.

2.  **Projekt auf Glitch importieren:**
    *   Gehe zu [glitch.com](https://glitch.com/) und erstelle ein Konto.
    *   Klicke auf "New Project" -> "Import from GitHub".
    *   Gib die URL des GitHub-Repositorys für dieses Projekt ein.

3.  **API-Schlüssel sicher hinterlegen:**
    *   Klicke links im Menü auf "Secrets".
    *   Erstelle eine neue Variable mit dem Namen `API_KEY`.
    *   Füge als Wert deinen geheimen Google Gemini API-Schlüssel ein.
    *   Glitch sorgt dafür, dass dieser Schlüssel sicher nur für den Server verfügbar ist.

4.  **Spielen:**
    *   Glitch installiert die Abhängigkeiten und startet die Anwendung automatisch. Das kann einen Moment dauern.
    *   Klicke auf "Preview" -> "Preview in a new window".
    *   **Kopiere den Link aus der Adresszeile dieses neuen Fensters und teile ihn mit deinen Freunden!**

## 🛠️ Technische Struktur

*   **Backend (`server/index.js`):** Ein Node.js-Server mit Express und `socket.io`. Er ist die zentrale Autorität, verwaltet den Spielzustand, die Spieler und die Kommunikation mit der Gemini-KI.
*   **Frontend (`src`):** Eine React-Anwendung (gebaut mit Vite), die sich als Client mit dem WebSocket-Server verbindet. Sie empfängt Zustands-Updates und sendet Aktionen an den Server.
