const select = document.getElementById("operatorSelect");
const operatorForm = document.getElementById("operatorForm");
const applyBtn = document.getElementById("applyBtn");
const codeOutput = document.getElementById("codeOutput");
const clearBtn = document.getElementById("clearBtn");

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
          <input id="outExpr" type="text" placeholder='"Hallo Welt"'>
        </label>
        <pre id="preview"></pre>`;
      break;

    default:
      operatorForm.innerHTML = `<em>Keine Eingabe definiert</em>`;
  }

  updatePreview();
  operatorForm.addEventListener("input", updatePreview);
  operatorForm.addEventListener("change", updatePreview);
});

/* =========================
   Preview erzeugen
   ========================= */
function updatePreview() {
  const op = select.value;
  const preview = document.getElementById("preview");
  if (!preview) return;

  let snippet = "";

  switch (op) {

    case "declaration":
      snippet = "var " +
        (document.getElementById("varName")?.value || "variable") + ";";
      break;

    case "initialisierung":
      snippet =
        (document.getElementById("initVar")?.value || "variable") +
        " = " +
        (document.getElementById("initValue")?.value || "0") + ";";
      break;

    case "deklaration_init":
      snippet =
        "var " +
        (document.getElementById("declInitVar")?.value || "variable") +
        " = " +
        (document.getElementById("declInitValue")?.value || "0") + ";";
      break;

    case "zuweisung":
      snippet =
        (document.getElementById("assignVar")?.value || "variable") +
        " = " +
        (document.getElementById("assignValue")?.value || "wert") + ";";
      break;

 case "einlesen": {
  const v = document.getElementById("readVar")?.value || "betrag";
  const useType = document.getElementById("useType")?.checked;
  const type = document.getElementById("readType")?.value || "string";
  const inputMode = document.querySelector('input[name="readMode"]:checked')?.value;
  const declMode = document.querySelector('input[name="readDeclMode"]:checked')?.value;

  let expr = "";

  if (inputMode === "html") {
    const inputId =
      document.getElementById("readInputId")?.value || (v + "Input");
    expr = `document.getElementById("${inputId}").value`;

    // 👉 HIER: Beispiel-HTML erzeugen
    const htmlPreview = document.getElementById("htmlPreview");
    if (htmlPreview) {
      let typeAttr = 'type="text"';
      if (useType && type === "number") typeAttr = 'type="number"';
      if (useType && type === "float") typeAttr = 'type="number" step="any"';

      htmlPreview.textContent =
`<label for="${inputId}">${v}:</label>
<input ${typeAttr} id="${inputId}">`;
    }

  } else {
    expr = `prompt("Bitte Wert eingeben")`;
    const htmlPreview = document.getElementById("htmlPreview");
    if (htmlPreview) htmlPreview.textContent = "";
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


    case "ausgabe":
      snippet = `alert(${document.getElementById("outExpr")?.value || '"Hallo"' });`;
      break;
  }

  preview.textContent = snippet;
}

/* =========================
   Übernehmen / Löschen
   ========================= */
applyBtn.addEventListener("click", () => {
  const preview = document.getElementById("preview");
  if (preview?.textContent) {
    codeOutput.value += preview.textContent + "\n";
  }
});

clearBtn.addEventListener("click", () => {
  codeOutput.value = "";
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

<script>
${jsCode}
</script>

</body>
</html>`;

  const popup = window.open("", "htmlPopup", "width=600,height=500");

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
<textarea id="out" readonly>${html.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</textarea>
<br>
<button onclick="navigator.clipboard.writeText(document.getElementById('out').value)">
In Zwischenablage kopieren</button>

</body>
</html>
  `);

  popup.document.close();
}
