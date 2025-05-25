const moduleBase = "/data/adb/modules/zapret";
const dataBase = "/data/adb/zapret";

const paths = {
  dpiList: `${dataBase}/DPI_list.txt`,
  dpiIgnore: `${dataBase}/DPI_ignore.txt`
};

const actionScriptPath = `${moduleBase}/action.sh`;
const autostartPath = `${moduleBase}/autostart`;

let currentMode = "dpiList";
let statusTimeoutId = null;

async function exec(command) {
  return new Promise((resolve, reject) => {
    const callbackName = `exec_callback_${Date.now()}`;
    window[callbackName] = (errno, stdout, stderr) => {
      delete window[callbackName];
      if (errno === 0) {
        resolve(stdout);
      } else {
        console.error(`Error executing command: ${stderr}`);
        reject(stderr);
      }
    };
    try {
      ksu.exec(command, "{}", callbackName);
    } catch (error) {
      console.error(`Execution error: ${error}`);
      reject(error);
    }
  });
}

function showStatus(message, color = "#8d9ecc") {
  const status = document.getElementById("status");
  status.textContent = message;
  status.style.color = color;

  if (statusTimeoutId) {
    clearTimeout(statusTimeoutId);
  }

  statusTimeoutId = setTimeout(() => {
    status.textContent = "";
    statusTimeoutId = null;
  }, 3000);
}

async function readFile(path) {
  try {
    const res = await exec(`cat "${path}"`);
    let text = res.result || res;
    if (typeof text === "string") {
      text = text.replace(/\\n/g, "\n");
    }
    return text;
  } catch (e) {
    return `Исключение при чтении файла ${path}:\n${e.message || e}`;
  }
}

async function writeFile(content, path) {
  const cmd = `
cat <<'EOF' > "${path}"
${content}
EOF
`;
  try {
    await exec(cmd);
  } catch (e) {
    throw new Error(`Ошибка записи в файл ${path}:\n${e}`);
  }
}

async function loadCurrentFile() {
  const editor = document.getElementById("editor");
  editor.value = await readFile(paths[currentMode]);
}

async function saveCurrentFile() {
  const editor = document.getElementById("editor");
  try {
    await writeFile(editor.value, paths[currentMode]);
    showStatus("Файл успешно сохранён");
  } catch (e) {
    showStatus(`Ошибка при сохранении: ${e.message || e}`, "red");
  }
}

async function updateServiceStatus() {
  const el = document.getElementById("serviceStatus");
  try {
    const result = await exec("pgrep nfqws > /dev/null 2>&1 && echo running || echo stopped");
    if ((result.result || result).toString().trim() === "running") {
      el.textContent = "Статус сервиса: активен";
      el.style.color = "#4caf50";
    } else {
      el.textContent = "Статус сервиса: остановлен";
      el.style.color = "#f44336";
    }
  } catch {
    el.textContent = "Статус сервиса: неизвестен";
    el.style.color = "#ff9800";
  }
}

async function toggleService() {
  try {
    await exec(`su -c 'sh "${actionScriptPath}"'`);
    showStatus("Сервис переключён");
    setTimeout(updateServiceStatus, 100);
  } catch (e) {
    showStatus(`Ошибка при выполнении action.sh: ${e}`, "red");
  }
}

async function loadAutostartFlag() {
  try {
    const result = await exec(`[ -f "${autostartPath}" ] && echo exists || echo missing`);
    document.getElementById("autostartToggle").checked = (result.result || result).toString().includes("exists");
  } catch {
    document.getElementById("autostartToggle").checked = false;
  }
}

async function toggleAutostart(checked) {
  try {
    if (checked) {
      await exec(`touch "${autostartPath}"`);
    } else {
      await exec(`rm -f "${autostartPath}"`);
    }
    showStatus("Флаг автозапуска обновлён.");
  } catch (e) {
    showStatus(`Ошибка автозапуска: ${e}`, "red");
  }
}

async function init() {
  document.getElementById("saveBtn").onclick = saveCurrentFile;
  document.getElementById("toggleServiceBtn").onclick = toggleService;
  document.getElementById("autostartToggle").addEventListener("change", e => {
    toggleAutostart(e.target.checked);
  });

  document.querySelectorAll("input[name='mode']").forEach(el => {
    el.addEventListener("change", async () => {
      if (el.checked) {
        currentMode = el.value;
        await loadCurrentFile();
      }
    });
  });

  const buttons = document.querySelectorAll('#saveBtn, #toggleServiceBtn');

  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.backgroundColor = 'var(--accent-hover)';
    });

    btn.addEventListener('mouseup', () => {
      setTimeout(() => {
        btn.style.backgroundColor = 'var(--accent-color)';
      }, 150);
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = 'var(--accent-color)';
    });
  });

  await loadCurrentFile();
  await loadAutostartFlag();
  await updateServiceStatus();
  setInterval(updateServiceStatus, 5000);
}

init();