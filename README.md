# OnRamps Python Midterm Review

A standalone, unofficial practice website covering EM_01 through EM_16 from the supplied review blueprint. The older outcome list informed question variations but is not separately assessed. No school branding or external dependencies.

## Deploy on GitHub Pages

1. Create a GitHub repository (public if using GitHub Free).
2. Upload `index.html`, `style.css`, `bank.js`, and `app.js` from this folder to the root of the repository. Commit the files.
3. In repository Settings > Pages, select Deploy from a branch, then choose `main` and `/ (root)`. Save.
4. Open the Pages URL shown by GitHub once deployment finishes.

## Practice modes

- Complete: all 49 templates (three per outcome, four for EM_09).
- Mixed: 33 questions (two per outcome, three for EM_09).
- Quick: 16 questions (one per outcome).

Questions and options are shuffled and numeric/text values vary when available. Students see the outcome only after checking an answer. Incorrect answers receive a question-specific hint without revealing the solution. Students can revise and retry indefinitely, or choose Show answer after two incorrect submissions. The same question and retry history are saved locally. Responses are scored per question, with all-or-nothing grading for multi-select and dropdown questions. First-attempt accuracy is used for scores and missed-topic tracking, while eventual success is reported separately. Results include topic breakdown and review of first and final responses; retrying missed topics generates new variants for those outcomes. Retrying the entire review restores all 16 outcomes in the same mode. Scores are practice scores, not official midterm scores. Progress is stored locally in the browser; no personal information is collected or uploaded. A new review replaces the current saved one.

The question formats are multiple choice, multi-select, typed value/output, and dropdown-based code completion/ordering. Code construction is scaffolded through dropdowns and selection rather than executing student-written code. No live Python interpreter is necessary.

## Editing

`bank.js` contains each outcome and its question generators; `app.js` manages navigation, grading, storage, and results; `style.css` controls presentation. Use a modern browser. The site also works when opening index.html locally.

## Student submission report

At the end of a review, students enter their name and click **Print / Save as PDF**, then select Save as PDF in their browser's print dialog (or a printer for a paper copy). The print layout includes the student name, completion date, mode, review scope, first-attempt accuracy, eventual success, and a per-outcome breakdown. It excludes the questions, solutions, and navigation buttons. Names are stored locally in the browser (not uploaded). Students should save the report before starting another review, which replaces the current results. Existing v2 progress remains compatible.
