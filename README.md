# DHBW VS Study Hub

Ein privates Studienprojekt für BWL Technical Management an der DHBW Villingen-Schwenningen. Version 0.2 ist eine statische Webapp ohne externe JavaScript-Abhängigkeiten. Keine offizielle DHBW-Anwendung.

## Bereits nutzbar

- Dashboard mit offiziellen Hochschul-Links und offenen Aufgaben
- Karteikarten für BWL und Statistik, eigene Karten für alle Fächer und lokale Lernmarkierungen
- Quiz mit Antworten und Erläuterungen
- Notizen je Lerngebiet
- Statistik: Mittelwert, Median, Modus, beide Varianzvarianten, Standardabweichung, Quartile, Häufigkeiten und Verteilungsdiagramm mit Rechenweg
- BWL: Umsatz, Gesamtkosten, Gewinn, Deckungsbeitrag und Break-even
- Lernplan mit eigenen Terminen, Erledigen und Löschen
- Export/Import der persönlichen Daten, helles/dunkles Farbschema
- Service Worker für Offline-Nutzung nach einem erfolgreichen Online-Besuch und vollständiger Cache-Installation

Die mitgelieferten Lerninhalte sind allgemeine Beispiele. Vorlesungsskripte wurden noch nicht eingearbeitet. MATLAB, Office und andere Hochschul-Angebote werden über die offiziellen Informationsseiten erschlossen; es gibt keine automatische Anmeldung oder Einbettung.

## Lokal starten (Windows 11, macOS, Linux)

Im Projektordner mit installiertem Python 3:

```sh
python -m http.server 8000
```

Danach http://localhost:8000 öffnen. Auf Windows bei Bedarf `py -m http.server 8000` verwenden. Nicht per Doppelklick über `file://` starten: JavaScript-Module und Offline-Funktionen benötigen einen Webserver.

Für die Rechentests wird Node.js 20 oder neuer benötigt:

```sh
npm test
```

Es ist kein `npm install` notwendig.

## GitHub Pages aktivieren

Der Code ist für die Projektadresse `https://ct-175.github.io/dhbw-vs-study-hub/` vorbereitet. Diese Adresse ist erst nach aktivierter und erfolgreicher Pages-Veröffentlichung erreichbar.

1. Repository → Settings → Pages öffnen.
2. Bei Source „Deploy from a branch“ auswählen.
3. Branch `main`, Ordner `/(root)` auswählen und speichern.
4. Den Abschluss der Pages-Veröffentlichung abwarten.

GitHub Free unterstützt Pages aus öffentlichen Repositories. Private Repositories benötigen für Pages einen passenden Tarif, etwa GitHub Pro. Dieses Repository wurde inzwischen vom Eigentümer öffentlich geschaltet. Ein privates Repository macht eine gewöhnliche Pages-Seite nicht automatisch zu einer privaten Website. Keine vertraulichen Hochschul-Skripte in öffentlich ausgelieferten Dateien ablegen.

Offizielle Anleitung: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Persönliche Daten

Aufgaben, Karten, Notizen und Lernmarkierungen werden in `localStorage` dieses Browsers gespeichert. Es gibt keine Konten, Cloud-Synchronisation oder gemeinsamen Bearbeitungsstände. Exporte ermöglichen einen manuellen Gerätewechsel. Im privaten Modus oder nach dem Löschen der Browserdaten können Daten verloren gehen. Ein Speicherfehler wird in der Oberfläche angezeigt; ein Export ist weiterhin möglich.

Der Hub fordert keine Hochschulpasswörter und API-Schlüssel an. Offizielle Dienste öffnen sich separat. GitHub und die geöffneten Hochschuldienste haben eigene Datenverarbeitungsregeln.

## Rechenkonventionen

- Werte mit Semikolon, Leerzeichen oder Zeilenumbrüchen trennen; Komma oder Punkt als Dezimalzeichen. Keine Tausendertrennzeichen. Maximal 10.000 Werte, Betrag höchstens 10¹².
- Deskriptive Varianz: Summe der quadrierten Abweichungen geteilt durch n. Korrigierte Stichprobenvarianz: geteilt durch n − 1, nur für n ≥ 2.
- Quartile: lineare Interpolation bei Index `(n − 1) × p`. Eine Vorlesung kann andere Konventionen verwenden.
- Modus: alle gleich häufigen Werte mit Häufigkeit > 1. Ohne Wiederholungen wird kein Modus ausgewiesen.
- Anzeige gerundet, Berechnung mit JavaScript-Gleitkommazahlen. Bei mehr als 200 verschiedenen Ausprägungen wird die Häufigkeitstabelle gekürzt; Kennzahlen und Diagramm nutzen alle Werte.
- BWL-Rechner: konstante Preise, lineare Kosten, keine Steuern. Break-even-Menge bei positivem Stückdeckungsbeitrag; ganze Stückzahlen werden aufgerundet.

## Raspberry Pi: nächste Ausbaustufe

Die Weboberfläche bleibt unabhängig vom Pi nutzbar. Ein späteres Backend kann gemeinsame Benutzerkonten, Dateien und Lernfortschritte bereitstellen. Der Browser greift dann auf eine HTTPS-API am Pi zu. Diese Version enthält noch keine Pi-Verbindung, Docker-Dienste oder Serverzugänge.

Vor der Umsetzung fehlen: tatsächlicher ICS-Link und dessen Bedingungen, gewünschte Nutzerzahl und Rechte, Modell/Anschluss der SSD, erreichbarer Pi mit aktuellem 64-Bit-System und eine Entscheidung zum externen Zugriff. RetroPie soll auf der bisherigen SD erhalten bleiben.

## Quellen für Hochschul-Links

Geprüft am 05.10.2026:

- https://www.dhbw-vs.de/studierende/serviceeinrichtungen/it-service-center/its-dienste.html
- https://www.dhbw-vs.de/studierende/serviceeinrichtungen/it-service-center/software.html
- https://www.dhbw-vs.de/studierende/studienstart.html

## Dateien

`index.html`, `styles.css`, `app.js`: Oberfläche und lokale Interaktionen. `core.js`: Berechnung und Backup-Prüfung. `content.js`: erweiterbare Lerninhalte und Hochschul-Links. `sw.js`, `manifest.webmanifest`, `icon.svg`: Offline-/App-Grundlage. Bei Änderungen am Offline-Paket die Cache-Version in `sw.js` erhöhen.

## Version 0.2

Rot, Weiß und Dunkelgrau als DHBW-inspirierte Farbgestaltung, ohne offizielles Hochschullogo. Fächerübersicht für die neun regulären Lehrveranstaltungen aus dem bereitgestellten VS-WTM26-Kalender (1. Semester WiSe26/27). Die Liste ist eine Momentaufnahme, kein vollständiger Studienplan und keine automatisch synchronisierte Kalenderauswertung.

Alle Fächer stehen für eigene Karten, Notizen und Aufgaben bereit. Nur BWL und Statistik enthalten bisher allgemeine Beispielkarten und Quizfragen. Die übrigen Skripte wurden noch nicht eingearbeitet. Das allgemeine Lerngebiet Technik bleibt für ältere Backups erhalten.

Unter Stundenplan kann jede Person ihren Rapla-Kalenderlink lokal hinterlegen und den Originalkalender öffnen. Kein Kalenderzugriffsschlüssel wurde in das Repository übernommen. Der Link wird separat im Browser gespeichert, von Backups ausgeschlossen und durch das Löschen aller persönlichen Daten ebenfalls entfernt. Noch kein ICS-Import, keine automatisch im Hub angezeigten Vorlesungen.

Das Repository ist inzwischen öffentlich; GitHub Pages wurde aktiviert. Die Sichtbarkeitseinstellung auf GitHub bleibt maßgeblich.

## Version 0.3: Skriptbezogene Lerninhalte

86 neue, eigenständig formulierte Lernkarten und 40 neue Quizfragen zu BWL und Statistik. Die allgemeinen Beispielkarten bleiben erhalten. Themenfilter ermöglichen gezielte Wiederholung. Seitenverweise beziehen sich auf physische PDF-Seiten inklusive Titelseite, nicht auf aufgedruckte Foliennummern.

Es werden keine PDFs, Folienbilder oder Originalaufgaben veröffentlicht. Die Inhalte behandeln fachliche Begriffe und Methoden in eigener Formulierung; neue Zahlenbeispiele wurden eigens erstellt. Die Fragen sind ein erster Lernbestand, kein Anspruch auf vollständige Abdeckung oder eine Prognose der Klausur.

Quellen: Statistik-Skript, Wintersemester 2026/27 (295 PDF-Seiten), und Grundlagen der Betriebswirtschaftslehre TM26, Stand 05.10.2026 (413 PDF-Seiten), vom Eigentümer bereitgestellt. Die übrigen Fächer haben noch keine eingearbeiteten Skripte.

Der Statistikrechner verwendet jetzt standardmäßig die Kurs-Quartilsregel von PDF-Seite 97: i = n × q, ganzzahlige Positionen mitteln, sonst aufrunden. Lineare Interpolation bleibt als Auswahl verfügbar. Die korrigierte Stichprobenvarianz ist die UI-Voreinstellung. Die Rechenfunktion hat weiterhin lineare Quartile als Standard für abwärtskompatible Aufrufe; die Oberfläche übergibt ihre Auswahl ausdrücklich.
