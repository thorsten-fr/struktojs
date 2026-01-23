const select = document.getElementById("operatorSelect");
const operatorForm = document.getElementById("operatorForm");
const applyBtn = document.getElementById("applyBtn");
const codeOutput = document.getElementById("codeOutput");
const clearBtn = document.getElementById("clearBtn");

function usePlaceholderIfEmpty(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return "";

  return el.value.trim() !== ""
    ? el.value
    : el.placeholder || "";
}


/* =========================
   Auswahl Anweisung
   ========================= */
select.addEventListener("change", () => {
  const op = select.value;

  operatorForm.innerHTML = "";
  applyBtn.disabled = !op;
  if (!op) return;

  switch (op) {
    case "declaration":
      operatorForm.innerHTML = `
        <label>Variablenname:
          <input id="varName" type="text" placeholder="alter">
        </label>
        <pre id="preview"></pre>`;
      break;

    case "initialisierung":
      operatorForm.innerHTML = `
        <label>Variable:
          <input id="initVar" type="text" placeholder="guthaben">
        </label>
        <label>Wert:
          <input id="initValue" type="text" placeholder="10">
        </label>
        <pre id="preview"></pre>`;
      break;

    case "deklaration_init":
      operatorForm.innerHTML = `
    <label>Variable:
      <input id="declInitVar" type="text" placeholder="anzahl">
    </label>

    <label>Wert:
      <input id="declInitValue" type="text" placeholder="0">
    </label>

    <p style="font-size:0.9em; color:#555;">
      Hinweis: In JavaScript wird der Datentyp <strong>nicht</strong> bei der
      Deklaration angegeben. Der Typ ergibt sich automatisch aus dem Wert.
    </p>

    <pre id="preview"></pre>`;
      break;

    case "zuweisung":
      operatorForm.innerHTML = `
        <label>Variable:
          <input id="assignVar" type="text" placeholder="qm">
        </label>
        <label>Wert:
          <input id="assignValue" type="text" placeholder="laenge * breite">
        </label>
        <pre id="preview"></pre>`;
      break;

    case "einlesen":
      operatorForm.innerHTML = `
        <label>Variable:
          <input id="readVar" type="text" placeholder="betrag">
        </label>

        <label><input type="radio" name="readDeclMode" value="readOnly" checked>
          nur Einlesen</label>
        <label><input type="radio" name="readDeclMode" value="declareAndRead">
          Deklaration und Einlesen</label>

        <label>
          <input id="useType" type="checkbox" checked> Datentyp verwenden
        </label>

        <select id="readType">
          <option value="number">Ganzzahl</option>
          <option value="float">Dezimalzahl</option>
          <option value="string">Text</option>
        </select>

        <label><input type="radio" name="readMode" value="prompt" checked>
          prompt()</label>
        <label><input type="radio" name="readMode" value="html">
          HTML-Eingabefeld</label>

        <label>ID des Eingabefeldes:
          <input id="readInputId" type="text" placeholder="betragInput">
        </label>

        <pre id="preview"></pre>`;
      break;

    case "ausgabe":
      operatorForm.innerHTML = `
    <label>Ausdruck:
      <input id="outExpr" type="text" placeholder='"Die Fläche beträgt " + qm'>
    </label>

    <label>
      Ausgabeoption:
      <select id="outMode">
        <option value="alert">Meldefenster (alert)</option>
        <option value="html">HTML-Ausgabe</option>
        <option value="console">Konsole</option>
      </select>
    </label>

    <pre id="preview"></pre>`;
      break;

      operatorForm.innerHTML = `
        <label>Ausdruck:
          <input id="outExpr" type="text" placeholder='"Hallo Welt"'>
        </label>
        <pre id="preview"></pre>`;
      break;

    case "ausgabe_zeilenweise":
      operatorForm.innerHTML = `
    <label>Ausdruck:
      <input id="outLineExpr" type="text" placeholder='"Hallo Welt"'>
    </label>
    <pre id="preview"></pre>`;
      break;


    case "while":
      operatorForm.innerHTML = `
        <label>Bedingung:
          <input id="whileCond" type="text" placeholder="i < 10">
        </label>
        <small>Beispiel: <code>i &lt; 10</code>, <code>eingabe !== 0</code></small>
        <pre id="preview"></pre>`;
      break;

    case "for":
      operatorForm.innerHTML = `
        <label>Zählvariable:
          <input id="forVar" type="text" placeholder="i">
        </label>

        <label>Startwert:
          <input id="forStart" type="text" placeholder="0">
        </label>

        <label>Endwert:
          <input id="forEnd" type="text" placeholder="10">
        </label>

        <label>Schrittweite:
          <input id="forStep" type="text" placeholder="1">
        </label>

        <small>Beispiel: <code>i = 0 bis 10</code></small>

        <pre id="preview"></pre>`;
      break;

    default:
      operatorForm.innerHTML = `<em>Keine Eingabe definiert</em>`;
  }

  updatePreview();

  // keine Listener-Kaskaden
  operatorForm.oninput = updatePreview;
  operatorForm.onchange = updatePreview;
});

/* =========================
   Preview erzeugen
   ========================= */
function updatePreview() {
  const op = select.value;
  const preview = document.getElementById("preview");
  if (!preview) return;

  // htmlPreview standardmäßig leeren (damit nichts „stehen bleibt“)
  const htmlPreview = document.getElementById("htmlPreview");
  if (htmlPreview) htmlPreview.textContent = "";

  let snippet = "";

  switch (op) {
    case "declaration":
      snippet = "var " + (document.getElementById("varName")?.value || "variable") + ";";
      break;

    case "initialisierung":
      snippet =
        (document.getElementById("initVar")?.value || "variable") +
        " = " +
        (document.getElementById("initValue")?.value || "0") +
        ";";
      break;

    case "deklaration_init":
      snippet =
        "var " +
        (document.getElementById("declInitVar")?.value || "variable") +
        " = " +
        (document.getElementById("declInitValue")?.value || "0") +
        ";";
      break;

    case "zuweisung":
      snippet =
        (document.getElementById("assignVar")?.value || "variable") +
        " = " +
        (document.getElementById("assignValue")?.value || "wert") +
        ";";
      break;

    case "einlesen": {
      const v = document.getElementById("readVar")?.value || "betrag";
      const useType = document.getElementById("useType")?.checked;
      const type = document.getElementById("readType")?.value || "string";
      const inputMode = document.querySelector('input[name="readMode"]:checked')?.value;
      const declMode = document.querySelector('input[name="readDeclMode"]:checked')?.value;

      let expr = "";

      if (inputMode === "html") {
        const inputId = document.getElementById("readInputId")?.value || (v + "Input");
        expr = `document.getElementById("${inputId}").value`;

        // Beispiel-HTML erzeugen (OHNE Start-Button)
        if (htmlPreview) {
          let typeAttr = 'type="text"';
          if (useType && type === "number") typeAttr = 'type="number"';
          if (useType && type === "float") typeAttr = 'type="number" step="any"';

          htmlPreview.textContent =
            `<label for="${inputId}">${v}:</label>
<input ${typeAttr} id="${inputId}">
`;
        }
      } else {
        expr = `prompt("Bitte Wert eingeben")`;
      }

      if (useType) {
        if (type === "number") expr = `parseInt(${expr})`;
        if (type === "float") expr = `parseFloat(${expr})`;
      }

      snippet = (declMode === "declareAndRead")
        ? `var ${v} = ${expr};`
        : `${v} = ${expr};`;

      break;
    }

    case "ausgabe": {
      const expr = usePlaceholderIfEmpty("outExpr") || '"Text"';

      const mode = document.getElementById("outMode")?.value || "alert";

      if (mode === "alert") {
        snippet = `alert(${expr});`;
      }

      if (mode === "html") {
        snippet =
          `document.getElementById("ausgabe").innerHTML += ${expr};`;
      }

      if (mode === "console") {
        snippet = `console.log(${expr});`;
      }

      break;
    }


    case "ausgabe_zeilenweise":
      snippet =
        `document.getElementById("ausgabe").innerHTML += ` +
        (document.getElementById("outLineExpr")?.value || '"Text"') +
        ' + "<br>";';
      break;


    case "while": {
      const cond = document.getElementById("whileCond")?.value || "bedingung";
      snippet = `while (${cond}) {\n\n}`;
      break;
    }

    case "for": {
      const v = document.getElementById("forVar")?.value || "i";
      const start = document.getElementById("forStart")?.value || "0";
      const end = document.getElementById("forEnd")?.value || "10";
      const step = document.getElementById("forStep")?.value || "1";

      snippet =
        `for (var ${v} = ${start}; ${v} <= ${end}; ${v} = ${v} + ${step}) {

}`;
      break;
    }
  }

  preview.textContent = snippet;
}

/* =========================
   Übernehmen / Löschen
   ========================= */
applyBtn.addEventListener("click", () => {
  const preview = document.getElementById("preview");
  if (!preview || !preview.textContent) return;

  // an bestehendes Programm anhängen
  const current = codeOutput.value;

  // falls schon Text da ist: sauberen Zeilenumbruch ergänzen
  const sep = current && !current.endsWith("\n") ? "\n" : "";

  codeOutput.value = current + sep + preview.textContent + "\n";
});

clearBtn.addEventListener("click", () => {
  codeOutput.value = "";
  const htmlPreview = document.getElementById("htmlPreview");
  if (htmlPreview) htmlPreview.textContent = "";
});

/* =========================
   HTML-Popup
   ========================= */
function showPopup() {
  const jsCode = codeOutput.value || "";

  const html =
    `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Mein JavaScript</title>
</head>
<body>

<button onclick="starteCode()">Start</button>

<p id="ausgabe"></p>

<script>
function starteCode() {

  // Code aus dem Generator
${jsCode}

}
</script>

</body>
</html>`;

  const popup = window.open("", "htmlPopup", "width=600,height=450");

  popup.document.write(`
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>HTML-Grundgerüst</title>
  <style>
    body { font-family: monospace; padding: 10px; }
    textarea { width: 100%; height: 320px; }
  </style>
</head>
<body>

<h3>HTML-Grundgerüst</h3>
<textarea id="out" readonly>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
<br>
<button onclick="navigator.clipboard.writeText(document.getElementById('out').value)">
In Zwischenablage kopieren
</button>

</body>
</html>
  `);

  popup.document.close();
}
