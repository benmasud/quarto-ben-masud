# Rofikul Masud — personal website

A Quarto website with a shared theme and an academic profile layout.

## Preview and build

Install Quarto, then run these commands from the project root:

```sh
quarto preview
```

To build the complete site for deployment:

```sh
quarto render
```

The rendered website is written to `_site/`. Publish the contents of that directory. This repository already tracks its rendered output; rebuild it whenever you change the sources. Do not edit generated HTML directly.

## Source layout

| Path | Purpose |
| --- | --- |
| `_quarto.yml` | Navigation, explicit page list, shared settings, downloadable resources |
| `index.qmd` | Profile and biography, using Quarto's Trestles layout |
| `cv/index.qmd` | Web CV and PDF download |
| `publications/index.qmd` | Publications overview, preserving existing links |
| `publications/my-papers/index.qmd` | Research and conference publications |
| `publications/seminar-papers/index.qmd` | Seminar papers (currently under construction) |
| `publications/patents/index.qmd` | Registered software and certificates |
| `articles/index.qmd` | Selected reading by other authors |
| `books/index.qmd` | Current book reading list |
| `journal/` | Personal Journal: Hikings, Travels, and Opinions; edit each section's `index.qmd` to add content |
| `ARTS/index.qmd` | Arts interests (existing URL preserved) |
| `assets/styles.scss` | Shared typography, colors, and responsive styling |
| `assets/fonts.css` | Font declarations with paths relative to the stylesheet |
| `assets/fonts/` | Locally hosted fonts |
| `images/`, `book-covers/` | Original photographs and book artwork |
| `files/` | CV and supporting documents; only named public files are copied |
| `_archive/` | Former Blog section and retired design files, excluded from the site |

## Editing

Keep page content in its `.qmd` file and shared presentation in `assets/styles.scss`. New pages must also be added to `project.render` in `_quarto.yml`.

The Blog section has been removed from navigation and rendering. Its original source and images are preserved in `_archive/writing/`. The leading underscore and explicit render list keep the archive out of the published site and search index. Archived files may retain their original paths; restore or update those paths before republishing any essay.

The CV download uses the supplied `cv/Resume_Rofikul_Masud_General_Oct2026.pdf`. Update this document and `cv/index.qmd` together when the resume changes. The older generated PDF and `scripts/build_cv.py` are retained locally but are not used for the published download. The previous PDF is preserved in `_archive/documents/`. Recommendation letters remain in `files/` but are not published automatically.
