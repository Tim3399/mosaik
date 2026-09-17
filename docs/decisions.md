# Entscheidungen

Dieses Dokument hält Entscheidungen mit Begründung und Belegen fest. Anforderungen stehen im
[Umsetzungsplan](implementation-plan.md), Befehle und Werkzeugstände im
[Projektprofil](PROJECT_PROFILE.md). Neue Einträge kommen ans Ende des jeweiligen Abschnitts;
überholte Einträge werden als ersetzt markiert, nicht gelöscht.

## 1. Prüfung des Umsetzungsplans (16.09.2026)

Der Plan vom 15.09.2026 wurde gegen die lokalen Repositories, die vorhandenen Designunterlagen,
Tims Engineering-Standard und die aktuellen Paketversionen geprüft. Ergebnis ist Revision 2 des
Plans; geänderte Stellen tragen dort den Vermerk „(Rev. 2)“.

**Befunde, die Änderungen ausgelöst haben:**

- **Repository:** `Tim3399/mosaik` existierte leer und öffentlich. Arbeitsname damit `mosaik`;
  der unscoped npm-Name `mosaik` ist von einem fremden Paket belegt.
- **Genannte Tools:** Im Plan standen „schedula-calc“ und „ts-images“; die Repositories heißen
  `schedule1_calc` und `ts-icon`.
  - React nutzen nur ts-icon (React 19.1 mit Vite 7) und quiltor (React 19.2 mit Vite 8 und
    TypeScript 7).
  - mediagrab (Java/Maven, Vanilla-JavaScript), schedule1_calc (Python, Templates) und
    b825-webside (SvelteKit) haben kein React-Frontend.
  - Keines der Projekte nutzt Next.js.
- **Designunterlagen** lagen entgegen der Annahme des Plans vor (Inventar in Abschnitt 2).
- **Engineering-Standard:** Tims `project-start`-Standard 1.3.0 regelt Formatierung, Pins,
  Befehle, Projektprofil und CI; der Plan erwähnte ihn nicht.
- **Versionen:** TypeScript 7.0.2 ist aktuell, bringt aber keine JavaScript-Compiler-API mit.
  Werkzeuge, die sie brauchen, funktionieren damit nicht.

**Stärken des Plans, die unverändert bleiben:** klare Nicht-Ziele, kleiner vertikaler
Ausschnitt, Definition of Done, die Trennung von festgelegten Anforderungen und
Umsetzungsvorschlägen.

## 2. Inventar der Designunterlagen

| Unterlage                                                              | Fundstelle (lokal)                                                              | Verwendung in mosaik                                                                                                                                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend Styleguide v2.1                                               | identisch in quiltor, schedule1_calc, ts-icon, b825-webside                     | Übernommen nach [design/FRONTEND_STYLEGUIDE.md](design/FRONTEND_STYLEGUIDE.md) als allgemeine Regelquelle (D-12).                                                                                               |
| Styleguide v2.1 mit Zusatz §2.2 „Abnahme gegen austauschbare Vorlagen“ | mediagrab `src/design/FRONTEND_STYLEGUIDE_v2.1.md`                              | Kein Fork der Regelquelle. Die allgemein gültigen Punkte fließen in `DESIGN.md` und den Komponentenvertrag ein: Farbe braucht Herkunft, Text muss Information hinzufügen, Reduktion ersetzt keine Ausarbeitung. |
| Projekt-`DESIGN.md`                                                    | quiltor, mediagrab, schedule1_calc, b825-webside                                | Vergleichsmaterial: Die Konsumenten haben sehr unterschiedliche Identitäten (warm und serifenbetont, neutral nach Apple-Vorbild, dunkles Terminal, Neon). Keine Vorgabe für mosaik.                             |
| Designsystem-README                                                    | quiltor `packages/client/src/design/README.md`                                  | Übernommen als Muster: Farbrollen je Akzent (base, soft, text, border) mit Kontrasttests, Abstandsrollen statt reiner Skala, Texte kommen per Props.                                                            |
| Component-Audit                                                        | quiltor `ai/design-component-audit-2026-08.md`                                  | Übernommen als Prüfliste: Überläufe in inneren Containern, schmale Container, Portale im Prüfbereich, überschriebene Mindestgrößen, Stories für lange und leere Inhalte.                                        |
| Befund „Typografie ohne Rollen“                                        | Projektnotizen zu quiltor                                                       | Übernommen: Textrollen gibt es von Anfang an, nicht nur eine Größenskala.                                                                                                                                       |
| Design-Gallery und statische Designchecks                              | b825-webside `docs/DESIGN.md`                                                   | Übernommen: Katalog als Testquelle. Ein statischer Check auf Rohwerte und undefinierte Custom Properties kommt erst, wenn er konkrete Verstöße abfängt.                                                         |
| Ursachenanalyse zur Designqualität                                     | trampoline `Art/Review/DesignDirection/2026-09-12/DESIGN_QUALITY_ROOT_CAUSE.md` | Übernommen als Arbeitsweise: frühe Sichtprüfung durch Tim; Nachweisarbeit darf die Gestaltungsfrage nicht verdrängen.                                                                                           |

Quiltor bleibt, wie im Plan festgelegt, keine automatisch verbindliche Referenz.

## 3. Technische Entscheidungen

### D-01 Engineering-Standard 1.3.0 in allen Bereichen

Übernommen werden Agent-Regeln, Formatierung, Sprachprofile, Werkzeuge und CI/CD. Der Snapshot
liegt unverändert in [standards/](standards/README.md), der Stand je Bereich im Projektprofil.
**Grund:** Tims Vorgabe für neue Projekte; gleiche Befehle und Prüfungen wie in den übrigen
Repositories.

### D-02 Geprüfte Versionen (Stand 16.09.2026)

| Werkzeug                        | Version         | Hinweis                                                                                                                 |
| ------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Node.js                         | 22.23.2         | Pin wie in allen Projekten; erfüllt die engines aller Werkzeuge. Review vor dem Ende der Node-22-Wartung im April 2027. |
| npm                             | 10.9.8          | Standard für neue JavaScript-Projekte.                                                                                  |
| TypeScript                      | 7.0.2           | Siehe D-03.                                                                                                             |
| React / React DOM               | 19.3.0          | Peer-Bereich des Pakets: `^19.0.0`.                                                                                     |
| Next.js                         | 16.3.5          | Vorschau und Konsumententest.                                                                                           |
| Vite / @vitejs/plugin-react     | 8.3.0 / 6.1.1   | Konsumententest; Vitest nutzt Vite.                                                                                     |
| Vitest / jsdom                  | 5.0.1 / 30.0.1  | Komponententests.                                                                                                       |
| Playwright                      | 1.63.0          | Browsertests; Chromium lokal, volle Matrix in CI.                                                                       |
| @axe-core/playwright            | 4.13.0          | Automatisierte Zugänglichkeitsprüfung, ergänzt die manuelle Prüfung.                                                    |
| Biome / Prettier                | 2.5.14 / 3.9.7  | Formatter nach Standard; Biome zusätzlich als Linter.                                                                   |
| Lightning CSS                   | 1.33.0          | CSS-Bündelung (D-04).                                                                                                   |
| publint / @arethetypeswrong/cli | 0.3.24 / 0.18.5 | Prüfung des gepackten Artefakts.                                                                                        |

### D-03 TypeScript 7.0.2

TypeScript 7 ist die native Neuimplementierung und bringt keine JavaScript-Compiler-API mit
(erst 7.1 soll eine neue API haben). Next.js 16.3 prüft Typen standardmäßig über die `tsc`-CLI
und unterstützt TypeScript 7 damit. quiltor nutzt TypeScript 7.0.2 bereits.

**Folge:** Werkzeuge, die die alte API brauchen, laufen nicht mit TypeScript 7. Dazu zählen
etwa typescript-eslint und viele Plugins für Deklarationsdateien. mosaik nutzt keines davon;
Are the Types Wrong bringt eine eigene TypeScript-Version mit. **Rückfall:** TypeScript 6.0.3
oder das Kompatibilitätspaket `@typescript/typescript6`.

### D-04 Library-Build: `tsc` plus Lightning CSS

`tsc` erzeugt aus jeder Quelldatei ein ES-Modul und eine Deklarationsdatei. Direktiven wie
`"use client"` bleiben dabei ohne Plugin erhalten, weil nichts gebündelt wird. Lightning CSS
bündelt die Styles zu `dist/styles.css`.

**Verworfen:**

- tsdown: CSS-Unterstützung noch experimentell, zusätzliche Abhängigkeit.
- Vite im Library-Modus: Direktiven gehen beim Bündeln verloren, und das übliche Plugin für
  Deklarationsdateien nutzt die Compiler-API.

**Status:** Ergebnis der Probe siehe D-14.

### D-05 Styles: Präfixklassen, data-Attribute, `@layer`, eine Datei

Statt CSS Modules gibt es Klassen mit dem Präfix `mosaik-`; Varianten und Zustände stehen als
`data-*`-Attribute am Element. Alle Regeln liegen in `@layer mosaik`. Der Konsument importiert
`@tim3399/mosaik/styles.css` einmal.

**Grund:**

- Kein CSS-Modules-Build im Paket und keine Bundler-Sonderbehandlung beim Konsumenten.
- Klassen bleiben im Browser lesbar, was die Fehlersuche für Menschen und Agents erleichtert.
- Konsumenten-CSS ohne Layer gewinnt vorhersehbar.

**Abwägung:** Globale Element-Regeln des Konsumenten, etwa Resets, wirken dadurch ebenfalls
stärker. Der Komponentenvertrag beschreibt das, der Konsumententest deckt den Normalfall ab.

### D-06 Light/Dark über `color-scheme` und `light-dark()` — ersetzt durch D-15

Ohne Angabe folgt die Darstellung dem System; ein Attribut am Container setzt den Modus für
dessen Teilbaum. Es gibt keinen JavaScript-Zustand, also keine Hydrierungsdifferenz.
**Zielbrowser:** aktuelle Chromium-, Firefox- und Safari/WebKit-Versionen; die genutzten
Plattformfunktionen gehören zur Web-Baseline 2024 oder früher.

**Ersetzt am 16.09.2026:** Die Integrationsprobe (D-14) hat gezeigt, dass `light-dark()` in
Konsumenten-Builds nicht verlässlich ist. Der Mechanismus steht jetzt in D-15.

### D-07 Konsumentenabnahme in Next.js und Vite

Das gepackte Artefakt wird in zwei isolierten Anwendungen außerhalb des Workspaces installiert,
gebaut und im Browser geprüft.
**Grund:** Next.js ist die festgelegte Zielumgebung, die bestehenden React-Tools nutzen aber
Vite.

### D-08 Vorschau: Zustand in der URL, Oberfläche auf Englisch

Beispielframes erhalten Komponente, Szenario, Modus und Farben über URL-Parameter.
Die Oberfläche ist englisch (Entscheidung Tim, 16.09.2026) und passt damit zu API-Namen und
Komponentendokumentation.

### D-09 Agent-Dokumentation für zwei Zielgruppen

Die Repository-`AGENTS.md` richtet sich an Mitwirkende. Die Konsumentenanleitung,
Komponentendoku und Beispiele werden im npm-Paket ausgeliefert. Ein Block für die
`AGENTS.md` des Konsumenten verweist in `node_modules`.

### D-10 Visuelle Referenzbilder erst nach der Designfreigabe

Die Bilder entstehen in einem gepinnten Linux-Container mit dem offiziellen Playwright-Image.
**Grund:** Vor der Freigabe würden sie mit jeder Designrunde veralten; Schriftdarstellung
unterscheidet sich zwischen Betriebssystemen.

### D-11 Paketname `@tim3399/mosaik`

Entscheidung Tim, 16.09.2026. **Offen:** Registry (npm-Konto „tim3399“ oder GitHub Packages;
dort braucht die Installation immer ein Token).

### D-12 Styleguide in der gemeinsamen Fassung v2.1

Übernommen wird die in vier Projekten identische Fassung. Der mediagrab-Zusatz §2.2 wird
inhaltlich berücksichtigt, aber nicht als abweichende Kopie der Regelquelle übernommen.
**Grund:** Der Styleguide verlangt, Änderungen an der zentralen Vorlage versioniert und bewusst
zu übernehmen. Der Zusatz trägt noch die Versionsnummer 2.1.

### D-13 Keine fest eingebauten Texte in Komponenten

Sichtbare Texte und zugängliche Namen kommen per Props. Unvermeidbare Standardtexte sind
englisch und ersetzbar.
**Grund:** Die Konsumenten nutzen Deutsch (quiltor, mediagrab) und Englisch (schedule1_calc).

### D-14 Ergebnis der Integrationsprobe (AP1, 16.09.2026)

Geprüft wurde mit echten Builds: Paket, Next.js-Vorschau und die isolierten Konsumenten aus dem
Tarball (Next.js 16.3.5 und Vite 8.3.0). Die Belege stehen im Projektprofil.

| Befund                                                                                                                                                                                                                                                                     | Folge                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` aus TypeScript 7.0.2 erzeugt je Datei ein Modul und eine Deklaration und erhält `"use client"`; ein Build dauert rund 130 ms.                                                                                                                                        | D-04 bestätigt; kein Rückfall auf TypeScript 6 oder tsdown nötig.                                                                                                                                                                                       |
| `TextField` braucht keine Clientgrenze: React 19.3 stellt `useId` auch unter der `react-server`-Bedingung bereit.                                                                                                                                                          | `Button` und `TextField` sind ohne Direktive in Server Components nutzbar. Die Clientgrenze wird an `ColorField` geprüft; es hat dafür zusätzlich einen unkontrollierten Modus (`defaultValue`) und ist so direkt in einer Server Component verwendbar. |
| Gegenprobe: Ohne `"use client"` in `ColorField` bricht der Produktionsbuild des Next.js-Konsumenten ab (`useState is not a function`).                                                                                                                                     | Der Konsumententest belegt die Clientgrenze tatsächlich.                                                                                                                                                                                                |
| Next.js 16.3 verarbeitet die Paket-CSS erneut mit Lightning CSS und ersetzt `light-dark()` durch Variablen, die nur dort aufgelöst werden, wo das Token definiert ist (`:root`). Verschachtelte Modi versagen dann, und ohne `color-scheme` ergeben sich ungültige Farben. | D-15.                                                                                                                                                                                                                                                   |
| TypeScript prüft seit 6.0 standardmäßig Side-Effect-Imports. Im Vite-Konsumenten schlug `import "@tim3399/mosaik/styles.css"` deshalb fehl (TS2882).                                                                                                                       | Das Paket liefert `dist/styles.css.d.ts` über die `types`-Bedingung des CSS-Exports aus; Are the Types Wrong prüft damit auch diesen Einstieg.                                                                                                          |
| Next.js 16.3 entfernt im Produktionsbuild alle `@license`-Kommentare aus Client-JavaScript und -CSS, auch die von React. Vite 8 behält den Kommentar im CSS und entfernt ihn im JavaScript.                                                                                | L-01, Hinweispflicht.                                                                                                                                                                                                                                   |
| `next dev` erlaubt nur einen Dev-Server je Checkout (`.next/dev/lock`). Ein zweiter Start bricht ab; der Launcher meldet das und räumt seine Prozesse auf.                                                                                                                 | Parallele Dev-Server brauchen getrennte Worktrees mit eigenem Port.                                                                                                                                                                                     |
| `next dev` legt `apps/showcase/AGENTS.md` und `CLAUDE.md` mit einem verwalteten Block an und passt die `tsconfig.json` der Vorschau an (`allowJs`, `esModuleInterop`).                                                                                                     | Beides wird übernommen und committet; die Agent-Dateien sind vom Formatter ausgenommen.                                                                                                                                                                 |
| Playwright ordnet `<input type="color">` der Rolle `textbox` zu.                                                                                                                                                                                                           | Tests wählen Felder über exakte Namen.                                                                                                                                                                                                                  |

### D-15 Light/Dark über Modus-Attribut und private Umschaltvariablen

- **Modus:** `data-mosaik-mode="light" | "dark" | "system"` an einem beliebigen Container setzt
  ihn für dessen Teilbaum, auch verschachtelt, und setzt dort `color-scheme`. Ohne Attribut
  rendern Komponenten hell. Für Anwendungen, die überwiegend aus mosaik bestehen, ist
  `data-mosaik-mode="system"` am `<html>`-Element der dokumentierte Standard.
- **Tokens:** Jedes Farbtoken lautet
  `var(--_mosaik-light, <hell>) var(--_mosaik-dark, <dunkel>)`. Pro Scope hält genau eine der
  beiden privaten Variablen `initial` (ihr Rückfallwert gilt), die andere ist leer. Die Tokens
  werden an jedem Scope erneut deklariert und dort aufgelöst.
- **Grund:** Das Verfahren ist bundlerunabhängig. Kein Konsumenten-Build schreibt die Tokens
  um, und verschachtelte Modi funktionieren überall.
- **Abwägung:** Die `color-scheme`-Einstellung einer Host-Seite übernehmen Komponenten nicht
  automatisch.
- **Nachweis:** Browsertest mit verschachtelten Scopes im Next.js-Produktionsbuild, Gegenprobe
  mit Tokens nur an `:root` (Test schlägt fehl), Konsumententest ohne Modus-Attribut in Next.js
  und Vite.

## 4. Lizenz

### L-01 PolyForm Noncommercial 1.0.0 mit Zusatzerlaubnis für kleine Unternehmen

**Entscheidung Tim (16.09.2026):**

- **Ziel:** Kommerzielle Nutzung ist ab 100.000 € Umsatz ausgeschlossen, darunter erlaubt.
- **Modell:** PolyForm Noncommercial mit Zusatzerlaubnis.
- **Umsatzbasis:** Es zählt der Nutznießer einschließlich Konzern.
- **Zeitpunkt:** sofort, als [LICENSE.md](../LICENSE.md) vor dem ersten Push.

**Umsetzung:**

- Der Text der PolyForm Noncommercial License 1.0.0 ist unverändert enthalten, byte-identisch
  mit dem Tag `1.0.0` des PolyForm-Projekts (SHA-256 des Quelltexts
  `c0ea4a896d2c8c394b29f9427589996db826cd501c512279ff0ed3ef48fabbe5`).
- Die Zusatzerlaubnis ist der Formulierung der PolyForm Small Business License nachgebildet und
  verwendet die Begriffsdefinitionen der PolyForm-Lizenz:
  - Nutzung zugunsten des eigenen Unternehmens ist erlaubt, wenn der zusammengerechnete Umsatz
    aller verbundenen Organisationen im letzten abgeschlossenen Geschäftsjahr unter 100.000 €
    lag. Unternehmen ohne abgeschlossenes Geschäftsjahr zählen den bisherigen Umsatz; fremde
    Währungen werden zum EZB-Referenzkurs umgerechnet.
  - Bei Auftragsarbeit für eine andere Organisation müssen beide Seiten die Grenze einhalten.
  - Wer die Grenze erreicht, behält die Erlaubnis bis 90 Tage nach Ende des betreffenden
    Geschäftsjahres.
  - Nichtkommerzielle Nutzung und die in PolyForm genannten Organisationen bleiben unabhängig
    vom Umsatz erlaubt.
- `package.json` weist die Lizenz als `SEE LICENSE IN LICENSE.md` aus, weil es für die
  Kombination keine SPDX-Kennung gibt.

**Geprüfte Alternativen:**

| Alternative                      | Warum nicht                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| PolyForm Small Business 1.0.0    | Feste Grenzen von 1 Mio. USD (Stand 2019) und 100 Personen; PolyForm-Texte dürfen nicht verändert werden.                                  |
| Business Source License 1.1      | Jede Version wird spätestens nach vier Jahren automatisch unter einer GPL-kompatiblen Open-Source-Lizenz frei, auch für große Unternehmen. |
| Eigener vollständiger Lizenztext | Höheres Formulierungsrisiko als ein geprüfter Standardtext plus kurze Zusatzerlaubnis.                                                     |

**Folgen und offene Punkte:**

- **Keine Rechtsberatung:** Die Zusatzerlaubnis wurde nicht fachkundig geprüft. Eine Prüfung
  bleibt empfehlenswert, vor allem vor dem ersten Paket-Release. Eine einmal veröffentlichte
  Erlaubnis gilt für bereits veröffentlichte Stände weiter; Änderungen wirken nur für neue
  Stände.
- **Kein Open Source im Sinne der OSI;** mosaik wird als „source-available“ beschrieben.
- **Hinweispflicht:** Wer Teile von mosaik weitergibt, auch gebündelt in einem ausgelieferten
  Frontend, muss die Lizenz oder ihre URL und die `Required Notice` mitgeben. Die gebauten
  Paketdateien tragen dafür einen Lizenzkommentar.
  - Der Konsumententest (D-07, D-14) zeigt, dass dieser Kommentar nicht verlässlich erhalten
    bleibt: Next.js 16.3 entfernt ihn vollständig, Vite 8 behält ihn nur im CSS.
  - Die Paket-README verlangt deshalb einen Hinweis in den Third-Party-Notices der Anwendung
    (Lizenz-URL und `Required Notice`). Für Tims eigene Anwendungen ist das nicht nötig; er ist
    der Rechteinhaber.
- **Beiträge Dritter** werden vorerst nicht angenommen. Ohne passendes Beitragsmodell könnte
  Tim beigetragenen Code nicht frei weiterlizenzieren.
- **Tims eigene Nutzung** als Rechteinhaber ist nicht beschränkt. Bei einer späteren Übertragung
  an eine Firma müssen die Rechte ausdrücklich geregelt werden.
- **Ohne Beschluss:** kommerzielle Lizenzen oberhalb der Grenze, Gebühren,
  Laufzeit-Lizenzprüfungen.

## 5. Offene Punkte

| Punkt                                                                | Zeitpunkt                                          |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| Designrichtung (zwei bis drei Varianten zur Auswahl)                 | Beginn AP2                                         |
| Registry und Veröffentlichungsweg                                    | vor dem ersten Paket-Release                       |
| Fachkundige Prüfung der Zusatzerlaubnis                              | empfohlen vor dem ersten Paket-Release             |
| Beitragsmodell                                                       | bevor Beiträge Dritter angenommen werden           |
| Interaktionsbasis (Radix Primitives, Base UI, React Aria Components) | erste zusammengesetzte Komponente, die sie braucht |
| Erste Integration (ts-icon oder quiltor)                             | nach nutzbarem Grundstand, mit Tim                 |
| Deployment der Vorschau                                              | nach AP3, falls gewünscht                          |
