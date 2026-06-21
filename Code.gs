const APP_CONFIG = {
  SHEET_NAME: 'Prompts',
  HEADERS: ['Style', 'Prompt'],
};

function doGet() {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Prompt Style Library')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPrompts() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  return values
    .map((row, index) => ({
      row: index + 2,
      style: String(row[0] || '').trim(),
      prompt: String(row[1] || '').trim(),
    }))
    .filter(item => item.style || item.prompt);
}

function addPrompt(payload) {
  const sheet = getSheet_();
  const prompt = normalizeText_(payload && payload.prompt);

  if (!prompt) {
    throw new Error('Prompt is required.');
  }

  const style = normalizeText_(payload && payload.style) || getNextStyleLabel_(sheet);
  sheet.appendRow([style, prompt]);

  return { ok: true };
}

function updatePrompt(payload) {
  const sheet = getSheet_();
  const row = Number(payload && payload.row);
  const prompt = normalizeText_(payload && payload.prompt);
  const style = normalizeText_(payload && payload.style);

  validateEditableRow_(sheet, row);

  if (!prompt) {
    throw new Error('Prompt is required.');
  }

  sheet.getRange(row, 1, 1, 2).setValues([[style || getFallbackStyleForRow_(row), prompt]]);
  return { ok: true };
}

function deletePrompt(row) {
  const sheet = getSheet_();
  const targetRow = Number(row);

  validateEditableRow_(sheet, targetRow);
  sheet.deleteRow(targetRow);

  return { ok: true };
}

function getSheet_() {
  const spreadsheetId = getRequiredProperty_('SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(APP_CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(APP_CONFIG.SHEET_NAME);
  }

  ensureHeaders_(sheet);
  sheet.setFrozenRows(1);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, APP_CONFIG.HEADERS.length).setValues([APP_CONFIG.HEADERS]);
    return;
  }

  const headerValues = sheet.getRange(1, 1, 1, APP_CONFIG.HEADERS.length).getValues()[0];
  if (!headerValues[0] || !headerValues[1]) {
    sheet.getRange(1, 1, 1, APP_CONFIG.HEADERS.length).setValues([APP_CONFIG.HEADERS]);
  }
}

function getNextStyleLabel_(sheet) {
  const dataRows = Math.max(sheet.getLastRow() - 1, 0);
  return numberToLetters_(dataRows + 1);
}

function getFallbackStyleForRow_(row) {
  return numberToLetters_(Math.max(row - 1, 1));
}

function numberToLetters_(number) {
  let result = '';
  let current = number;

  while (current > 0) {
    current -= 1;
    result = String.fromCharCode(65 + (current % 26)) + result;
    current = Math.floor(current / 26);
  }

  return result || 'A';
}

function validateEditableRow_(sheet, row) {
  if (!Number.isInteger(row) || row < 2 || row > sheet.getLastRow()) {
    throw new Error('Target row was not found.');
  }
}

function normalizeText_(value) {
  return String(value || '').trim();
}

function getRequiredProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);

  if (!value) {
    throw new Error('Missing script property: ' + key);
  }

  return value;
}
