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
    // Deklaration
    case "declaration":
      operatorForm.innerHTML = `
        <label>
          Variablenname:
          <input id="varName" type="text" placeholder="alter">
        </label>
        <label>
          Typ:
          <select id="varType">
            <option value="number">Ganze Zahl</option>
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
          Wert:
          <input id="initValue" type="text" placeholder="10">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Deklaration und Initialisierung: var variable = wert
    case "deklaration_init":
      operatorForm.innerHTML = `
        <label>
          Variablenname:
          <input id="declInitVar" type="text" placeholder="anzahl">
        </label>
        <label>
          Wert:
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

    // Deklaration und Einlesen (Dialogfenster)
    case "einlesen_dialog_decl":
      operatorForm.innerHTML = `
        <label>
          Variablenname:
          <input id="readDeclVar" type="text" placeholder="betrag">
        </label>
        <label>
          Typ:
          <select id="readDeclType">
            <option value="number">Ganze Zahl</option>
            <option value="float">Dezimalzahl</option>
            <option value="string">Text</option>
          </select>
        </label>
        <label>
          Hinweistext:
          <input id="readDeclPrompt" type="text" placeholder="Bitte geben Sie den Betrag ein">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Einlesen: variable |als datentyp|  (Dialogfenster)
    case "einlesen_dialog":
      operatorForm.innerHTML = `
        <label>
          Variable:
          <input id="readVar" type="text" placeholder="betrag">
        </label>
        <label>
          Typ:
          <select id="readType">
            <option value="number">Ganze Zahl</option>
            <option value="float">Dezimalzahl</option>
            <option value="string">Text</option>
          </select>
        </label>
        <label>
          Hinweistext:
          <input id="readPrompt" type="text" placeholder="Bitte geben Sie den Betrag ein">
        </label>
        <pre id="preview"></pre>
      `;
      break;

    // Ausgabe (Konsole oder Meldungsfenster)
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

    // Zeilenweise Ausgabe: inhalt  (Konsole mit Zeilenumbruch)
    case "ausgabe_zeilenweise":
      operatorForm.innerHTML = `
        <label>
          Inhalt (JS-Ausdruck, zeilenweise):
          <input id="outLineText" type="text"
                 placeholder='"Hallo!"'>
        </label>
        <pre id="preview"></pre>
      `;
      break;

    default:
      operatorForm.innerHTML = `<em>Für diese Anweisung ist noch kein Formular definiert.</em>`;
  }

  updatePreview();
  operatorForm.addEventListener("input", updatePreview);
});

function updatePreview() {
  const op = select.value;
  const preview = document.getElementById("preview");
  if (!preview) return;

  let snippet = "";

  switch (op) {
    // Deklaration
    case "declaration": {
      const name =
        (document.getElementById("varName")?.value || "variable").trim() ||
        "variable";
      snippet = "var " + name + ";";
      break;
    }

    // Initialisierung
    case "initialisierung": {
      const v =
        (document.getElementById("initVar")?.value || "variable").trim() ||
        "variable";
      const val =
        (document.getElementById("initValue")?.value || "0").trim() || "0";
      snippet = v + " = " + val + ";";
      break;
    }

    // Deklaration + Initialisierung
    case "deklaration_init": {
      const v =
        (document.getElementById("declInitVar")?.value || "variable").trim() ||
        "variable";
      const val =
        (document.getElementById("declInitValue")?.value || "0").trim() || "0";
      snippet = "var " + v + " = " + val + ";";
      break;
    }

    // Zuweisung
    case "zuweisung": {
      const v =
        (document.getElementById("assignVar")?.value || "variable").trim() ||
        "variable";
      const val =
        (document.getElementById("assignValue")?.value || "wert").trim() ||
        "wert";
      snippet = v + " = " + val + ";";
      break;
    }

    // Einlesen (nur lesen)
    case "einlesen_dialog": {
      const v =
        (document.getElementById("readVar")?.value || "betrag").trim() ||
        "betrag";
      const type = document.getElementById("readType")?.value || "float";
      const promptText =
        document.getElementById("readPrompt")?.value ||
        "Bitte geben Sie einen Wert ein";

      let readExpr =
        'prompt("' + promptText.replace(/"/g, '\\"') + '")';

      if (type === "number") {
        readExpr = "parseInt(" + readExpr + ")";     // <- ohne , 10
      } else if (type === "float") {
        readExpr = "parseFloat(" + readExpr + ")";
      }
      snippet = v + " = " + readExpr + ";";
      break;
    }

    // Deklaration und Einlesen
    case "einlesen_dialog_decl": {
      const v =
        (document.getElementById("readDeclVar")?.value || "variable").trim() ||
        "variable";
      const type = document.getElementById("readDeclType")?.value || "float";
      const promptText =
        document.getElementById("readDeclPrompt")?.value ||
        "Bitte geben Sie einen Wert ein";

      let readExpr =
        'prompt("' + promptText.replace(/"/g, '\\"') + '")';

      if (type === "number") {
        readExpr = "parseInt(" + readExpr + ")";     // <- ohne , 10
      } else if (type === "float") {
        readExpr = "parseFloat(" + readExpr + ")";
      }

      snippet = "var " + v + ";\n" + v + " = " + readExpr + ";";
      break;
    }

    // Ausgabe (Konsole oder Meldungsfenster)
    case "ausgabe": {
      const expr =
        (document.getElementById("outExpr")?.value || '"Hallo Welt"').trim();

      const outType =
        document.querySelector('input[name="outType"]:checked')?.value;

      if (outType === "alert") {
        snippet = "alert(" + expr + ");";
      } else {
        snippet = "console.log(" + expr + ");";
      }
      break;
    }

    // Zeilenweise Ausgabe (Konsole + Zeilenumbruch)
    case "ausgabe_zeilenweise": {
      const expr =
        (document.getElementById("outLineText")?.value || '"Hallo!"').trim() ||
        '"Hallo!"';
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
