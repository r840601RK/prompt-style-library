# Prompt Style Library

Google Apps Script web app for collecting image-generation prompts by style.

## Data Source

The app uses a Google Sheet as the database:

- Column A: Style
- Column B: Prompt
- Sheet name: `Prompts`

Keep spreadsheet IDs, deployment URLs, API keys, and webhook URLs out of this repository. Configure project-specific values in your private Apps Script project or another secure runtime configuration.

## Files

- `Code.gs`: Apps Script backend.
- `Index.html`: Apps Script web app frontend.
- `index.html`: GitHub Pages entrypoint.
- `appsscript.json`: Apps Script manifest.

## Features

- Add prompts.
- Auto-generate style labels as `A`, `B`, `C` when the style field is empty.
- List prompts from Google Sheets.
- Search by style or prompt.
- Copy prompt with one click.
- Edit prompts.
- Delete prompts.

## Deploy

1. Open the Apps Script project.
2. Paste `Code.gs` and `Index.html`.
3. Configure the private spreadsheet ID in Apps Script before deployment.
4. Deploy as a Web App.
5. After code changes, create a new deployment version.
