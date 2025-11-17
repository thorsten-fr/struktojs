const select = document.getElementById("operatorSelect");
const operatorForm = document.getElementById("operatorForm");
const applyBtn = document.getElementById("applyBtn");
const codeOutput = document.getElementById("codeOutput");

select.addEventListener("change", () => {
  const op = select.value;
  operatorForm.innerHTML = "";
  applyBtn.disabled = !op;

  if (!op) return;

  switch (op) {
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

    case "ausgabe_konsole":
      operatorForm.innerHTML = `
        <label>
          Ausgabetext:
          <input id="outText" type="text" placeholder="Geben Sie eine Zahl ein">
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
    case "declaration": {
      const name = (document.getElementById("varName")?.value || "variable").trim() || "variable";
      snippet = "var " + name + ";";
      break;
    }

    case "ausgabe_konsole": {
      const text = document.getElementById("outText")?.value || "Hallo Welt";
      snippet = "console.log(\"" + text.replace(/\"/g, '\\"') + "\");";
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
