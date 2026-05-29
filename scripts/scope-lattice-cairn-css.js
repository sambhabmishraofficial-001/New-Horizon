const fs = require("fs");

let css = fs.readFileSync("C:/Users/mishr/cairn/assets/styles.css", "utf8");

css = css.replace(/:root/g, ".lattice-cairn");
css = css.replace(/html, body/g, ".lattice-cairn");
css = css.replace(/^body /gm, ".lattice-cairn ");

css = css
  .split("\n")
  .map((line) => {
    const trimmed = line.trim();
    if (!trimmed.includes("{")) return line;
    if (trimmed.startsWith("@")) return line;

    const idx = line.indexOf("{");
    const sel = line.slice(0, idx).trim();
    const rest = line.slice(idx);
    if (!sel || sel.startsWith("@")) return line;
    if (sel.startsWith(".lattice-cairn")) return line;

    const prefixed = sel
      .split(",")
      .map((part) => {
        const s = part.trim();
        if (s.startsWith(".lattice-cairn")) return s;
        return `.lattice-cairn ${s}`;
      })
      .join(", ");

    return `${prefixed} ${rest}`;
  })
  .join("\n");

css += `
.lattice-cairn .nav button {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--r-2);
  color: var(--tx-2);
  font-size: 14px;
}
.lattice-cairn .nav button:hover { color: var(--tx-0); background: var(--bg-2); }
.lattice-cairn .nav button.active { color: var(--tx-0); }
.lattice-cairn .breadcrumb button {
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--tx-2);
  cursor: pointer;
}
.lattice-cairn .breadcrumb button:hover { color: var(--ac); }
.lattice-cairn-cmdk {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
}
.lattice-cairn-cmdk-panel {
  width: 560px;
  max-width: 90vw;
  background: var(--bg-1);
  border: 1px solid var(--bd-2);
  border-radius: 12px;
  box-shadow: var(--shadow-2);
  overflow: hidden;
}
.lattice-cairn-cmdk-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 18px 20px;
  color: var(--tx-0);
  font-size: 15px;
  outline: none;
  border-bottom: 1px solid var(--bd-1);
}
.lattice-cairn-cmdk-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--tx-1);
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
}
.lattice-cairn-cmdk-item:hover,
.lattice-cairn-cmdk-item[data-active="true"] {
  background: var(--bg-3);
  color: var(--tx-0);
}
.lattice-cairn-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  background: var(--ac-3);
  border: 1px solid var(--ac-2);
  color: var(--ac);
  padding: 10px 16px;
  border-radius: 8px;
  font-family: var(--f-mono);
  font-size: 12px;
}
.lattice-cairn--embedded .app-shell {
  height: 100%;
  min-height: 520px;
}
.lattice-cairn--embedded {
  min-height: 100%;
  height: 100%;
}
`;

fs.writeFileSync("c:/Users/mishr/Downloads/VRIU/app/lattice/lattice-cairn.css", css);
