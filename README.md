# Word Imposter - Setup-Anwendung

Dies ist eine minimalistische Web-Anwendung, um heimlich Rollen und Startinformationen (ein geheimes Wort oder einen Hinweis) für das Gesellschaftsspiel "Word Imposter" zuzuweisen. Sie nutzt die Google Gemini KI, um ein faires und unvorhersehbares Wort-Hinweis-Paar zu generieren, sodass selbst der Spielleiter nicht im Voraus eingeweiht ist.

## 🚀 Spielprinzip

Die Anwendung löst das Kernproblem des Spiel-Setups: Wie weist man heimlich eine "Imposter"-Rolle zu, ohne dass jemand (auch nicht der Spielleiter) das geheime Wort kennt?

1.  Ein Spieler (der "Host" für diese Runde) öffnet die Anwendung.
2.  Er/Sie fügt die Namen aller Mitspieler hinzu.
3.  Durch einen Klick auf "Spiel starten" wird die KI von Google aufgerufen. Diese generiert im Hintergrund ein geheimes Wort und einen dazu passenden, sehr vagen Hinweis.
4.  Gleichzeitig wird zufällig einem Spieler die Rolle "Imposter" zugewiesen, allen anderen die Rolle "Normaler Spieler".
5.  Die Anwendung zeigt für jeden Spieler eine Karte an.
6.  Nun kann jeder Spieler nacheinander (und heimlich) zum Bildschirm kommen, um seine Karte aufzudecken und sich seine Rolle und seine Information (Wort oder Hinweis) anzusehen.

## ❓ Wie hoste ich das Spiel und wie können sich andere verbinden?

Dies ist eine **reine Frontend-Anwendung**, die jedoch für die KI-Funktion einen geheimen API-Schlüssel benötigt. Die gesamte Logik läuft im Browser des Hosts. Es gibt keinen zentralen Server, mit dem sich andere Spieler verbinden.

### Option 1: Lokal auf einem Gerät spielen (Empfohlene Methode)

Dies ist der einfachste und schnellste Weg. Ihr braucht nur ein Gerät (PC, Laptop, Tablet).

1.  **Voraussetzung:** Du musst die `API_KEY` Variable für die Anwendung verfügbar machen. Die einfachste Methode ist, eine `.env`-Datei im Projektordner zu erstellen und `API_KEY=DEIN_GEHEIMER_SCHLÜSSEL` hineinzuschreiben. Da dieses Projekt keinen Build-Schritt hat, wird dies nicht automatisch geladen. Für lokale Tests muss der Entwickler sicherstellen, dass `process.env.API_KEY` im Browser-Kontext verfügbar ist, z.B. durch manuelle Skripte oder eine Entwicklungsumgebung wie Vite.
2.  **Hosten:** Der Spielleiter öffnet die `index.html`-Datei in einem beliebigen Webbrowser.
3.  **"Verbinden":** Die anderen Spieler versammeln sich um das Gerät. Der Host trägt alle Namen in die Spielerliste ein.
4.  **Spiel starten:** Der Host klickt auf "Spiel starten".
5.  **Informationen erhalten:** Der Bildschirm zeigt nun eine Karte für jeden Spieler. Jeder Spieler geht nacheinander zum Gerät, findet seine Karte und sieht sich seine geheimen Informationen an.

### Option 2: Online für andere bereitstellen (mit Glitch)

Um das Spiel einfach und kostenlos online über eine URL bereitzustellen, sind Dienste wie **Glitch** oder **Replit** ideal, da sie die Verwaltung des API-Schlüssels sehr einfach machen.

**Anleitung für Glitch (empfohlen):**

1.  **Google Gemini API-Schlüssel holen:**
    *   Erhalte deinen kostenlosen API-Schlüssel von [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Dieser Schlüssel ist geheim!** Teile ihn nicht öffentlich.

2.  **Projekt auf Glitch erstellen:**
    *   Gehe zu [glitch.com](https://glitch.com/) und erstelle ein Konto.
    *   Erstelle ein neues Projekt, indem du "New Project" -> "Import from GitHub" wählst.
    *   Gib die URL des GitHub-Repositorys für dieses Projekt ein.

3.  **API-Schlüssel sicher hinterlegen:**
    *   Klicke in deinem Glitch-Projekt auf das "Tools"-Menü unten links und dann auf "Secrets".
    *   Erstelle eine neue Variable mit dem Namen `API_KEY`.
    *   Füge als Wert deinen geheimen Google Gemini API-Schlüssel ein. Glitch sorgt dafür, dass dieser Schlüssel sicher gespeichert und für die App verfügbar ist, ohne im Code aufzutauchen.

4.  **Spielen:**
    *   **Hosten:** Glitch gibt dir eine öffentliche Live-URL (z.B. `dein-projekt.glitch.me`). Der Spielleiter öffnet diesen Link.
    *   **Verteilen:** Der Host fügt alle Spielernamen hinzu und startet das Spiel. Da es immer noch eine Frontend-Anwendung ist, müssen die Informationen vom Host an die Spieler verteilt werden. Am besten funktioniert das über Screen-Sharing (z.B. in Discord). Der Host teilt seinen Bildschirm, startet das Spiel und schickt dann jedem Spieler seine Rolle und sein Wort/Hinweis per **privater Nachricht**.# word-imposter
