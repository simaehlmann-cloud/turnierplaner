# TurnierPro – Turniere planen für Verein, Schule und Sportunterricht

Offline-App für Trainer:innen, Jugendleiter:innen und Sportlehrkräfte. Aufgebaut wie **PitchPro**:
eine `index.html`, Cordova-Builds über GitHub Actions für den App Store und Google Play,
Deutsch/Englisch mit Flaggen auf der Startseite, dunkles Design mit Hell-Modus für die Sonne.

Arbeitstitel: **TurnierPro** (Deutsch) / **TourneyPro** (Englisch) – siehe „Umbenennen“ unten.

## Funktionen (Phase 1)

- **Meine Teams** – Teamname, Verein/Schule/Klasse, Stärke 1–5 ★, Wappen/Logo und Mannschaftsfoto
  (Kamera oder Fotos; verkleinert, nur auf dem Gerät), Kader mit Rückennummern (einzeln oder als
  eingefügte Liste). Mehrere Teams auf einmal anlegen (ein Team pro Zeile).
- **Turnier anlegen** – Name, Datum, Beginn; Teams aus „Meine Teams“ übernehmen oder für den
  Sportunterricht **schnell nummerierte Teams** erzeugen („Team 1 … 8“, Bezeichnung frei).
  Jedes Team mit Schalter **aktiv/passiv** und eigener Stärke für dieses Turnier.
- **Modi** – Jeder gegen jeden (optional Hin- und Rückspiel) · Gruppen + Finalrunde (Anzahl Gruppen,
  Weiterkommende je Gruppe, zusätzlich beste Nächstplatzierte, Spiel um Platz 3, Platzierungsspiele
  bei zwei Gruppen) · reines K.-o.-System mit **Freilosen** für die Gesetzten.
- **Auslosung** – fair verteilt (Gruppenköpfe nach Stärke), Leistungsgruppen, Zufall oder manuell.
  Danach **Ziehen am Griff ⠿** oder Antippen/Tauschen. K.-o.: Setzliste, 1 und 2 treffen frühestens im Finale.
  Erste K.-o.-Runde automatisch über Kreuz (A1–B2, B1–A2), möglichst keine Teams aus derselben Gruppe.
- **Felder & Zeiten** – beliebig viele Felder (Feld 1/2 …, A/B … oder eigene Namen wie „Halle 1“),
  Spieldauer, Wechselpause, eigene Spieldauer für die Finalrunde, Pause vor der Finalrunde.
  Der Spielplan verteilt die Spiele so, dass kein Team doppelt belegt ist und möglichst niemand
  zweimal direkt hintereinander spielt. **Vorschau** vor dem Erstellen: Anzahl Spiele, Runden, Uhrzeit von–bis.
- **Wertung frei einstellbar** – Tore, Punkte oder Sätze (bis 7, Bälle werden mitgezählt),
  Unentschieden ja/nein, Punkte für Sieg/Unentschieden/Niederlage, Reihenfolge bei Gleichstand
  (Differenz, erzielte Tore/Punkte, Balldifferenz, **direkter Vergleich**, Siege) frei sortierbar.
- **Schiedsrichter** – keine, pausierende Teams (gleichmäßig, bevorzugt aus derselben Gruppe) oder
  eine Personenliste (reihum, nie zwei Spiele gleichzeitig). Je Spiel änderbar.
- **Ergebnisse** – Spiel antippen, Tore mit ＋/− oder Sätze eintragen. Bei Gleichstand in der
  Finalrunde (oder wenn Unentschieden nicht erlaubt sind) wird der Sieger der Entscheidung abgefragt
  (Neunmeter, Golden Goal, Los – Ergebnis optional). Kampflos-Wertung. **Team festlegen** in der
  Finalrunde (z. B. nach Losentscheid). Ändert sich ein Ergebnis so, dass in späteren Spielen andere
  Teams stehen, werden deren Ergebnisse nach Rückfrage gelöscht.
- **Team fällt aus** – auf passiv setzen: offene Gruppenspiele entfallen, in der Finalrunde kommt der
  Gegner kampflos weiter. Gespielte Ergebnisse bleiben.
- **Tabellen** – live, Qualifikationsplätze grün, „=“ bei echtem Gleichstand (Losentscheid nötig),
  Finalrunde, **Endstand mit Siegerpodest**.
- **Turnieruhr** – eine Uhr für alle Felder, läuft über Zeitstempel (stimmt auch nach App-Wechsel),
  Start/Pause/Reset, ±1 Minute, Runde vor/zurück. **Signaltöne** bei Anpfiff, letzter Minute und
  Ende (Bluetooth-Box möglich), Bildschirm bleibt an. **Verzug-Assistent**: Liegt das Turnier hinter
  dem Plan, verschiebt ein Tipp alle folgenden Anstoßzeiten.
- **Teilen** – aktueller Stand, kompletter Spielplan oder nächste Runde als Text mit Emojis
  (WhatsApp & Co.); Spielplan oder Tabellen als **Bild** (1080 px, zum Teilen, Sichern, Drucken).
- **Team-Filter** im Spielplan – nur die Spiele und Schiri-Einsätze eines Teams (für Trainer/Eltern).
- **Turnier abschließen** (Archiv, Namen bleiben wie am Turniertag), **als Vorlage kopieren**, löschen.
- **Sicherung** – alles inkl. Bilder als Datei exportieren/importieren (⚙︎). Erinnerung nach 30 Tagen.
- **iPad** – Spielplan und Tabellen zweispaltig, alle Ausrichtungen.

## Funktionen (Phase 2)

- **Kinderfußball-Modus** – Champions-League-System über die Felder: Sieger rücken ein Feld hoch,
  Verlierer eins runter (Feld 1 behält den Sieger, das letzte Feld den Verlierer). Rundenzahl frei
  (auch während des Turniers änderbar). **Ungerade Teamzahl oder zu wenige Felder:** Teams pausieren
  reihum, jedes gleich oft, und behalten ihren Platz auf der Leiter; pausierende Teams pfeifen (optional).
  Unentschieden: Sieger festlegen (Schnick-Schnack-Schnuck, Neunmeter …) oder beide bleiben.
  **Ergebnisse und Tabellen ausblendbar** – dann nur „wer hat gewonnen?“ und am Ende Teilnehmer-Urkunden.
  Wird ein früheres Ergebnis geändert, werden die Folgerunden nach Rückfrage neu ausgelost.
- **Spielereignisse** – im Ergebnis-Dialog Tore (mit Torschütze aus dem Kader, Elfmeter, Eigentor),
  Gelb, Rot und Zeitstrafen (Dauer einstellbar, Countdown in der Uhr). Tore zählen automatisch zum
  Spielstand, die Minute kommt aus der Turnieruhr. Daraus: **Torschützenliste** und **Fair-Play-Wertung**.
- **Signaltöne zur Auswahl** (⚙︎): Schiri-Pfiff (Abpfiff „kurz – kurz – lang“), Hupe, Schiffshorn,
  Stadion-Fanfare, Hallen-Sirene, Gong – alle im Gerät erzeugt – oder **eigene Audiodateien** je Signal.
- **Urkunden** (Turnier ⋯ → Urkunden): Platzierung (bis Platz X), Teilnahme je Team oder **pro Kind**
  (Namen aus dem Kader), optional mit Wappen und Mannschaftsfoto, als **PDF** (Drucken/AirPrint,
  Teilen). **Vorlagen** unter ⚙︎ → Urkunden-Vorlagen: vier Designs (Klassisch, Kinder bunt, Schule
  schlicht, **eigenes Hintergrundbild**), Farbe, Logo, Unterschriften, Ort und alle Texte mit
  Platzhaltern (`{{TEAM}}`, `{{PLATZ}}`, `{{TURNIER}}`, `{{DATUM}}`, `{{SPIELER}}`, `{{VEREIN}}`, `{{ORT}}`).
  **Word-Vorlage:** Beispiel herunterladen, in Word gestalten, hochladen – die App füllt sie aus
  (eine Seite pro Urkunde) und gibt eine .docx zum Drucken aus Word/Pages zurück.
- **Siegerehrung** – Plätze einzeln aufdecken (vom letzten bis zum ersten), Fanfare, Podest, Konfetti;
  im Kindermodus ohne Platzierungen „Alle sind Sieger“.
- **Beamer-Modus** – Vollbild für Zuschauer (iPad, AirPlay): Uhr, laufende Runde, wechselnd Tabellen,
  Finalrunde, Torschützen und nächste Runde.
- **Zeit-Assistent** – „Ende spätestens 12:00“: die App schlägt passende Modi mit Spieldauer vor.
- **Teams aus Klassenliste** – Namen einfügen (optional Geschlecht und Stärke), ausgeglichene Teams
  nach Stärke und gemischt; Spieler landen direkt im Kader (für Torschützen und Urkunden pro Kind).
- **Spielzettel** als PDF (zwei Spiele pro A4-Seite): Ergebnis, Torschützen, Karten, Unterschrift.
- **Turnier-Vorlagen** – Einstellungen und Teams speichern, bei „Neues Turnier“ wieder nutzen.
- **Kader-Import** aus PitchPro und TacticBoard (Kader-Datei oder PitchPro-Sicherung).

## Funktionen (Phase 3)

- **Turnier weitergeben** (Turnier ⋯ → Turnier weitergeben): als **Datei** (AirDrop, WhatsApp, Mail –
  mit Kadern und Wappen) oder als **QR-Code-Folge** ohne Internet (komprimiert, z. B. 12 Teams mit
  Kadern und Ergebnissen = 5 Codes, wechseln automatisch). **Empfangen** auf der Startseite: Datei
  öffnen oder Codes mit der Kamera scannen (Rückfall: Codes einzeln fotografieren). Gibt es das
  Turnier schon: aktualisieren oder als Kopie anlegen.
- **Signal bei gesperrtem Bildschirm:** Läuft die Turnieruhr, plant die App lokale Benachrichtigungen
  für „noch 1 Minute“ und „Abpfiff“ (Plugin `cordova-plugin-local-notification`). Pause, Reset und
  Korrekturen planen sie neu.
- **Freemium / In-App-Kauf** (`cordova-plugin-purchase`): Basis-Version bis 6 Teams; **Pro** (Einmalkauf
  `de.turnierpro.app.pro`): unbegrenzte Teams, Kinderfußball, Urkunden, Weitergeben, alle Signaltöne,
  Beamer-Modus. Mit „Käufe wiederherstellen“ (Pflicht bei Apple).
  **Schalter:** `const FREEMIUM = false;` in `index.html` – für TestFlight ist alles frei. Vor der
  Veröffentlichung auf `true` setzen und in App Store Connect das In-App-Produkt anlegen (siehe unten).
- **Neues App-Icon:** Turnierbaum mit Pokal und Ball auf Rasen; daraus werden alle Größen erzeugt.

## Geplant

- Store-Start: endgültiger Name, Screenshots, Store-Texte; Play-Store-Veröffentlichung.
- Ideen: Turnierserien mit Gesamtwertung, Turnierheft als PDF, Saison-Statistik, Barrierefreiheit.

## TestFlight (iOS)

1. **developer.apple.com → Identifiers:** App-ID `de.turnierpro.app` anlegen (Capability „In-App Purchase“
   ist automatisch dabei).
2. **Profiles:** „App Store Connect“-Profil für diese App-ID mit dem vorhandenen Distributionszertifikat
   erstellen, herunterladen, base64-kodieren → Secret `IOS_PROVISIONING_PROFILE` in diesem Repo.
   Die übrigen Secrets wie bei PitchPro (`IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`,
   `IOS_TEAM_ID`, `IOS_SIGNING_IDENTITY`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`).
3. **App Store Connect → Apps → ＋ Neue App:** Plattform iOS, Name (muss im Store einmalig sein),
   Primärsprache Deutsch, Bundle-ID `de.turnierpro.app`, SKU z. B. `turnierpro`.
4. **GitHub → Actions → „Build TurnierPro (iOS)“ → Run workflow.** Nach 5–30 Minuten erscheint der Build
   in App Store Connect unter TestFlight.
5. **TestFlight:** Exportbestimmungen sind beantwortet (`ITSAppUsesNonExemptEncryption = false`).
   Interne Tester (bis 100, Mitglieder deines Teams) sofort; externe Tester (z. B. Kolleg:innen) nach
   kurzer Beta-Prüfung durch Apple – dafür Testinformationen und eine Kontakt-E-Mail ausfüllen.

**Vor dem Store-Start (nicht für TestFlight nötig):** Vertrag „Paid Apps“, Steuer- und Bankdaten in App
Store Connect; In-App-Kauf → nicht verbrauchbar, Produkt-ID `de.turnierpro.app.pro`, Preis, Beschreibung,
Screenshot; dann `FREEMIUM = true`.

## Builds

Die Workflows sind von PitchPro übernommen und angepasst (App-ID `de.turnierpro.app`):

- `.github/workflows/ios.yml` – jeder Push auf `main` baut zur Kontrolle (unsigniert, mit Zertifikat
  auch signiert). **Upload nach App Store Connect nur per „Run workflow“.** Gleiche Secrets wie bei
  PitchPro, aber ein **neues App-Store-Profil für `de.turnierpro.app`**:
  1. developer.apple.com → Identifiers → neue App-ID `de.turnierpro.app` (keine besonderen Capabilities).
  2. Profiles → neues „App Store Connect“-Profil für diese App-ID mit dem vorhandenen Distributionszertifikat.
  3. Profil base64-kodieren und als Secret `IOS_PROVISIONING_PROFILE` im neuen Repo hinterlegen; die
     übrigen Secrets (`IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`, `IOS_TEAM_ID`,
     `IOS_SIGNING_IDENTITY`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`) wie bei PitchPro.
  4. In App Store Connect eine neue App mit dieser Bundle-ID anlegen.
- `.github/workflows/android.yml` – ohne Secrets eine Debug-APK, mit `KEYSTORE_BASE64`,
  `KEYSTORE_PASSWORD`, `KEY_ALIAS` (= `turnierpro`), `KEY_PASSWORD` ein signiertes AAB.
  **Eigenen Keystore für TurnierPro anlegen** (Anleitung oben im Workflow).
- Version in `config.xml` **und** `APP_VERSION` in `index.html` vor jedem Store-Update erhöhen.
- **iOS-Lokalisierung:** gebaut wird mit `cordova compile` (nicht `build`), weil `build` vorher erneut
  „prepare“ ausführt und dabei die eingebundenen Sprachordner wieder entfernt. Scheitert der Build mit
  Lokalisierung trotzdem, stehen die Xcode-Fehler als Meldungen am Lauf und es wird ohne sie gebaut.
- Plugins nur in den Workflows: `cordova-plugin-x-socialsharing` (iOS, Teilen), `cordova-plugin-statusbar`,
  `cordova-plugin-insomnia` (Bildschirm an), `cordova-plugin-local-notification` (Signal bei gesperrtem
  Bildschirm), `cordova-plugin-purchase` (Pro-Kauf); Android zusätzlich `plugins/cordova-plugin-tb-share`.
- Eingebettete Bibliotheken: `fflate` 0.8.2 (MIT), `qrcode-generator` 1.4.4 (MIT), `jsQR` 1.4.0 (Apache-2.0).
- **iOS-Berechtigungen:** Kamera (`NSCameraUsageDescription`) und Fotos (`NSPhotoLibraryUsageDescription`)
  für Wappen/Mannschaftsfoto; der Workflow bricht ab, wenn ein Text fehlt.
- **App-Name zweisprachig:** `tools/ios_localize.rb` bindet `l10n/ios/<sprache>.lproj/InfoPlist.strings`
  ins Xcode-Projekt ein (Name und Berechtigungstexte auf Deutsch bzw. Englisch). Android nutzt
  `l10n/android/values-en/strings.xml`. Der Workflow prüft im fertigen App-Paket, ob die Sprachordner
  enthalten sind, und warnt sonst in der Zusammenfassung (der Build läuft dann mit deutschem Namen weiter).
- Icons: `image.png`, `icon_fg.png`, `icon_bg.png`, `icon_store.png`, `icon_maskable.png`
  (Platzhalter: Turnierbaum mit Pokal auf Rasen); `tools/` erzeugt daraus alle Größen.

## Umbenennen (Name steht noch nicht fest)

Den Namen an diesen Stellen ändern: `config.xml` (`<name>`), `l10n/ios/de.lproj` und `en.lproj`
(`InfoPlist.strings`), `l10n/android/values-en/strings.xml`, `index.html` (`appName` in beiden Sprachen,
`<title>`), `manifest.json`, `APP_NAME` in `.github/workflows/ios.yml`, Datenschutz/Impressum.
Die **App-ID** (`de.turnierpro.app`) muss nicht zum Namen passen und sollte nach dem ersten Upload
nicht mehr geändert werden.

**Wichtig beim Hochladen über die GitHub-Weboberfläche:** Der Ordner `.github` beginnt mit einem Punkt
und ist im Finder/Explorer oft unsichtbar. Ohne ihn gibt es keine Builds.

## Tests

```
node tests/engine.test.js   # Spielplan, Auslosung, Tabellen, K.-o., Kindermodus, Statistik (26 Tests)
node tests/i18n.test.js     # alle Texte in Deutsch und Englisch vorhanden
```

Die Turnier-Logik steht in `index.html` zwischen `ENGINE-START` und `ENGINE-END` und läuft ohne Browser.

## Lokal ausprobieren

`python3 -m http.server` im Repo-Ordner starten und `http://localhost:8000` im Browser öffnen
(Entwicklertools → Handy-Ansicht).
