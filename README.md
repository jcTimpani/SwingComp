# Swing Comp Drumset Generator

Swing Comp is a web app that generates random jazz swing coordination material for drumset practice.
It renders readable notation in the browser using VexFlow and lets you quickly vary density, orchestration, and form length.

Live site: "https://jctimpani.github.io/SwingComp/"

## What It Does

- Generates one-measure swing ride ostinato patterns combined with random snare/bass comping notes.
- Supports three difficulty levels for where notes are allowed in the triplet grid.
- Lets you choose `Snare`, `Bass`, or `Both` voices.
- Generates multiple measures at once with selectable measure counts.

## Controls

- `Number of Measures`: `1, 2, 4, 8, 12, 16, 24, 32, 48, 64`
- `Select Difficulty`:
  - `Level 1`: Downbeats only
  - `Level 2`: Downbeats + 3rd triplet partial
  - `Level 3`: All triplet partials
- `Choose a voice`:
  - `Snare Only`
  - `Bass Only`
  - `Both`

## UI Notes

- The music output area is hidden until `Generate Music` is clicked.
- Settings can be collapsed/expanded with `Hide Settings` and `Show Settings`.

## Project Structure

- `docs/index.html`: Main UI markup
- `docs/assets/css/styles.css`: App styling
- `docs/assets/css/navBar.css`: Navbar styling
- `docs/assets/js/test.js`: Music generation and rendering logic

## Tech Stack

- HTML
- CSS
- JavaScript
- [VexFlow](https://www.vexflow.com/)
