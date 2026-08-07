# SwingComp
SwingComp is a web application that generates randomized jazz swing coordination exercises for drum set practice. Users can customize exercise length, rhythmic difficulty, note density, instrument voices, and ride cymbal accompaniment to create unlimited practice material tailored to their skill level.
### Live Site
jctimpani.github.io/SwingComp
## What it does

### Exercise Generation

- Random jazz swing coordination exercises.
- Optional swing ride cymbal ostinato.
- Independent Snare, Bass Drum, and Hi-Hat voices.
- Generate from **1–64 measures**.
- Standard percussion notation rendered with VexFlow.

### Difficulty

Controls **where notes may appear**.

| Level | Allowed Rhythms |
|-------|------------------|
| 1 | Downbeats only |
| 2 | Downbeats + third triplet partial |
| 3 | Full triplet grid |

### Density

Controls **how many notes are generated**.

| Density | Approximate Fill |
|---------|------------------|
| 1 | 25–45% of available positions |
| 2 | 45–70% |
| 3 | 70–100% |

### Intelligent Randomization

SwingComp generates exercises using several musical constraints:

- Prevents more than **3 consecutive snare** notes.
- Prevents more than **2 consecutive bass drum** notes.
- Prevents **consecutive hi-hat** notes.
- Randomizes note placement while respecting the selected Difficulty and Density.
- Generates unique exercises every time.

### Interface

- Collapsible settings panel.
- Measure numbers every four bars.
- Responsive staff layout.
- SVG notation rendering.
