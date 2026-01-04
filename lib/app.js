const select = document.getElementById("operatorSelect");
const operatorForm = document.getElementById("operatorForm");
const applyBtn = document.getElementById("applyBtn");
const codeOutput = document.getElementById("codeOutput");
const clearBtn = document.getElementById("clearBtn");

select.addEventListener("change", () => {
  const op = select.value;

  operatorForm.innerHTML = "";
  applyBtn.disabled = !op;
  if (!op) return;

  switch (op) {
    // Deklaration: variable |als datentyp|
    case "declaration":
      operatorForm.innerHTML = `
        <label>
          Variablenname:
          <input id="varName" type="text" placeholder="alter">
        </label>
        <label>
          Datentyp (optional):
          <select id="varType">
            <option value="number">Ganzzahl</option>
            <option value="float">Dezimalzahl</option>
            <option value="string">Text</option>
            <option value="boolean">Wahrheitswert</option>
          </select>
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Initialisierung: variable = wert
    case "initialisierung":
      operatorForm.innerHTML = `
        <label>
          Variable:
          <input id="initVar" type="text" placeholder="guthaben">
        </label>
        <label>
          Wert / Ausdruck:
          <input id="initValue" type="text" placeholder="10">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Deklaration und Initialisierung: variable |als datentyp| = wert
    case "deklaration_init":
      operatorForm.innerHTML = `
        <label>
          Variablenname:
          <input id="declInitVar" type="text" placeholder="anzahl">
        </label>
        <label>
          Datentyp (optional):
          <select id="declInitType">
            <option value="number">Ganzzahl</option>
            <option value="float">Dezimalzahl</option>
            <option value="string">Text</option>
            <option value="boolean">Wahrheitswert</option>
          </select>
        </label>
        <label>
          Wert / Ausdruck:
          <input id="declInitValue" type="text" placeholder="0">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Zuweisung: element = wert
    case "zuweisung":
      operatorForm.innerHTML = `
        <label>
          Element/Variable:
          <input id="assignVar" type="text" placeholder="qm">
        </label>
        <label>
          Wert / Ausdruck:
          <input id="assignValue" type="text" placeholder="laenge * breite">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Einlesen: variable |als datentyp|
    case "einlesen":
      operatorForm.innerHTML = `
    <label>
      Variable:
      <input id="readVar" type="text" placeholder="betrag">
    </label>

    <label>Variante:</label>
<div style="display:flex; gap:20px; margin-bottom:10px;">
  <label><input type="radio" name="readDeclMode" value="readOnly" checked> nur Einlesen</label>
  <label><input type="radio" name="readDeclMode" value="declareAndRead"> Deklaration und Einlesen</label>
</div>


    <label style="display:flex; gap:10px; align-items:center;">
      <input id="useType" type="checkbox" checked>
      Datentyp verwenden (optional in der Operatorenliste)
    </label>

    <div id="typeBlock" style="margin-left:20px;">
      <label>
        Datentyp:
        <select id="readType">
          <option value="number">Ganzzahl</option>
          <option value="float">Dezimalzahl</option>
          <option value="string">Text</option>
        </select>
      </label>
    </div>

    <label>Eingabeart:</label>
    <div style="display:flex; gap:20px; margin-bottom:10px;">
      <label><input type="radio" name="readMode" value="prompt" checked> Dialogfenster (prompt)</label>
      <label><input type="radio" name="readMode" value="html"> HTML-Eingabefeld</label>
    </div>

    <div id="promptBlock">
      <label>
        Hinweistext (Dialogfenster):
        <input id="readPrompt" type="text" placeholder="Bitte geben Sie einen Wert ein">
      </label>
    </div>

    <div id="htmlBlock" style="display:none;">
      <label>
        ID des Eingabefeldes:
        <input id="readInputId" type="text" placeholder="betragInput">
      </label>
    </div>

    <pre id="preview"></pre>
  `;
      break;

    // Ausgabe: inhalt (Konsole oder Meldungsfenster)
    case "ausgabe":
      operatorForm.innerHTML = `
        <label>Ausgabeart:</label>
        <div style="display:flex; gap:20px; margin-bottom:10px;">
          <label><input type="radio" name="outType" value="console" checked> Konsole</label>
          <label><input type="radio" name="outType" value="alert"> Meldungsfenster</label>
        </div>

        <label>
          Inhalt (JS-Ausdruck):
          <input id="outExpr" type="text"
                 placeholder='"Die Fläche beträgt " + qm + " Quadratmeter."' />
        </label>

        <pre id="preview"></pre>
      `;
      break;

    // Zeilenweise Ausgabe: inhalt
    case "ausgabe_zeilenweise":
      operatorForm.innerHTML = `
        <label>
          Inhalt (JS-Ausdruck, zeilenweise):
          <input id="outLineText" type="text" placeholder='"Hallo!"'>
        </label>
        <pre id="preview"></pre>
      `;
      break;

    default:
      operatorForm.innerHTML = `<em>Für diese Anweisung ist noch kein Formular definiert.</em>`;
  }

  // Spezial: Einlesen -> Checkbox soll Typ-Block ein/ausblenden
  if (op === "einlesen") {
    const useType = document.getElementById("useType");
    const typeBlock = document.getElementById("typeBlock");

    const promptBlock = document.getElementById("promptBlock");
    const htmlBlock = document.getElementById("htmlBlock");

    function updateReadModeUI() {
      const mode = document.querySelector('input[name="readMode"]:checked')?.value || "prompt";
      promptBlock.style.display = (mode === "prompt") ? "block" : "none";
      htmlBlock.style.display = (mode === "html") ? "block" : "none";
    }

    useType.addEventListener("change", () => {
      typeBlock.style.display = useType.checked ? "block" : "none";
      updatePreview();
    });

    operatorForm.addEventListener("change", () => {
      updateReadModeUI();
      updatePreview();
    });

    updateReadModeUI();
  }


  updatePreview();

  // Wichtig: auch Radiobutton-Änderungen müssen Preview aktualisieren
  operatorForm.addEventListener("input", updatePreview);
  operatorForm.addEventListener("change", updatePreview);
});

function updatePreview() {
  const op = select.value;
  const preview = document.getElementById("preview");
  if (!preview) return;

  let snippet = "";

  switch (op) {
    case "declaration": {
      const name = (document.getElementById("varName")?.value || "variable").trim() || "variable";
      snippet = "var " + name + ";";
      break;
    }

    case "initialisierung": {
      const v = (document.getElementById("initVar")?.value || "variable").trim() || "variable";
      const val = (document.getElementById("initValue")?.value || "0").trim() || "0";
      snippet = v + " = " + val + ";";
      break;
    }

    case "deklaration_init": {
      const v = (document.getElementById("declInitVar")?.value || "variable").trim() || "variable";
      const val = (document.getElementById("declInitValue")?.value || "0").trim() || "0";
      snippet = "var " + v + " = " + val + ";";
      break;
    }

    case "zuweisung": {
      const v = (document.getElementById("assignVar")?.value || "variable").trim() || "variable";
      const val = (document.getElementById("assignValue")?.value || "wert").trim() || "wert";
      snippet = v + " = " + val + ";";
      break;
    }

    // Einlesen: variable |als datentyp|
   case "einlesen": {
  const v =
    (document.getElementById("readVar")?.value || "betrag").trim() || "betrag";

  const useType = document.getElementById("useType")?.checked;
  const type = document.getElementById("readType")?.value || "string";

  const inputMode =
    document.querySelector('input[name="readMode"]:checked')?.value || "prompt";

  const declMode =
    document.querySelector('input[name="readDeclMode"]:checked')?.value || "readOnly";

  // Grundausdruck erzeugen (prompt oder HTML-input)
  let expr = "";

  if (inputMode === "html") {
    const inputId =
      (document.getElementById("readInputId")?.value || (v + "Input")).trim();
    expr = 'document.getElementById("' + inputId.replace(/"/g, '\\"') + '").value';
  } else {
    const promptText =
      document.getElementById("readPrompt")?.value || "Bitte geben Sie einen Wert ein";
    expr = 'prompt("' + promptText.replace(/"/g, '\\"') + '")';
  }

  // optional Typ-Konvertierung
  if (useType) {
    if (type === "number") expr = "parseInt(" + expr + ")";
    else if (type === "float") expr = "parseFloat(" + expr + ")";
    // string bleibt wie es ist
  }

  // nur Einlesen vs Deklaration+Einlesen
  if (declMode === "declareAndRead") {
    snippet = "var " + v + ";\n" + v + " = " + expr + ";";
  } else {
    snippet = v + " = " + expr + ";";
  }

  break;
}



    case "ausgabe": {
      const expr = (document.getElementById("outExpr")?.value || '"Hallo Welt"').trim();
      const outType = document.querySelector('input[name="outType"]:checked')?.value || "console";

      snippet = (outType === "alert")
        ? "alert(" + expr + ");"
        : "console.log(" + expr + ");";
      break;
    }

    case "ausgabe_zeilenweise": {
      const expr = (document.getElementById("outLineText")?.value || '"Hallo!"').trim() || '"Hallo!"';
      snippet = 'console.log(' + expr + ' + "\\n");';
      break;
    }
  }

  preview.textContent = snippet;
}

applyBtn.addEventListener("click", () => {
  const preview = document.getElementById("preview");
  const snippet = preview ? preview.textContent : "";
  if (!snippet) return;

  codeOutput.value += snippet + "\n";
});

clearBtn.addEventListener("click", () => {
  codeOutput.value = "";
});
