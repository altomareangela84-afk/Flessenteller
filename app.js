"use strict";

const $ = (id) => document.getElementById(id);
const KEY = "stockteller-data-v1";

let data = { products: [], history: [] };

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  data.products = Array.isArray(saved.products) ? saved.products : [];
  data.history = Array.isArray(saved.history) ? saved.history : [];
} catch (e) {
  console.warn("Opgeslagen gegevens konden niet worden gelezen.");
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    const status = $("storageStatus");
    if (status) status.textContent = "Gegevens bewaard op dit toestel.";
  } catch (e) {
    alert("Opslaan is niet gelukt. Exporteer eerst een back-up.");
  }
}

function element(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}

function render() {
  const list = $("productList");
  const manage = $("manageProducts");
  list.replaceChildren();
  manage.replaceChildren();

  const query = ($("search").value || "").toLowerCase();
  let total = 0;

  data.products.forEach((p, index) => {
    total += p.count || 0;
    if (!p.name.toLowerCase().includes(query)) return;

    const row = element("div", undefined, "product-card");
    const info = element("div");
    info.append(
      element("strong", p.name),
      element("div", p.size || "Inhoud niet opgegeven"),
      element("div", `${p.count || 0} flessen`)
    );

    const minus = element("button", "−");
    minus.type = "button";
    minus.addEventListener("click", () => {
      p.count = Math.max(0, (p.count || 0) - 1);
      save();
      render();
    });

    const plus = element("button", "+");
    plus.type = "button";
    plus.addEventListener("click", () => {
      p.count = (p.count || 0) + 1;
      save();
      render();
    });

    const controls = element("div", undefined, "product-controls");
    controls.append(minus, plus);
    row.append(info, controls);
    list.append(row);

    const manageRow = element("div", undefined, "product-card");
    const name = element("span", `${p.name} (${p.size})`);
    const remove = element("button", "Verwijderen");
    remove.type = "button";
    remove.addEventListener("click", () => {
      if (confirm(`Product ${p.name} verwijderen?`)) {
        data.products.splice(index, 1);
        save();
        render();
      }
    });
    manageRow.append(name, remove);
    manage.append(manageRow);
  });

  $("totalBottles").textContent = total;
  $("productCount").textContent = data.products.length;
  $("manageCount").textContent = `(${data.products.length})`;
  $("emptyProducts").classList.toggle("hidden", data.products.length > 0);

  const history = $("historyList");
  history.replaceChildren();
  data.history.forEach((entry) => {
    const row = element(
      "p",
      `${entry.name} — ${entry.total} flessen — ${entry.date}`
    );
    history.append(row);
  });
  $("emptyHistory").classList.toggle("hidden", data.history.length > 0);
}

$("productForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("productName").value.trim();
  const size = $("productSize").value;

  if (!name) {
    alert("Vul eerst een productnaam in.");
    $("productName").focus();
    return;
  }

  if (data.products.some(
    (p) => p.name.toLowerCase() === name.toLowerCase()
      && p.size === size
  )) {
    alert("Dit product met deze inhoud bestaat al.");
    return;
  }

  data.products.push({
    id: Date.now().toString(),
    name,
    size,
    count: 0
  });

  save();
  $("productName").value = "";
  render();
  alert("Product toegevoegd!");
});

$("search").addEventListener("input", render);

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    document.querySelectorAll("[data-tab]").forEach((b) => {
      b.classList.toggle("active", b === button);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== `tab-${tab}`);
    });

    document.querySelectorAll("main > .panel").forEach((panel) => {
      if (panel.id !== "tab-producten"
          && panel.id !== "tab-historiek"
          && panel.id !== "tab-instellingen") {
        panel.classList.toggle("hidden", tab !== "tellen");
      }
    });
  });
});

$("saveStock").addEventListener("click", () => {
  if (!data.products.length) {
    alert("Voeg eerst producten toe.");
    return;
  }

  const total = data.products.reduce((sum, p) => sum + p.count, 0);
  data.history.unshift({
    name: $("stockName").value.trim() || "Stockopname",
    total,
    date: new Date().toLocaleString("nl-BE"),
    products: data.products.map((p) => ({ ...p }))
  });

  save();
  render();
  alert("Stockopname bewaard!");
});

$("resetCounts").addEventListener("click", () => {
  if (!confirm("Alle aantallen op nul zetten?")) return;
  data.products.forEach((p) => p.count = 0);
  save();
  render();
});

$("deleteAll").addEventListener("click", () => {
  if (!confirm("Alle producten en stockopnames wissen?")) return;
  data = { products: [], history: [] };
  save();
  render();
});

$("backupJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flessenteller-backup.json";
  a.click();
  URL.revokeObjectURL(url);
});

$("restoreJson").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const restored = JSON.parse(await file.text());
    if (!Array.isArray(restored.products)
        || !Array.isArray(restored.history)) {
      throw new Error("Ongeldig back-upbestand");
    }
    if (!confirm("Je huidige gegevens vervangen door de back-up?")) return;
    data = restored;
    save();
    render();
    alert("Back-up teruggezet.");
  } catch (e) {
    alert("Deze back-up kan niet worden gelezen.");
  } finally {
    event.target.value = "";
  }
});

$("exportCurrent").addEventListener("click", () => {
  const rows = [["Product", "Inhoud", "Aantal"], ...data.products.map(
    (p) => [p.name, p.size, p.count]
  )];
  const csv = rows.map((r) =>
    r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")
  ).join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flessenteller.csv";
  a.click();
  URL.revokeObjectURL(url);
});

$("exportAll").addEventListener("click", () => {
  const rows = [["Stockopname", "Datum", "Totaal flessen"],
    ...data.history.map((h) => [h.name, h.date, h.total])];
  const csv = rows.map((r) =>
    r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")
  ).join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stockopnames.csv";
  a.click();
  URL.revokeObjectURL(url);
});

render();
