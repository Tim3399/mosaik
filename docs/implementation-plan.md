# mosaik – Designbaukasten für Agents: Umsetzungsplan

**Stand:** 16. September 2026, Revision 2 (Revision 1: 15. September 2026)  
**Status:** Produktanforderungen abgestimmt; technische Umsetzungsvorschläge gegen Repository, Designunterlagen und aktuelle Abhängigkeiten geprüft.  
**Auftraggeber:** Tim Ratermann  
**Projektname und Paketname:** Projekt `mosaik` (Repository `Tim3399/mosaik`), npm-Paket `@tim3399/mosaik`. Registry und Veröffentlichungsweg sind noch offen.

> Ein Designbaukasten für Agents, um individuelle Frontend-Arbeit massiv zu minimieren.

**Prüfvermerk Revision 2:** Festgelegte Anforderungen sind unverändert – mit einer Ausnahme auf ausdrücklichen Wunsch von Tim: das Lizenzziel in Abschnitt 11. Geändert wurden Fakten und Umsetzungsvorschläge. Geänderte Stellen tragen den Vermerk „(Rev. 2)“; Begründungen und Belege stehen in [decisions.md](decisions.md).

## 0. Auftrag an den umsetzenden Agent

Prüfe diesen Plan gegen das vorhandene Repository, tatsächlich vorliegende Designunterlagen und die aktuelle Dokumentation der gewählten Abhängigkeiten. Behalte bestätigte Anforderungen bei. Begründe technische Abweichungen knapp, statt das gesamte Konzept neu zu schreiben.

Beginne mit einem kleinen, durchgängigen Ergebnis: **ein installierbares Komponentenpaket und eine daraus aufgebaute, funktionierende Komponentenvorschau**. Erweitere den Bestand während der Umsetzung anhand tatsächlichen Bedarfs. Baue keine umfangreiche Plattform oder vorsorglich vollständige Komponentenbibliothek.

Die Abschnitte unterscheiden drei Verbindlichkeiten:

- **Festgelegt:** bestätigte Produktanforderungen. Nicht eigenständig umdeuten.
- **Umsetzungsvorschlag:** konkrete Ausgangslösung. Nach technischer Prüfung übernehmen oder begründet ersetzen.
- **Später/optional:** kein Bestandteil der ersten Version, sofern für deren Umsetzung nicht tatsächlich erforderlich.

Die Aufgaben in Abschnitt 12 sind Arbeitspakete, keine Aufforderung, alle Erweiterungsideen dieses Dokuments umzusetzen.

## 1. Ziel und Erfolg

### 1.1 Produktziel – festgelegt

Entstehen soll eine gemeinsame, versionierte React-Komponentenbibliothek für kleine Tools, beispielsweise **mediagrab, schedule1_calc und ts-icon**. Dieselbe Bibliothek kann für ausdrücklich angeforderte temporäre Frontends verwendet werden.

**Ausgangslage (Rev. 2):** Von den bestehenden Projekten nutzen nur ts-icon (React 19 mit Vite) und quiltor (React 19 mit Vite und TypeScript 7) React. mediagrab (Java/Maven mit Vanilla-JavaScript), schedule1_calc (Python mit Templates) und b825-webside (SvelteKit) haben kein React-Frontend; keines der Projekte nutzt Next.js. Das Zielbild aus 1.2 gilt deshalb für React-Frontends: neue Tools, temporäre Frontends und bestehende React-Oberflächen. Eine Umstellung der übrigen Tools ist damit weder beauftragt noch vorausgesetzt.

Der Agent soll vor allem Inhalte, Daten, Anwendungslogik und die Zusammenstellung liefern. Wiederkehrende Darstellung, Bedienung und geeignete generische Frontendlogik sollen möglichst aus dem Baukasten kommen. Eine konsistente Designsprache ist ein wesentliches Ergebnis; das Hauptziel ist weniger individuelle Frontend-Arbeit.

Die Bibliothek umfasst langfristig einfache und zusammengesetzte Komponenten. Dazu gehören ausdrücklich auch umfangreichere Funktionen wie Downloadoberflächen, Datencharts, Beziehungs- und Ablaufdiagramme sowie visuelle Editoren.

### 1.2 Erfolgskriterien – festgelegt

**Für darauf aufbauende Tools:** ungefähr 90 % Bibliothekskomponenten und 10 % individuelle Komponenten als Zielbild. Dies ist keine starre Quote pro Seite und kein Ziel für den Anteil an Codezeilen. Eine kleine Zahl allgemeiner Wrapper darf nicht darüber hinwegtäuschen, dass die eigentliche Oberfläche weiterhin individuell gebaut wird.

**Für das Vorschau-Frontend:** Die Oberfläche wird vollständig aus Bibliothekskomponenten zusammengesetzt. Ihre spezielle Steuerungslogik, Beispieldaten, Auswahlzustände und Routen bleiben Anwendungscode.

**Für die Bibliothek:** Eine fertige Komponente umfasst Implementierung, Typen, Beispiele, Agent-Dokumentation und passende Qualitätsprüfungen. Die reine Existenz einer optisch ansprechenden Demo reicht nicht.

## 2. Verbindlicher Umfang und Abgrenzung

### 2.1 Bestätigte Anforderungen

| Bereich               | Festlegung                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wiederverwendung      | Gemeinsames, versioniertes Paket; keine vollständigen Bibliothekskopien pro Projekt als Normalfall.                                                                                                                                       |
| Technischer Rahmen    | React, Next.js und TypeScript reichen zunächst aus. Andere Frontend-Stacks müssen nicht unterstützt werden.                                                                                                                               |
| Komponenten           | Einfache Bausteine und umfangreiche zusammengesetzte Komponenten.                                                                                                                                                                         |
| Gestaltung            | Gemeinsame Designsprache; konkrete Ausarbeitung im Projekt unter Einbeziehung früherer Design-Findings.                                                                                                                                   |
| Anpassungen           | Wenige sinnvolle Einstellungen je Komponente; maximal zwei frei wählbare Basisfarben je Komponente.                                                                                                                                       |
| Farbarbeit            | Die Komponente übernimmt abgeleitete Schattierungen, Verläufe und zugehörige Darstellungen.                                                                                                                                               |
| Darstellungsmodi      | Bewusst gestalteter Light- und Darkmode, keine bloße Invertierung.                                                                                                                                                                        |
| Responsivität         | Unterschiedliche Bildschirmgrößen und verfügbare Breiten berücksichtigen.                                                                                                                                                                 |
| Funktionslogik        | Generische Frontendlogik dort mitliefern, wo sie für die jeweilige Komponente sinnvoll ist.                                                                                                                                               |
| Visualisierungen      | Datencharts, Beziehungen, Abläufe und visuelle Editoren gehören zum möglichen Gesamtbestand.                                                                                                                                              |
| Vorschau              | Alle vorhandenen Komponenten mit ihren unterstützten Modi, Varianten und relevanten Zuständen betrachten und ausprobieren. Farben, Modus und Vorschaugröße ändern.                                                                        |
| Erweiterung           | Fehlt ein Baustein, darf der Agent einen individuellen entwickeln. Er informiert Tim; gemeinsam wird über eine allgemeine Bibliothekskomponente entschieden.                                                                              |
| Dokumentation         | Agententaugliche Beschreibungen, typisierte Schnittstellen und direkt verwendbare Beispiele.                                                                                                                                              |
| Qualität              | Light/Dark, Breiten, relevante Zustände, Tastatur, Fokus, Lesbarkeit sowie passende Funktions- und Darstellungstests.                                                                                                                     |
| Lizenzziel des Pakets | Quellcode öffentlich einsehbar. Kommerzielle Nutzung für Organisationen ab 100.000 € Jahresumsatz ausgeschlossen, darunter erlaubt (Rev. 2, Entscheidung Tim vom 16.09.2026; ersetzt „kommerzielle Nutzung durch andere ausgeschlossen“). |
| Vorgehen              | Wenige Komponenten zum Start. Der Bau der eigenen Vorschau deckt weiteren Bedarf auf.                                                                                                                                                     |

### 2.2 Explizit nicht Teil des Produkts

Kein Website-Builder, kein visueller Seitenbaukasten, kein Projektgenerator und keine umfassende Anwendungsvorlage. Auch ein späterer Diagrammeditor ist ein eingebetteter Baustein, kein Werkzeug zum Erstellen ganzer Websites.

Kein Workflow-System für temporäre Frontends: keine automatische Bedarfserkennung, Agent-Orchestrierung, Rückkanäle, Sitzungslaufzeiten oder Bereitstellungsplattform. Temporäre Frontends sind lediglich weitere Konsumenten des Pakets.

Keine projektweite Theme-Verwaltung und kein Theme-Editor. Interne Gestaltungswerte und die Auswahl zwischen Light und Dark sind erforderlich, aber kein Auftrag für ein frei konfigurierbares globales Theme-System.

Keine vorgeschriebene Art, wie Konsumenten Komponenten kombinieren, und kein generelles Verbot eigenen CSS. Der Baukasten soll Arbeit abnehmen, nicht die gesamte Architektur eines Tools diktieren.

Keine verpflichtende Migration vorhandener Tools in der ersten Version. Die genannten Projekte beschreiben die Zielkategorie, keinen bereits erteilten Migrationsauftrag.

Keine vorsorglichen Adapter für mehrere alternative Tabellen-, Chart- oder Editorbibliotheken. Bestehende Bibliotheken dürfen verwendet und kombiniert werden; konkrete Integrationen entstehen nach Bedarf.

Kein eigenes Backend, keine Datenbank, Benutzerverwaltung, Cloud-Synchronisation, Telemetrie oder Laufzeit-Lizenzprüfung ohne späteren ausdrücklichen Auftrag.

## 3. Erstes Ergebnis: Bibliothek und eigene Vorschau

### 3.1 Erste Version – festgelegt

Die erste Version besteht aus einem tatsächlich installierbaren Paket, einem kleinen nutzbaren Komponentenbestand und einer darauf basierenden Vorschau. Der Komponentenbestand wird nicht unabhängig davon vollständig vorab geplant.

**Reihenfolge:** einen kleinen vollständigen Ausschnitt bauen, darin echte Wiederverwendung prüfen, anschließend nur die nächste benötigte Komponente ergänzen.

### 3.2 Möglicher Startbestand – Umsetzungsvorschlag

Die folgende Liste ist eine Bedarfshypothese für die Vorschau, keine abzuarbeitende Vollständigkeitsliste. Ähnliche Elemente dürfen zusammengefasst werden; nicht benötigte Elemente werden zurückgestellt.

| Aufgabe in der Vorschau         | Möglicher allgemeiner Baustein                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Flächen und Inhaltsabschnitte   | `Surface`/`Panel` mit sinnvollen Varianten statt mehrerer nahezu identischer Boxen. |
| Anordnung und Abstände          | Kleine Layoutkomponenten, etwa `Stack` und bei Bedarf `Grid`.                       |
| Beschriftung und Hierarchie     | `Text`/`Heading` oder eine entsprechend kleine Typografie-API.                      |
| Aktionen und Moduswahl          | `Button`; Auswahlsteuerung erst in der tatsächlich benötigten Form.                 |
| Beispielauswahl und Zahlenwerte | Beschriftetes Eingabefeld beziehungsweise Auswahlkomponente.                        |
| Basisfarben verändern           | `ColorField` mit zugänglicher Beschriftung und Wertanzeige.                         |
| Komponentenbeispiele erklären   | `CodeBlock`, zunächst ohne aufwendiges Syntax- oder Editorframework.                |

Die Vorschau darf beispielsweise mit `Surface`, `Stack`, `Text`, `Button` und einem Eingabefeld beginnen. Sobald sie einen weiteren wiederverwendbaren Baustein benötigt, wird dieser im Paket ergänzt und unmittelbar verwendet.

Nicht für jeden internen HTML-Knoten einen neuen öffentlichen Baustein anlegen. Öffentliche Komponenten brauchen einen verständlichen Zweck; interne Teilkomponenten dürfen privat bleiben.

### 3.3 Erste Abnahme

Ein Agent kann das Paket anhand der Dokumentation in getrennten Anwendungen installieren – einer Next.js-Anwendung mit App Router und einer React-Anwendung mit Vite (Rev. 2, weil die bestehenden React-Tools Vite nutzen) – und ein dokumentiertes Beispiel ohne Kopieren von Bibliotheksquellcode verwenden.

Tim kann in der Vorschau vorhandene Komponenten auswählen, ihre unterstützten Varianten und Zustände betrachten, die erlaubten Basisfarben ändern sowie Light/Dark und die Vorschaugröße umschalten.

Die Vorschau benötigt keine danebenliegende, unabhängig gestaltete Sammlung aus Buttons, Feldern oder Karten. Ihre spezifische Anwendungslogik wird umgekehrt nicht als vermeintlich allgemeine Bibliotheksfunktion veröffentlicht.

## 4. Designsprache und Farbvertrag

### 4.1 Designausarbeitung – festgelegt

Die konkrete Designsprache ist eine Projektaufgabe. Vorhandene allgemeine Designguides und frühere Erkenntnisse sollen berücksichtigt, aber nicht ungeprüft übernommen werden. **Quiltor ist keine automatisch verbindliche Referenz und kein belegter Qualitätsmaßstab.**

Der umsetzende Agent muss tatsächliche Unterlagen lesen oder fehlende Unterlagen ausdrücklich als fehlenden Input dokumentieren. Keine angeblich bereits beschlossenen Einzelregeln aus Erinnerung erfinden.

**Vorhandene Unterlagen (Rev. 2):** Die früheren Guide-Dateien liegen tatsächlich vor; das Inventar mit Fundstellen steht in [decisions.md](decisions.md).

- Der gemeinsame **Frontend Styleguide v2.1** ist als allgemeine Regelquelle nach [docs/design/FRONTEND_STYLEGUIDE.md](design/FRONTEND_STYLEGUIDE.md) übernommen.
- Projektbezogene `DESIGN.md`-Dateien aus quiltor, mediagrab, schedule1_calc und b825-webside zeigen, wie unterschiedlich die Identitäten der Konsumenten sind. Sie sind Vergleichsmaterial, keine Vorgabe.
- Aus quiltor, b825-webside und einem Designprozess in trampoline übernommene Lehren:
  - **Textrollen von Anfang an** statt nur einer Größenskala. Ohne Rollen wählt jede Oberfläche eigene Zahlen.
  - **Kleiner Abstandsrhythmus mit benannten Rollen** statt fast jedes Pixelwertes als Token.
  - **Farbrollen je Akzent** (Fläche, getönte Fläche, Text, Kontur) mit Kontrastprüfung in beiden Modi.
  - **Katalog als Testquelle:** Browserprüfungen entstehen aus den registrierten Szenarien, nicht aus dem gerenderten DOM.
  - **Geprüft werden auch innere Überläufe, schmale Container, Portale und überschriebene Mindestgrößen.** Das waren belegte Lücken früherer Gates.
  - **Sichtprüfung durch Tim früh** und vor breiter Testautomatisierung. Umfangreiche Nachweisarbeit darf die eigentliche Gestaltungsfrage nicht verdrängen.

Als Ergebnis entsteht eine kurze `DESIGN.md` im Wurzelverzeichnis (Rev. 2, statt `design-baseline.md`: Der übernommene Styleguide verweist an mehreren Stellen auf diesen Namen). Sie deckt ab: Typografie, Informationshierarchie, Abstände, Größen, Formen, Oberflächen, Rahmen, Schatten, Zustandsdarstellung, Icons und Bewegung. Dazu kommen bewusst getrennte Entscheidungen für Light und Dark.

Diese Grundlage zuerst an den wenigen Startkomponenten prüfen. Noch keinen vollständigen Designkatalog für alle späteren Visualisierungen ausarbeiten. **AP2 beginnt mit zwei bis drei Designrichtungen (Rev. 2):** echte Startkomponenten in Light und Dark, aus denen Tim wählt.

### 4.2 Anpassung pro Komponente – festgelegt

Je nach Komponente stehen wenige sinnvolle Anpassungen und höchstens zwei frei wählbare Basisfarben zur Verfügung. Nicht jede Komponente benötigt zwei Farben. Die Bedeutung einer Farbe ist je Komponente dokumentiert.

Es gibt keine zusätzliche öffentliche Farbkonfiguration für jeden Rahmen, Schatten, Hoverzustand, Verlaufspunkt und Text. Diese Ableitungen sind Arbeit des Baukastens.

**Technische Interpretation für den Start:** Zwei Basisfarben begrenzen die konfigurierbaren Farbeingaben, nicht die Anzahl intern abgeleiteter Abstufungen. Neutrale Flächen, lesbare Schrift und feste funktionale Zustandsfarben sind Teil der internen Gestaltung. Nicht heimlich über weitere Optionen eine dritte frei wählbare Palette einführen.

### 4.3 Farbverarbeitung – Umsetzungsvorschlag

Die Bibliothek erhält intern eine gemeinsam verwendete Farbableitung. Das ist keine öffentliche Theme-Verwaltung. Komponenten müssen ihre eigenen Farbrollen nicht jedes Mal unterschiedlich implementieren.

Eine Komponente ist ohne Farbangaben bereits nutzbar. Ein oder zwei Basiswerte beeinflussen nur ihre dokumentierten Rollen. Der Baukasten leitet daraus passende Werte für Light/Dark und relevante Zustände ab; der Konsument soll nicht zusätzliche Farbpaare für beide Modi liefern müssen.

Für den Start dürfen unterstützte Eingabeformate bewusst begrenzt werden, beispielsweise auf validierte undurchsichtige HEX-Werte. Das ist eine technische Vereinfachung, keine bereits bestätigte Produktbeschränkung. Gültige Formate und Verhalten bei ungültigen Eingaben dokumentieren.

Die Kontraststrategie muss festgelegt werden: Ein beliebiger Farbwert kann nicht gleichzeitig überall unverändert bleiben und in jedem Hintergrundkontext ausreichenden Kontrast garantieren. Empfohlener Ausgangspunkt ist, abgeleitete Helligkeiten, Textfarben und erforderlichenfalls die sichtbare Akzentabstufung anzupassen. Nicht erfüllbare Kombinationen erhalten ein definiertes sicheres Fallback und einen nachvollziehbaren Hinweis im Entwicklungs-/Vorschaubetrieb.

Die Kontrastprüfung muss reale Text-/Hintergrundkombinationen erfassen. Ein automatisch erzeugter Verlauf gilt nicht allein wegen seiner Erzeugung als gut lesbar. Für den Qualitätszielwert WCAG 2.2 AA sind unter anderem 4,5:1 für normalen Text, 3:1 für großen Text und unter den jeweiligen Bedingungen 3:1 für relevante nichttextliche UI-Informationen zu berücksichtigen. Dies ist ein vorgeschlagener Prüfmaßstab, keine behauptete Zertifizierung.[^wcag]

Mindestens prüfen: keine Farbangabe, eine Farbe, zwei Farben, identische Farben, sehr helle und sehr dunkle Werte sowie ungültige Eingaben. Zustandsbedeutungen dürfen nicht nur an der Farbe erkennbar sein.

**Startpunkt (Rev. 2):**

- **Rollen:** Aus jeder Basisfarbe entsteht derselbe kleine Rollensatz: `solid` (Fläche), `on-solid` (Text auf der Fläche), `soft` (getönte Fläche), `text` (kleine Schrift und Icons auf neutralen Flächen), `border` (bedeutungstragende Kontur) sowie Hover- und Aktivstufen. Das Modell folgt den Akzentfamilien aus quiltor und ist dort bereits mit Kontrasttests erprobt.
- **Ableitung:** Eine reine, deterministische Funktion im OKLCH-Farbraum. Server und Client berechnen deshalb dieselben Werte, eine Hydrierungsdifferenz entsteht nicht.
- **Anwendung:** Die Werte werden als lokale CSS-Custom-Properties am Wurzelelement der Komponente gesetzt. So bleibt die Farbe auf die Komponente beschränkt.
- **Kontrast:** Geprüft wird gegen die realen neutralen Flächen beider Modi.
- **Eingabe in v1:** opakes Hex (`#rrggbb`). Ungültige Eingaben fallen auf die Standardfarbe zurück und erzeugen einen Hinweis im Entwicklungsbetrieb.

### 4.4 Light-/Darkauswahl – Umsetzungsvorschlag

Ein kleiner Modusmechanismus steuert `light` oder `dark`; eine Systempräferenz als Standard ist sinnvoll, aber technisch zu prüfen. Ein Modus kann für eine Seite oder einen Vorschauabschnitt gesetzt werden, ohne daraus ein konfigurierbares Theme zu machen.

Bevorzugt CSS-basierte Vererbung beziehungsweise ein klar begrenzter Modus-Scope. Portale, Dropdowns und Dialoge müssen im richtigen Modus erscheinen. Eine Farbänderung an einer Beispielkomponente darf keine Nachbarkomponente oder die gesamte Vorschau umfärben.

Serverseitige Ausgabe und erste Clientdarstellung dürfen keine widersprüchlichen Initialwerte erzeugen. Nicht pauschal Hydrierungswarnungen unterdrücken oder die gesamte Oberfläche bis nach dem Mount ausblenden.

**Mechanismus (Rev. 2, nach Integrationsprobe):** CSS-first über ein Modus-Attribut.

- `data-mosaik-mode="light"`, `"dark"` oder `"system"` an einem beliebigen Container setzt den Modus für dessen Teilbaum, auch verschachtelt. Ohne Attribut rendern Komponenten hell.
- Für eine vorwiegend aus mosaik gebaute Anwendung ist `data-mosaik-mode="system"` am `<html>`-Element der empfohlene Standard. Die Systemeinstellung gilt nicht automatisch, weil Komponenten sonst in einer hellen Host-Seite dunkel erscheinen könnten.
- Farbtokens nutzen zwei private Umschaltvariablen statt `light-dark()`. Die Probe hat gezeigt: Next.js 16.3 schreibt `light-dark()` im Build in eine Variante um, die nur an `:root` aufgelöst wird. Damit versagen verschachtelte Modi und Seiten ohne `color-scheme`. Details in [decisions.md](decisions.md), D-06.
- Weil kein JavaScript-Zustand nötig ist, gibt es keine Hydrierungsdifferenz und kein Aufblitzen.
- Overlays rendern ihre Portale innerhalb des Modus-Scopes oder übernehmen dessen Attribut; das wird mit der ersten Overlay-Komponente geprüft.
- **Zielbrowser:** aktuelle Versionen von Chromium, Firefox und Safari (WebKit). Die verwendeten Plattformfunktionen gehören zur Web-Baseline 2024 oder früher, etwa Container Queries, `color-mix()`, OKLCH, `:has()` und `@layer`.

## 5. Komponentenvertrag und generische Logik

### 5.1 Gemeinsame Regeln – Umsetzungsvorschlag

Jede öffentliche Komponente hat einen eindeutigen Zweck, eine kleine typisierte API und sinnvolle Standardwerte. Inhalt, zugängliche Beschriftung und relevante Aktionen bleiben vom Konsumenten steuerbar. Kein bestimmtes Backend, keine Authentifizierung und keine festen Anwendungsrouten voraussetzen.

Wiederkehrende API-Begriffe werden innerhalb der Bibliothek konsistent verwendet. Eine Komponente bekommt aber nicht vorsorglich jede denkbare Eigenschaft. Slots, Zusammensetzung und Rückruffunktionen sollen eine normale Verwendung ermöglichen, ohne die Bibliothek für jeden Anwendungsfall zu forken.

Standardmäßige Erweiterungsmöglichkeiten können erhalten bleiben. Nicht dokumentierte Eingriffe in interne Selektoren sind jedoch keine stabile Schnittstelle und müssen nicht durch alle Versionen unterstützt werden.

**Ergänzende Regeln (Rev. 2):**

- **Keine fest eingebauten sichtbaren Texte.** Beschriftungen, Hinweise und zugängliche Namen kommen als Props vom Konsumenten, weil die Tools unterschiedliche Sprachen nutzen. Ist ein Standardtext unvermeidbar, ist er englisch und per Prop ersetzbar.
- **Keine globalen Resets und keine Stile für fremde Elemente.** Das Stylesheet gestaltet nur eigene, mit Präfix versehene Klassen.
- **`className` ist für äußeres Layout gedacht** (Abstand nach außen, Platzierung, Breite). Innere Größen wie Mindesthöhen und Trefferflächen sind kein unterstützter Eingriffspunkt; fehlt eine Variante, wird sie in der Komponente ergänzt.
- **`"use client"` nur in Modulen mit Hooks, Kontext oder Browser-APIs.** Komponenten ohne diese Mittel bleiben in Server Components direkt verwendbar.

### 5.2 Zuständigkeit pro Komponente – festgelegt

Ob eine Komponente reine Darstellung oder zusätzlich generische Funktionslogik anbietet, wird einzeln entschieden. Es gibt weder eine Vorgabe „alles ohne Logik“ noch einen Auftrag für eine allgemeine Funktionsplattform.

Bei Bedarf einen unabhängigen Hook oder Controller anbieten, statt Darstellung und Anwendungsanbindung untrennbar zu verschachteln. Eine solche Trennung nur einführen, wenn sie tatsächlich nützt.

**Späteres Beispiel Downloadliste:** Dateiname, Größe, Status, Fortschritt, Aktionen und Fehlerdarstellung können allgemein sein. Eine Komponente darf Abbrechen oder Wiederholen als Rückruffunktion anbieten. Ein konkreter Serverendpunkt, ein Token und die fachliche Entscheidung, welche Dateien bereitstehen, bleiben im Tool.

Ein generischer Downloadhelfer wäre eine zusätzliche Einzelentscheidung. Fortschritt oder Abbruch dürfen nicht als funktionierend dargestellt werden, wenn die konkrete Browser-/Transportanbindung sie nicht bereitstellt. Dann einen ehrlichen unbestimmten Status zeigen oder die Aktion nicht anbieten.

### 5.3 Neue projektspezifische Bausteine – festgelegt

Fehlenden Baustein im jeweiligen Tool bauen, Tim darüber informieren und anschließend gemeinsam prüfen, ob eine allgemeine Variante sinnvoll ist. Der Agent muss die Anwendung nicht grundsätzlich bis zur Bibliothekserweiterung anhalten.

Für die Meldung genügen Zweck, Grund für die Lücke, verwendete vorhandene Komponenten und eine Einschätzung der Wiederverwendbarkeit. Kein automatischer Import jedes projektspezifischen Sonderfalls in die Bibliothek.

## 6. Technische Architektur

### 6.1 Grundstruktur – Umsetzungsvorschlag

Ein Repository mit einem kleinen Workspace reicht zunächst:

- `packages/ui`: die installierbare React-/TypeScript-Bibliothek.
- `apps/showcase`: die Next.js-Vorschau als erster Konsument.
- gemeinsame Test- und Dokumentationswerkzeuge, ohne weitere Laufzeitdienste.

Ein Monorepository hier bedeutet nicht, dass die späteren Tools ebenfalls dorthin umziehen müssen. Sie konsumieren veröffentlichte Paketversionen.

Die allgemeine Bibliothek benötigt React, aber soll keine Next.js-Router oder Serverfunktionen in ihren Basiskomponenten voraussetzen. Next.js-spezifische Adapter erst ergänzen, wenn ein wirklicher Bedarf entsteht.

### 6.2 Technischer Ausgangspunkt

| Entscheidung           | Vorschlag und Prüfauftrag                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace              | Bei einem neuen Repository genügt ein einfacher npm-Workspace. Bestehende funktionierende Repository-Konventionen nicht ohne Grund austauschen. **Rev. 2:** Tims projektübergreifender Engineering-Standard 1.3.0 gilt. Das betrifft Formatierung mit Biome und Prettier, exakte Pins, Kommando-Interface, Projektprofil und CI. Details stehen in [PROJECT_PROFILE.md](PROJECT_PROFILE.md).                                                   |
| Sprache                | TypeScript mit strikter Typprüfung; öffentliche Komponenten- und Datentypen veröffentlichen. **Rev. 2:** TypeScript 7.0.2. TypeScript 7 bringt keine JavaScript-Compiler-API mit; Next.js 16.3 prüft Typen deshalb über die `tsc`-CLI.[^ts7][^next-agents] Werkzeuge, die diese API benötigen, laufen mit TypeScript 6.0.3 bzw. `@typescript/typescript6`.                                                                                     |
| Vorschau               | Next.js mit App Router, damit die Zielumgebung früh praktisch getestet wird.                                                                                                                                                                                                                                                                                                                                                                   |
| Gestaltung             | Intern gekapselte Styles; veröffentlichte Styles ohne spezielle Tailwind-Konfiguration des Konsumenten. **Rev. 2:** Statt CSS Modules gibt es Klassen mit festem Präfix und data-Attribute für Varianten und Zustände, alles in `@layer mosaik`, ausgeliefert als eine vorkompilierte `styles.css`. Das Paket braucht dafür keinen CSS-Modules-Build, der Konsument keine Bundler-Sonderbehandlung, und die Klassen bleiben im Browser lesbar. |
| Library-Build          | ESM, Typdeklarationen, definierte Exporte und gebaute Styles. Konkretes Buildwerkzeug in einer kleinen Integrationsprobe wählen. **Rev. 2:** `tsc` erzeugt je Quelldatei ein Modul; Direktiven wie `"use client"` und die Typen bleiben so ohne Zusatzplugins erhalten. Lightning CSS bündelt die Styles. tsdown ist der Fallback, seine CSS-Unterstützung ist aber noch experimentell.[^rolldown-directives]                                  |
| Interaktionsgrundlagen | Native Elemente, wo ausreichend. Komplexeres Verhalten bei Bedarf auf einer geeigneten bestehenden Basis statt vollständig neu implementieren.                                                                                                                                                                                                                                                                                                 |
| Tests                  | Funktions-/Typprüfungen plus Playwright für Browserinteraktion, Vorschau und visuelle Regressionen. **Rev. 2:** Vitest mit jsdom und Testing Library, Playwright mit `@axe-core/playwright`, dazu publint und Are the Types Wrong für das gepackte Artefakt.                                                                                                                                                                                   |
| Versionen              | Zum Implementierungsbeginn kompatible unterstützte Versionen prüfen, festhalten und in CI testen. Dieser Plan schreibt keine ungeprüften Versionsnummern fest. **Rev. 2:** Die am 16.09.2026 geprüften und gepinnten Versionen stehen in [decisions.md](decisions.md) und [PROJECT_PROFILE.md](PROJECT_PROFILE.md).                                                                                                                            |

Radix Primitives ist beispielsweise eine mögliche ungestaltete Verhaltensbasis, nicht eine beschlossene Abhängigkeit. **Rev. 2:** Gleichwertige Kandidaten sind Base UI (seit 1.0 stabil) und React Aria Components. Entschieden wird bei der ersten zusammengesetzten Komponente, die eine solche Basis tatsächlich braucht. Die Bibliothek beschreibt sich als schrittweise einsetzbare Grundlage für eigene Designs und übernimmt Teile anspruchsvoller Interaktions- und Zugänglichkeitslogik. Das ersetzt nicht die Prüfung der eigenen zusammengesetzten Komponente.[^radix]

### 6.3 Paketgrenze und Build

Die öffentliche Schnittstelle über explizite Paketexporte definieren. Interne Dateien sind keine dokumentierten Importziele; JavaScript, Typen und CSS müssen im ausgelieferten Paket erreichbar sein. `exports` unterstützt Haupt- und Unterpfad-Schnittstellen.[^node-packages]

React und gegebenenfalls React DOM als passende Peer-Abhängigkeiten behandeln, nicht als eigene zweite Laufzeit in die Bibliothek hineinbündeln. Paketdateien, Lizenzhinweise und Dokumentation bewusst in das Artefakt aufnehmen. `package.json` bietet dafür unter anderem Peer-Abhängigkeiten und die Dateiliste des Pakets.[^npm-package]

Bei Styles explizit prüfen, dass die Buildoptimierung notwendiges CSS nicht entfernt. Der Paketimport darf keine entfernten Schrift-, Icon-, Analyse- oder Lizenzdienste benötigen. Falls Assets erforderlich sind, deren Auslieferung und Rechte dokumentieren.

**CSS-Auslieferung (Rev. 2):** Der Konsument importiert `@tim3399/mosaik/styles.css` einmal, etwa im Root-Layout. JavaScript-Module importieren kein CSS; das vermeidet bundlerabhängiges Verhalten und versehentlich entferntes CSS. Schwere spätere Bereiche bekommen bei Bedarf einen eigenen CSS-Einstieg. Komponenten verwenden zunächst einen System-Font-Stack; ob und wie Konsumenten die Schrift anpassen, wird mit der Designrichtung in AP2 entschieden. Fonts werden nicht ausgeliefert.

Im Startumfang ein Paket behalten. Schwere Chart-/Editorbereiche später gesondert verteilen, sobald deren Abhängigkeiten dies rechtfertigen. Ein Unterpfadimport allein spart keine Installation einer normalen Pflichtabhängigkeit. Bundlegröße und Installationsumfang deshalb getrennt prüfen; optionale Peer-Abhängigkeiten oder weitere Pakete sind mögliche spätere Lösungen.[^npm-package]

### 6.4 React-/Next.js-Kompatibilität

Interaktive Bibliothekseinstiege benötigen die passende Clientgrenze. Diese Kennzeichnung muss auch nach dem Paketbuild erhalten bleiben. Nicht aus Bequemlichkeit sämtliche Exporte hinter eine einzige Clientgrenze legen; statische Bausteine soweit sinnvoll separat nutzbar halten.[^react-client]

Keine ungeschützten Zugriffe auf `window`, `document` oder `localStorage` beim Import oder während serverseitiger Verarbeitung. Interaktive Client-Komponenten können in Next.js an der initialen serverseitigen HTML-Ausgabe beteiligt sein. Die tatsächliche Paketkombination muss deshalb im Produktionsbuild und bei der Hydrierung geprüft werden.[^next-rsc]

Beispiele mit Ereignishandlern gehören in einen passenden Client-Kontext. Nicht suggerieren, dass gewöhnliche Callback-Funktionen beliebig über eine Server-/Clientgrenze übergeben werden können.[^next-rsc]

Die Vorschau importiert über die öffentliche Paketoberfläche. **Rev. 2:** Der Workspace-Link zeigt auf `dist`, nicht auf `src`. Lokale Workspace-Bequemlichkeiten dürfen keine fehlenden Dateien oder kaputten Exporte des späteren npm-Artefakts verdecken. Next.js kann lokale oder externe Pakete bei Bedarf über `transpilePackages` verarbeiten; ob das erforderlich ist, muss zur gewählten Auslieferungsform passen.[^next-transpile]

**Konsumentenumgebungen (Rev. 2):** Das gepackte Artefakt wird in zwei isolierten Anwendungen geprüft: Next.js mit App Router (Server Component und Client-Insel) und Vite mit React. Die zweite Umgebung entspricht den bestehenden React-Tools. Next.js 16.3 schreibt bei `next dev` einen verwalteten Block in `AGENTS.md` und `CLAUDE.md` der App; diese Dateien werden in der Vorschau committet.[^next-agents]

## 7. Vorschau-Frontend

### 7.1 Funktionen der ersten Version

| Funktion               | Erwartetes Verhalten                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Komponentenkatalog     | Vorhandene öffentliche Komponenten finden und auswählen; einfache Navigation genügt am Anfang.                       |
| Live-Beispiel          | Tatsächliche Paketkomponente mit kontrollierten Beispieldaten darstellen.                                            |
| Varianten und Zustände | Unterstützte Varianten und relevante Szenarien gezielt auswählen, ohne jede Kombination gleichzeitig zu rendern.     |
| Farbeingaben           | Je nach Komponente null, ein oder zwei Basisfarbfelder. Änderungen wirken auf das Beispiel; Rücksetzen ist möglich.  |
| Light/Dark             | Beispiel ausdrücklich in beiden Modi betrachten; Modus der äußeren Vorschau und Beispielmodus nicht unnötig koppeln. |
| Größe                  | Breite und Höhe der Vorschau in CSS-Pixeln verändern; typische Größen als einfache Ausgangswerte.                    |
| Dokumentation          | Zweck, Import, erlaubte Einstellungen und ein direkt verwendbares Beispiel beim Baustein anzeigen.                   |
| Eigenverwendung        | Steuerung, Navigation, Felder und Inhaltsflächen ebenfalls aus dem Paket zusammensetzen.                             |

Hover, Fokus und andere echte Interaktionszustände bleiben tatsächlich bedienbar. Nicht alle Pseudoklassen durch künstliche öffentliche Props wie `forceHovered` in die Produktions-API aufnehmen. Szenarien oder Browserinteraktionen gehören in Beispiele und Tests.

Lade-, Fehler- oder Leerzustände nur dort zeigen, wo sie für den Baustein existieren. Eine reine Layoutkomponente braucht keinen erfundenen Downloadfehler.

### 7.2 Vorschaugröße korrekt umsetzen – Umsetzungsvorschlag

Eine eingebettete Beispielroute in einem in der Größe veränderbaren `iframe` ist die bevorzugte Ausgangslösung: Das Element stellt einen eigenen eingebetteten Browsing-Kontext mit eigenem Dokument bereit.[^iframe]

Damit lassen sich Beispiel und äußere Vorschau voneinander trennen. Für komponentenbezogene Anpassungen Container Queries verwenden, wo sie geeignet sind: Sie reagieren auf Eigenschaften des Containers und nicht ausschließlich auf die Größe des äußeren Fensters.[^container-queries]

Ein per `transform: scale(...)` verkleinertes Bild allein ist keine ausreichende Responsive-Prüfung. Die gerenderte Vorschau bekommt die tatsächliche Zielbreite und -höhe. Ist sie größer als der verfügbare Platz, kann die Oberfläche scrollen oder einen ausdrücklich gekennzeichneten Darstellungszoom anbieten; dieser ersetzt die Zielgröße nicht.

Schmale Ansicht prüfen, aber auch einen schmalen Komponentencontainer innerhalb einer breiten Desktopseite. Eine Komponente darf nicht nur funktionieren, wenn sie immer die komplette Seite ausfüllt.

**Frame-Zustand (Rev. 2):**

- Die Beispielroute liegt in derselben Anwendung, der Frame hat also denselben Ursprung.
- Komponente, Szenario, Modus und Basisfarben stehen als URL-Parameter in der Frame-Adresse. Die Darstellung ist dadurch deterministisch, serverseitig korrekt, in Tests direkt ansteuerbar und verlinkbar.
- Bei fortlaufender Farbeingabe wird die Adresse gedrosselt aktualisiert.
- `postMessage` kommt nur dazu, falls Aktualisierungen ohne Neuladen nachweislich nötig werden; dann gelten die Prüfungen aus 7.4.
- Die Größe wird über zwei Zahlenfelder und generische Ausgangswerte eingestellt, etwa 320 × 640, 768 × 1024 und 1440 × 900. Ein Ziehgriff ist nicht nötig.

### 7.3 Geräteauswahl – optional

Später können benannte Gerätepresets Breite, Höhe und Ausrichtung vorbelegen. Zunächst genügen verständliche generische Größen. Konkrete Modellbezeichnungen und Maße nicht erfinden; nachvollziehbare Werte verwenden.

Die Vorschau ist keine vollständige Gerätesimulation. Eine Größenauswahl garantiert weder echtes Safari-Verhalten noch Touch-, Pixeldichte- oder Foldable-Eigenschaften. Für zusätzliche automatisierte Prüfungen unterstützt Playwright Geräteparameter und Farbschema-Emulation.[^pw-emulation]

### 7.4 Technische Begrenzung

Nur registrierte eigene Beispiele rendern. Kein Editor für beliebigen ausführbaren JSX-Code, kein `eval` und kein Import fremder Webseiten. Die Vorschau darf nicht schleichend zu einem App-Builder werden.

Katalogmetadaten und Zustand der Vorschau bleiben in der Anwendung beziehungsweise deren Dokumentationswerkzeugen. Bei Nachrichten zwischen Frame und äußerer Seite feste Herkunft, erwartete Quelle und erlaubte Datenstruktur prüfen. Kein allgemeines Plugin-Protokoll bauen.

Persistente Arbeitsbereiche, Accounts, Cloudspeicherung und Sitzungsverwaltung sind nicht erforderlich. Ein kopierbarer Beispielcode ist sinnvoll; dynamische Codegenerierung für jede beliebige Konfiguration ist keine Startanforderung.

## 8. Agent-Dokumentation

### 8.1 Verbindlicher Lieferumfang je Komponente

| Information                         | Zweck                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------- |
| Name, Import und Kurzbeschreibung   | Den passenden vorhandenen Baustein schnell identifizieren.                  |
| Geeignet / nicht geeignet           | Keine unnötigen Eigenbauten oder falsche Verwendung.                        |
| Typisierte Schnittstelle            | Eigenschaften, Daten, Ereignisse und Standardwerte eindeutig beschreiben.   |
| Direkt verwendbares Minimalbeispiel | Ohne Recherche in internen Implementierungsdateien starten.                 |
| Relevante Varianten und Zustände    | Bestehende Funktionen auffindbar machen.                                    |
| Farbvertrag                         | Erlaubte Basisfarben und deren konkrete Bedeutung.                          |
| Verhalten                           | Light/Dark, Breiten, Tastatur und gegebenenfalls Touch beschreiben.         |
| Zuständigkeitsgrenze                | Mitgelieferte Logik gegenüber Aufgaben der Anwendung abgrenzen.             |
| Einschränkungen                     | Notwendige Clientgrenze, Sonderabhängigkeiten oder bekannte Grenzen nennen. |

### 8.2 Organisation – Umsetzungsvorschlag

Eine kurze `AGENTS.md` erläutert Installation, Fundstellen, die Wiederverwendungsregel und das Vorgehen bei fehlenden Komponenten. Ein kompakter Komponentenindex verweist auf die jeweiligen Detailseiten.

**Zwei Zielgruppen (Rev. 2):**

- **Mitwirkende:** Die `AGENTS.md` im Repository richtet sich an Agents, die mosaik weiterentwickeln (Tims Standard, Befehle, Grenzen).
- **Konsumenten:** Ihre Anleitung, der Komponentenindex, die Detailseiten und die kompilierbaren Beispiele werden im npm-Paket mitgeliefert. Sie passen so immer zur installierten Version.
- **Einbindung:** Konsumierende Projekte übernehmen einen kurzen Block in ihre eigene `AGENTS.md`, der auf `node_modules/@tim3399/mosaik/` verweist. Next.js 16.3 nutzt dasselbe Muster für seine mitgelieferte Dokumentation.[^next-agents]

TypeScript-Typen bleiben die Quelle der API-Wahrheit. Verwendete Beispiele sind kompilierbare Dateien, die auch in Vorschau und Tests verwendet werden können. Keine drei unabhängig gepflegten Versionen desselben Beispiels für Dokumentation, Galerie und Tests.

Beschreibende Katalogmetadaten können in einem einfachen typisierten Manifest liegen. Daraus bei Bedarf einen kleinen maschinenlesbaren Index erzeugen. Kein eigenes Manifest-Framework und keine dynamische Komponenten-Registry als Produktfunktion.

Wichtige Dokumentation und Beispiele müssen zur installierten Paketversion passen und erreichbar sein, etwa im Paket oder über einen versionsbezogenen Verweis. Eine nur im privaten Entwicklungskontext vorhandene Anleitung erfüllt das Ziel nicht.

**Nicht erforderlich:** eigener MCP-Server, Agent-Runtime, Prompt-Plattform oder verpflichtender Skill. Der Baukasten muss mit gewöhnlichem Repository-/Dateizugriff benutzbar sein.

### 8.3 Praktische Prüfung der Agent-Nutzbarkeit

Ein Agent erhält nur die Konsumentendokumentation und eine kleine konkrete Oberflächenaufgabe. Er soll vorhandene Komponenten auswählen und verwenden können, ohne erst deren interne Implementierung zu studieren.

Dabei festhalten, welche Lücken, unnötigen Eigenbauten oder missverständlichen APIs auftreten. Diese Beobachtungen verbessern den Baukasten. Nicht vorschnell behaupten, 90 % Wiederverwendung seien bereits nachgewiesen.

## 9. Qualität und Tests

### 9.1 Definition of Done je Komponente – festgelegt, konkretisiert

Eine Komponente gilt erst als fertig, wenn ihre anwendbaren Anforderungen erfüllt sind:

- Öffentliche API und Typen sind nachvollziehbar, Beispiele funktionieren und Dokumentation ist vorhanden.
- Standardgestaltung und erlaubte Farbanpassungen funktionieren in Light und Dark.
- Unterschiedliche Breiten, lange Inhalte und relevante Zustände werden korrekt behandelt.
- Relevante Tastaturbedienung, Fokus und zugängliche Beschriftungen funktionieren.
- Funktions- und Darstellungstests sind vorhanden, soweit für den Baustein sinnvoll.
- Die Vorschau verwendet die echte Paketkomponente statt eines gesonderten Demo-Nachbaus.

Zusätzlicher empfohlener Zielmaßstab ist WCAG 2.2 AA für die jeweils relevanten Kriterien. Eine Bibliothek kann dabei nur ihre eigenen Beiträge prüfen; Inhalt und Einbettung der fertigen Anwendung bleiben ebenfalls relevant.[^wcag]

### 9.2 Schlanke Testmatrix – Umsetzungsvorschlag

| Dimension          | Startprüfung                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modi               | Light und Dark; Systempräferenz nur, wenn implementiert.                                                                                                                                                                                         |
| Breiten            | Beispielsweise 320, 768 und 1440 CSS-Pixel, zusätzlich ein schmaler Komponentencontainer. Das sind Testwerte, keine feste Geräteliste.                                                                                                           |
| Farben             | Standard plus gezielte Grenzfälle aus Abschnitt 4; kein vollständiges kartesisches Produkt aller Farben.                                                                                                                                         |
| Inhalte            | Leere, kurze und lange Werte; relevante Lade-/Fehlerszenarien.                                                                                                                                                                                   |
| Interaktion        | Reale Tastatur-/Zeigeraktionen, sichtbarer Fokus, keine versehentlich ausgelösten Aktionen.                                                                                                                                                      |
| Browser            | Chromium, Firefox und WebKit als vorgeschlagene Browserprojekte; Detailmatrix zu Beginn festhalten. **Rev. 2:** Lokal genügt Chromium; die volle Matrix läuft in CI.                                                                             |
| Einbindung         | Produktionsbuild der Vorschau sowie Installation des gepackten Artefakts in isolierten Konsumentenumgebungen. **Rev. 2:** Next.js App Router und Vite + React, jeweils Produktionsbuild und Browser-Smoke; dazu publint und Are the Types Wrong. |
| Szenarien (Rev. 2) | Browserfälle werden aus den registrierten Szenarien erzeugt. Geprüft werden auch innere Überläufe, ein schmaler Container, Portale im Prüfbereich und Mindestgrößen von Trefferflächen.                                                          |

Komplexe Tabellen oder Diagramme dürfen eine bewusst entworfene Scroll- oder Detailansicht benötigen. Solche Ausnahmen dokumentieren, statt Inhalte einfach abzuschneiden. Spätere Editorbausteine bekommen eigene Anforderungen an mobile Bedienbarkeit, statt pauschal vollständige Desktop-Bedienung zu versprechen.

Für Bewegung eine reduzierte Variante vorsehen, wenn die Komponente Animationen benötigt. Keine Animation nur deshalb einbauen, um einen Motion-Standard abzuarbeiten.

### 9.3 Automatisierung und manuelle Prüfung

Playwright unterstützt Screenshotvergleiche. Referenzbilder und Tests in einer kontrollierten, vergleichbaren Umgebung erzeugen; Betriebssystem, Browser und Renderingumgebung können Ergebnisse beeinflussen.[^pw-snapshots]

Beispieldaten, Zufallswerte, Zeitangaben und Animationen für visuelle Tests deterministisch machen. Referenzbilder nicht pauschal aktualisieren, nur um einen Fehler verschwinden zu lassen. Sichtbare Änderungen müssen verstanden und geprüft werden.

**Zeitpunkt und Umgebung (Rev. 2):** Visuelle Referenzbilder entstehen erst, wenn Tim die Designrichtung freigegeben hat; sonst veralten sie mit jeder Designrunde. Sie werden in einem gepinnten Linux-Container mit dem offiziellen Playwright-Image erzeugt, damit es genau einen vergleichbaren Satz gibt. Ein geändertes Bild ist immer ein Befund, den eine Person ansieht.

Automatisierte Accessibility-Checks mit geeigneter Integration ergänzen manuelle Tastatur-, Fokus- und visuelle Prüfungen. Sie belegen allein keine vollständige Zugänglichkeit.[^pw-a11y]

### 9.4 Paketabnahme

Ein echtes Paketartefakt erzeugen und seinen Inhalt kontrollieren. `npm pack` erstellt ein solches Paketarchiv.[^npm-pack]

Das Archiv anschließend außerhalb der Workspace-Auflösung installieren. Import, Styles, Typen, Clientgrenzen und Produktionsbuild prüfen. Keine `src`-Aliasse, nicht veröffentlichte Hilfsdateien oder implizit aus dem Workspace aufgelösten Abhängigkeiten zulassen.

Zielkommandos für das spätere Repository: Entwicklung starten, Typen prüfen, Funktionsprüfungen ausführen, Browserprüfungen ausführen, bauen und Paketabnahme durchführen. Die tatsächlichen Kommandos nach dem Scaffold in der README dokumentieren; dieser Plan behauptet nicht, dass sie bereits existieren.

## 10. Repository- und Dateistruktur

**Umsetzungsvorschlag.** Erst benötigte Dateien anlegen, keine leeren Verzeichnisse für hypothetische Subsysteme.

**Rev. 2:** Die Struktur ist um die Dateien aus Tims Engineering-Standard ergänzt. `docs/implementation-plan.md` (dieses Dokument) ersetzt `requirements.md`. Der Lizenzstand steht in `LICENSE.md` und `decisions.md`, eine eigene `licensing.md` entfällt. `DESIGN.md` steht im Wurzelverzeichnis (siehe 4.1). Komponentenstyles sind normale CSS-Dateien mit Präfixklassen (siehe 6.2). Verzeichnisse mit „ab APx“ entstehen erst dort.

```text
mosaik/
├── AGENTS.md                      # Regeln für Mitwirkende und Agents in diesem Repository
├── CLAUDE.md                      # verweist auf AGENTS.md
├── DESIGN.md                      # Designgrundlage (ab AP2)
├── LICENSE.md
├── README.md
├── package.json, package-lock.json
├── biome.json, .prettierrc, .prettierignore, .editorconfig, .gitattributes, .nvmrc
├── .github/workflows/ci.yml
├── docs/
│   ├── implementation-plan.md
│   ├── decisions.md
│   ├── component-contract.md
│   ├── PROJECT_PROFILE.md         # Engineering-Profil nach Standard 1.3.0
│   ├── standards/                 # unveränderlicher Snapshot des Standards
│   └── design/
│       └── FRONTEND_STYLEGUIDE.md # übernommene allgemeine Regelquelle
├── scripts/                       # doctor, dev
├── packages/
│   └── ui/                        # npm-Paket @tim3399/mosaik
│       ├── package.json
│       ├── README.md              # Konsumentenanleitung, wird ausgeliefert
│       ├── LICENSE.md
│       ├── scripts/
│       ├── src/
│       │   ├── components/
│       │   │   └── button/
│       │   │       ├── Button.tsx
│       │   │       ├── button.css
│       │   │       └── Button.test.tsx
│       │   ├── foundations/
│       │   ├── styles/
│       │   └── index.ts
│       ├── docs/
│       │   └── components/        # ab AP4, wird ausgeliefert
│       └── examples/              # ab AP3, wird ausgeliefert
├── apps/
│   └── showcase/
│       └── src/
│           ├── app/
│           ├── catalog/           # ab AP3
│           └── preview/           # ab AP3
└── tests/
    ├── browser/
    └── package-consumer/
        └── fixtures/
            ├── next-app/
            └── vite-app/
```

`foundations` enthält nur wirklich gemeinsame interne Grundlagen, keine Sammlung beliebiger Hilfsfunktionen. Komponentenbezogene Logik bleibt bei ihrer Komponente.

`catalog` und `preview` enthalten Zusammenstellung, Beispielszenarien und Vorschauzustand. Keine zweite Sammlung unabhängig gestalteter UI-Grundelemente anlegen.

Eine einzelne kurze Entscheidungsdatei reicht zunächst. Erst bei tatsächlichem Nutzen auf mehrere Architekturentscheidungsdokumente aufteilen.

## 11. Lizenzierung und Veröffentlichung

### 11.1 Bestätigtes Lizenzziel

**Der Quellcode des Pakets soll öffentlich einsehbar sein. Kommerzielle Nutzung ist für Organisationen mit weniger als 100.000 € Jahresumsatz erlaubt und ab 100.000 € ausgeschlossen (Rev. 2, Entscheidung Tim vom 16.09.2026).** Revision 1 schloss kommerzielle Nutzung durch andere vollständig aus.

Dieses Modell nicht als Open Source im OSI-Sinn bewerben: Die Open-Source-Definition erlaubt keine Beschränkung auf bestimmte Tätigkeitsfelder, etwa einen Ausschluss geschäftlicher Nutzung. Die passende Beschreibung ist hier öffentlich einsehbarer beziehungsweise source-available Code mit Nutzungsbeschränkung.[^osi]

Die Aussage betrifft das Paket. Sie ist keine automatische Neulizenzierung aller Anwendungen, die darauf aufbauen. Tim ist Rechteinhaber, seine eigene Nutzung ist durch die Lizenz nicht beschränkt.

### 11.2 Gewählte Lizenz (Rev. 2)

**Umsetzung:** [LICENSE.md](../LICENSE.md) enthält, seit dem ersten veröffentlichten Stand wirksam:

1. Den **unveränderten Text der PolyForm Noncommercial License 1.0.0**[^polyform], byte-identisch mit dem Tag `1.0.0` des PolyForm-Projekts. Er erlaubt nichtkommerzielle Zwecke, bestimmte persönliche Nutzungen sowie Nutzung durch gemeinnützige, Bildungs-, Forschungs-, Gesundheits-, Umwelt- und staatliche Organisationen, unabhängig von deren Finanzierung.
2. Eine **zusätzliche Erlaubnis für kleine Unternehmen**, nachgebildet der Formulierung der PolyForm Small Business License. Nutzung zugunsten des eigenen Unternehmens ist erlaubt, wenn der zusammengerechnete Jahresumsatz aller verbundenen Organisationen im letzten abgeschlossenen Geschäftsjahr unter 100.000 € lag.
   - Bei Auftragsarbeit für eine andere Organisation muss auch diese die Grenze einhalten (Nutznießer inklusive Konzern).
   - Wer die Grenze überschreitet, darf die Erlaubnis noch bis 90 Tage nach Ende des betreffenden Geschäftsjahres nutzen.

**Geprüfte Alternativen:**

- PolyForm Small Business: feste Grenzen von 1 Mio. USD und 100 Personen, der Text darf nicht verändert werden.[^polyform-sb]
- Business Source License 1.1: jede Version wird spätestens nach vier Jahren automatisch Open Source.[^bsl]
- Ein vollständig eigener Lizenztext wurde verworfen.

**Offene Punkte zur Lizenz:**

- Eine fachkundige Prüfung der Zusatzerlaubnis ist weiterhin empfehlenswert. Tim hat die sofortige Anwendung ausdrücklich entschieden. Eine einmal veröffentlichte Erlaubnis gilt für bereits veröffentlichte Stände weiter.
- **Hinweispflicht:** Wer mosaik in einem ausgelieferten Frontend weitergibt, muss die Lizenz oder ihre URL und die `Required Notice` mitgeben. Die gebauten Paketdateien enthalten dafür einen Lizenzkommentar. Der Konsumententest zeigt aber: Next.js 16.3 entfernt ihn vollständig, Vite 8 behält ihn nur im CSS. Die Paketdokumentation verlangt deshalb einen Eintrag in den Third-Party-Notices der Anwendung.
- **Beiträge Dritter** werden vorerst nicht angenommen, bis ein passendes Beitragsmodell festgelegt ist. Ohne ein solches Modell könnte Tim beigetragenen Code nicht frei weiterlizenzieren.

Die gewählte Lizenz in Repository, Paketmetadaten und tatsächlich ausgeliefertem Archiv konsistent ausweisen. Beispielcode, Vorschaucode und fremde Bestandteile ausdrücklich zuordnen. Fremde Abhängigkeiten, Icons, Fonts oder übernommene Dateien nicht pauschal mit einer eigenen Einschränkung neu lizenzieren; ihre Bedingungen und erforderlichen Hinweise prüfen.

**Nicht beschlossen:** kommerzielle Zusatzlizenzen oberhalb der Grenze, Gebühren oder Lizenzprüfungen zur Laufzeit. Solche Modelle nicht ungefragt implementieren oder veröffentlichen.

### 11.3 Versionen und Updates – Umsetzungsvorschlag

Mit einer klar als frühe Version gekennzeichneten Veröffentlichung beginnen. Änderungen an API, Verhalten und Darstellung dokumentieren. Auch eine technisch kompatible Styleänderung kann eine bestehende Ansicht sichtbar verändern.

Semantic Versioning liefert Regeln für Änderungen an einer deklarierten öffentlichen API; während `0.y.z` gilt dort die Entwicklungsphase. Deshalb auch frühe inkompatible Änderungen ausdrücklich nennen, statt sich nur auf Versionsnummern zu verlassen.[^semver]

Konsumenten übernehmen Updates bewusst mit passender Prüfung. Keine automatische Live-Aktualisierung bereits ausgelieferter Frontends. Registry, Paketname und Veröffentlichungsautomation vor Release festlegen; für die lokale Entwicklung reicht zunächst das erzeugte Paketarchiv.

**Rev. 2:**

- Paketname ist `@tim3399/mosaik`. Die maßgebliche Version steht in `packages/ui/package.json`.
- Releases entstehen nach Tims Standard aus Git-Tags, deren Version zum Paket passen muss. Veröffentlicht werden die geprüften Artefakte ohne erneuten Build.
- Bis zur Wahl der Registry bleiben Versionswerkzeug (`set-version`), Release-Vorprüfung und Veröffentlichung als „pending“ im Projektprofil. Zur Wahl stehen ein npm-Konto „tim3399“ oder GitHub Packages, das auch für öffentliche Pakete ein Token zur Installation verlangt.

## 12. Umsetzung in Arbeitspaketen

### AP0 – Ausgangslage prüfen und Entscheidungen begrenzen

**Arbeit:** Repository und vorhandene Guides sichten; Anforderungen aus diesem Plan festhalten. Paket-/Workspace-Grundaufbau, kompatible Versionen, Buildstrategie und Lizenz-Prüfaufgabe dokumentieren. Technische Entscheidungen nicht als neue Produktanforderungen ausgeben.

**Abnahme:** Kurze Entscheidungsübersicht mit begründeten Abweichungen, tatsächlich vorhandenen Designinputs und klar getrennten offenen Punkten. Kein vollständiger Katalog späterer Komponenten.

**Rev. 2:** Zu AP0 gehört die Übernahme von Tims Engineering-Standard 1.3.0 in allen fünf Bereichen: Agent-Regeln, Formatierung, Sprachprofile, Werkzeuge und CI/CD. Dazu gehören Snapshot, Projektprofil, Formatter-Konfiguration, exakte Pins und Kommando-Interface; nicht umgesetzte Anforderungen stehen als „pending“ im Profil.

**Abhängigkeit:** keine. Die Lizenz ist seit Revision 2 entschieden und angewendet.

### AP1 – Paket und erster vertikaler Ausschnitt

**Arbeit:** Workspace und Library-Build einrichten. Einen ersten kleinen Baustein mit Typen und Styles als echtes Paket erzeugen und in die Next.js-Vorschau importieren. Gleichzeitig Importgrenze, Styles und Client-/Serververhalten prüfen.

**Abnahme:** Die Vorschau startet; der gepackte Baustein funktioniert auch in einer isolierten Konsumentenumgebung. Keine versteckten Quellcodeimporte.

**Rev. 2:**

- Erste Bausteine sind `Button` und `TextField` (beide ohne Client-Direktive, auch in Server Components nutzbar) sowie `ColorField` (mit `"use client"`, von der Vorschau für Basisfarben benötigt). An `ColorField` ist die Clientgrenze nach dem Build in einer echten Probe geprüft. Ursprünglich sollte das `TextField` sein, es braucht aber nur `useId`, und das ist in Server Components erlaubt.
- Die Konsumentenabnahme läuft in Next.js und Vite, jeweils Produktionsbuild und Browser-Smoke, dazu publint und Are the Types Wrong.
- Die Vorschau startet über einen eigenen Launcher mit festem Port, Readiness-Prüfung und Aufräumen der eigenen Prozesse.
- CI prüft Formatierung, Lint, Typen, Tests, Builds und Konsumenten.

**Abhängigkeit:** AP0. Eine vorläufige Gestaltung genügt, sofern sie nicht als final ausgegeben wird.

### AP2 – Kleine Designgrundlage und erste Komponenten

**Arbeit:** Vorhandene Design-Findings auswerten. Wenige Startkomponenten ausarbeiten; Light/Dark, begrenzte Farbeingaben, Ableitungen und relevante Zustände gemeinsam entwickeln. Die Vorschau wächst nur mit dem tatsächlichen Bedarf.

**Abnahme:** Erste kurze Designgrundlage sowie nutzbare Komponenten mit dokumentiertem Farb- und Zustandsverhalten. Kein nachträglicher Darkmode als separate Baustelle.

**Rev. 2:** AP2 beginnt mit einem Checkpoint. Zwei bis drei Designrichtungen, umgesetzt mit echten Startkomponenten in Light und Dark und realistischen Inhalten, gehen zur Auswahl an Tim. Erst die gewählte Richtung wird zu `DESIGN.md` und zu Tokens ausgearbeitet.

**Abhängigkeit:** AP1; Designarbeit kann teilweise bereits während AP1 erfolgen.

### AP3 – Vorschau als vollständiger Eigenanwendungsfall

**Arbeit:** Komponentenwahl, Live-Beispiel, Varianten-/Zustandsauswahl, zulässige Farbeingaben, Moduswechsel und veränderbare Vorschaugröße umsetzen. Jede benötigte allgemeine UI-Ergänzung zuerst oder unmittelbar dabei im Paket erstellen.

**Abnahme:** Tim kann den Bestand in beiden Modi und verschiedenen Größen ausprobieren. Die Oberfläche besteht aus Bibliothekskomponenten; die Vorschauverwaltung bleibt in der Anwendung. Keine beliebige Codeausführung und kein Seiteneditor.

**Abhängigkeit:** AP2; iterative Rückkopplung zu AP2 ist ausdrücklich vorgesehen.

### AP4 – Dokumentation und Qualitätsnachweise vervollständigen

**Arbeit:** Agent-Einstieg, Komponentenindex, Detailbeschreibungen und kompilierbare Beispiele vervollständigen. Funktions-, Browser-, Kontrast- und Darstellungstests für vorhandene Komponenten aufbauen. Eine kleine Aufgabe nur anhand der Konsumentendokumentation durchführen.

**Abnahme:** Alle vorhandenen Komponenten erfüllen die Definition of Done. Erkannte Dokumentations- oder Integrationslücken sind behoben oder ausdrücklich als Releasehindernis vermerkt.

**Abhängigkeit:** begleitet AP1–AP3; Dokumentation und Tests werden nicht erst am Ende begonnen.

### AP5 – Erste veröffentlichbare Version

**Arbeit:** Rechtehinweise abschließen. Die Lizenz ist seit Revision 2 gewählt und angewendet; eine fachkundige Prüfung der Zusatzerlaubnis bleibt empfohlen. Registry wählen; der Paketname steht fest. Öffentliches Artefakt prüfen; Produktionsbuild der Vorschau und externe Paketinstallation wiederholen. Changelog und Konsumenteninstallation dokumentieren.

**Abnahme:** Versioniertes installierbares Paket, nutzbare Vorschau, passende Dokumentation und geklärte Veröffentlichungslizenz. Kein offener Lizenzplatzhalter im veröffentlichten Paket.

**Abhängigkeit:** AP3 und AP4 sowie Wahl der Registry. **Rev. 2:** Erste Integrationskandidaten für AP6 sind ts-icon und quiltor, beide mit React und Vite.

### AP6 – Bedarfsgesteuert erweitern

**Arbeit:** Einen realen kleinen Tool-Anwendungsfall wählen. Vorhandenes nutzen, fehlende Komponenten identifizieren und mit Tim über Generalisierung entscheiden. Keine automatische Gesamtmigration der Beispielprojekte.

**Abnahme:** Jede neue Bibliothekskomponente löst einen konkreten wiederverwendbaren Bedarf und erfüllt dieselben Qualitäts-/Dokumentationskriterien.

**Abhängigkeit:** ein praktisch nutzbarer erster Stand. Kein fester Termin und keine Pflichtliste sämtlicher Diagrammarten.

## 13. Späterer Ausbau: bewusst kein Start-Backlog

| Bereich                 | Beispiele möglicher Komponenten                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Dateioperationen        | Uploadfelder, Dateilisten, Downloadlisten, Fortschritt und wiederverwendbare Aktionen.            |
| Datendarstellung        | Tabellen, Filter, Detailansichten, Kennzahlen, Status- und Vergleichsansichten.                   |
| Datencharts             | Balken, Linien, Streudiagramme und weitere Darstellungen nach konkretem Bedarf.                   |
| Beziehungen und Abläufe | Knoten, Kanten, Layout, Navigation, Auswahl und Details.                                          |
| Visuelle Editoren       | Knoten verändern, Verbindungen bearbeiten, Eigenschaften editieren; Schnittstellen zur Anwendung. |
| Bedienmuster            | Dialoge, Werkzeugleisten, Rückmeldungen und umfangreichere Formulare.                             |

Bei Mehrseriencharts muss die Zwei-Basisfarben-Regel zusammen mit Unterscheidbarkeit ausgearbeitet werden. Abgeleitete Farben, Muster, Linienarten und Beschriftungen sind mögliche Mittel; beliebig viele gut unterscheidbare Serien sind nicht allein durch zwei Eingabefarben garantiert. Diese Einzelentscheidung gehört zur späteren Chartkomponente.

Bei Editoren Datenmodell, Auswahl, Änderungen, Undo/Redo, Validierung und mobile Bedienung nur so weit definieren, wie der konkrete Baustein es verlangt. Diese Themen nicht jetzt in ein generisches Editorframework verwandeln.

Für komplexe Bereiche vorhandene Bibliotheken prüfen und eigene konsistente Komponenten darum bauen. Erst eine geeignete Implementierung auswählen; mehrere austauschbare Engines sind ohne echten Bedarf unnötiger Umfang.

**Rev. 2:** Für Beziehungs- und Ablaufdiagramme ist React Flow (`@xyflow/react`, MIT-Lizenz) ein naheliegender Prüfkandidat. quiltor nutzt es bereits für Graphen und Storyboards. Das ist ein Hinweis, keine Vorentscheidung.

## 14. Noch im Projekt zu entscheiden

Es fehlt keine weitere Grundsatzantwort für den Start. Folgende Entscheidungen werden am passenden Arbeitspunkt getroffen:

| Entscheidung                                                   | Zeitpunkt                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Konkreter Name, Paket-Scope, Registry                          | **Rev. 2:** Name `mosaik` und Paket `@tim3399/mosaik` entschieden. Registry vor öffentlicher Veröffentlichung. |
| Frühere Designunterlagen und konkrete Designsprache            | AP0–AP2. **Rev. 2:** Unterlagen inventarisiert (siehe 4.1); Designrichtung zu Beginn von AP2 mit Varianten.    |
| Buildwerkzeug, Stylestrategie, Versions-/Browsermatrix         | Kleine technische Probe in AP0–AP1. **Rev. 2:** Vorschlag in 6.2; Ergebnis der Probe in `decisions.md`.        |
| Exakte Farbrollen, Ableitungen, Fallbacks und erlaubte Formate | AP2; bei neuen Komponenten gezielt ergänzen.                                                                   |
| Konkreter Lizenztext und Umfang der zugeordneten Dateien       | **Rev. 2:** entschieden und angewendet (siehe 11.2); fachkundige Prüfung empfohlen.                            |
| Sprache der Vorschau-Oberfläche                                | **Rev. 2:** Englisch, passend zur Komponentendokumentation.                                                    |
| Interaktionsbasis für zusammengesetzte Komponenten             | Bei der ersten Komponente, die sie braucht (Kandidaten in 6.2).                                                |
| Benannte Gerätepresets                                         | Optional nach funktionierender Größensteuerung.                                                                |
| Erste echte Integration in ein vorhandenes Tool                | Nach nutzbarem Grundstand mit Tim auswählen.                                                                   |
| Deployment der Vorschau                                        | Nach AP3, falls die Vorschau außerhalb der lokalen Entwicklung erreichbar sein soll.                           |
| Beitragsmodell für Beiträge Dritter                            | Bevor Beiträge angenommen werden.                                                                              |
| Spezialbibliotheken für Charts und Editoren                    | Erst beim entsprechenden Anwendungsfall.                                                                       |

## 15. Abschließende Abnahmecheckliste

- [ ] Die gemeinsame Bibliothek ist als versioniertes Paket installierbar.
- [ ] React-/TypeScript-Konsumenten und die Next.js-Zielumgebung sind mit dem tatsächlichen Paket getestet.
- [ ] Die erste Vorschau verwendet für ihre Oberfläche ausschließlich Bibliothekskomponenten.
- [ ] Vorschauzustand und projektspezifische Logik sind nicht unnötig in das Paket ausgelagert.
- [ ] Komponenten, Varianten und relevante Zustände sind auffindbar und ausprobierbar.
- [ ] Je Komponente sind höchstens zwei frei wählbare Basisfarben vorgesehen; abgeleitete Darstellung bleibt Bibliotheksarbeit.
- [ ] Light/Dark sind bewusst gestaltet und geprüft, nicht nur invertiert.
- [ ] Die Vorschau verändert echte Abmessungen und bietet kein bloß skaliertes Bild als Responsive-Nachweis.
- [ ] Dokumentation, Typen, Beispiele und Tests gehören zum gelieferten Komponentenbestand.
- [ ] Kein Website-Builder, Workflow-System, Projektgenerator oder öffentliches Theme-System wurde mitgebaut.
- [ ] Lizenz und Rechtehinweise entsprechen dem Ziel „öffentlich einsehbar; kommerzielle Nutzung nur für Organisationen unter 100.000 € Jahresumsatz“ (Rev. 2).
- [ ] Der Erstumfang ist klein geblieben; spätere Charts und Editoren wurden nicht ohne Bedarf vorgezogen.

## Quellen und Grenzen der Recherche

Die Produktanforderungen stammen aus der Abstimmung mit Tim. Die folgenden Primärquellen belegen technische Mechanismen und Lizenzbegriffe; die vorgeschlagene Architektur und Arbeitspaketaufteilung sind projektspezifische Empfehlungen. Abruf: 15. September 2026. Es wurde in diesem Schritt keine Implementierung erstellt und kein bestehendes Anwendungsrepository geprüft.

**Rev. 2 (16. September 2026):**

- Geprüft wurden die lokalen Repositories mediagrab, schedule1_calc, ts-icon, quiltor, b825-webside und trampoline, Tims Engineering-Standard `project-start` 1.3.0 sowie die npm-Registry (Versionen, Paketnamen).
- Ergänzte Primärquellen: Next.js 16.3, der TypeScript-CLI-Checker in Next.js, Next.js für AI Agents, TypeScript 7.0, Rolldown zu Direktiven, tsdown zu CSS, der vollständige Text der PolyForm Small Business License, die Nutzungsregeln der Business Source License und Base UI.

[^next-agents]: Next.js: _How to set up your Next.js project for AI coding agents_ (16.3.5). https://nextjs.org/docs/app/guides/ai-agents · _Next.js 16.3_. https://nextjs.org/blog/next-16-3 · _useTypeScriptCli_. https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli

[^ts7]: Microsoft: _Announcing TypeScript 7.0_. https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/

[^rolldown-directives]: Rolldown: _Directives_. https://rolldown.rs/in-depth/directives · tsdown: _CSS_. https://tsdown.dev/options/css

[^polyform-sb]: PolyForm Project: _Small Business License 1.0.0_. https://polyformproject.org/licenses/small-business/1.0.0

[^bsl]: MariaDB: _Adopting and Developing Business Source License Software_. https://mariadb.com/bsl-faq-adopting/

[^wcag]: W3C: _Web Content Accessibility Guidelines (WCAG) 2.2_, insbesondere 1.4.3, 1.4.11 sowie relevante Kriterien zu Bedienbarkeit und Fokus. https://www.w3.org/TR/WCAG22/

[^radix]: Radix Primitives: _Introduction_ und _Accessibility_. https://www.radix-ui.com/primitives/docs/overview/introduction · https://www.radix-ui.com/primitives/docs/overview/accessibility

[^node-packages]: Node.js: _Modules: Packages_, öffentliche Einstiegspunkte und Unterpfadexporte. https://nodejs.org/api/packages.html

[^npm-package]: npm: _package.json_, unter anderem `files`, `peerDependencies` und `peerDependenciesMeta`. https://docs.npmjs.com/cli/v11/configuring-npm/package-json/

[^react-client]: React: _'use client' directive_. https://react.dev/reference/rsc/use-client

[^next-rsc]: Next.js: _Server and Client Components_. https://nextjs.org/docs/app/getting-started/server-and-client-components

[^next-transpile]: Next.js: _transpilePackages_. https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages

[^iframe]: MDN: _<iframe>: The Inline Frame element_. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

[^container-queries]: MDN: _CSS container queries_. https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries

[^pw-emulation]: Playwright: _Emulation_, unter anderem Viewports, Geräteparameter und Farbschemata. https://playwright.dev/docs/emulation

[^pw-snapshots]: Playwright: _Visual comparisons_. https://playwright.dev/docs/test-snapshots

[^pw-a11y]: Playwright: _Accessibility testing_. https://playwright.dev/docs/accessibility-testing

[^npm-pack]: npm: _npm-pack_. https://docs.npmjs.com/cli/v11/commands/npm-pack/

[^osi]: Open Source Initiative: _The Open Source Definition_, insbesondere Abschnitt 6. https://opensource.org/osd

[^polyform]: PolyForm Project: _Noncommercial 1.0.0_, vollständiger Lizenztext; hier nur Prüfungskandidat. https://polyformproject.org/licenses/noncommercial/1.0.0

[^semver]: _Semantic Versioning 2.0.0_. https://semver.org/
