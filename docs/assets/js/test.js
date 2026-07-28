window.onload = function () {
  const VF = Vex.Flow;
  const settingsPanel = document.getElementById("settings-panel");
  const toggleControlsBtn = document.getElementById("toggle-controls-btn");
  const densitySlider = document.getElementById("density-slider");

  toggleControlsBtn.addEventListener("click", function () {
    const isCollapsed = settingsPanel.classList.toggle("controls-collapsed");
    toggleControlsBtn.textContent = isCollapsed
      ? "Show Settings"
      : "Hide Settings";
    toggleControlsBtn.setAttribute("aria-expanded", (!isCollapsed).toString());
  });

  // Function to convert the combined array into sheet music
  function generateSheetMusic(numMeasures) {
    const div = document.getElementById("output");
    div.classList.remove("is-hidden");
    div.innerHTML = "";

    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Determine the stave width and layout based on the number of measures.
    const measuresPerLine = numMeasures >= 4 ? 4 : numMeasures === 1 ? 1 : 2;
    const staveWidth =
      measuresPerLine === 1 ? 1200 : measuresPerLine === 2 ? 560 : 300;
    const heightPerLine = 150;
    const numLines = Math.ceil(numMeasures / measuresPerLine);
    const rendererWidth = staveWidth * measuresPerLine + 20;
    renderer.resize(rendererWidth, numLines * heightPerLine);

    const context = renderer.getContext();

    const useSnare = document.getElementById("snare-checkbox").checked;
    const useBass = document.getElementById("bass-checkbox").checked;
    const useHiHat = document.getElementById("hihat-checkbox").checked;
    const includeRide = document.getElementById("ride-ostinato").checked;
    const selectedDensity = parseInt(densitySlider.value, 10);
    let lastNote = "";
    let snareRepetitionCount = 0;
    let bassRepetitionCount = 0;
    let hiHatRepetitionCount = 0;

    function shuffleArray(values) {
      const shuffledValues = [...values];

      for (let i = shuffledValues.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [shuffledValues[i], shuffledValues[swapIndex]] = [
          shuffledValues[swapIndex],
          shuffledValues[i],
        ];
      }

      return shuffledValues;
    }

    function getDensityRange(densityLevel, maxNotes) {
      const densityRanges = {
        1: [0.1, 0.4],
        2: [0.2, 0.6],
        3: [0.4, 0.9],
      };

      const [minRatio, maxRatio] =
        densityRanges[densityLevel] || densityRanges[2];
      const minNotes = Math.max(1, Math.round(maxNotes * minRatio));
      const maxNotesInRange = Math.max(
        minNotes,
        Math.round(maxNotes * maxRatio),
      );

      return {
        minNotes,
        maxNotes: Math.min(maxNotes, maxNotesInRange),
      };
    }

    function getRandomInteger(minValue, maxValue) {
      if (maxValue <= minValue) {
        return minValue;
      }

      return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }

    function getSelectedNotePositions(allowedPositions, densityLevel) {
      const shuffledPositions = shuffleArray(allowedPositions);
      const { minNotes, maxNotes } = getDensityRange(
        densityLevel,
        allowedPositions.length,
      );
      const noteCount = getRandomInteger(minNotes, maxNotes);

      return new Set(shuffledPositions.slice(0, noteCount));
    }

    // Function to generate a new random ostinato array based on the selected voice
    // Function to generate a new random ostinato array based on the selected voice and difficulty
    function generateOstinato() {
      const ostinatoArray = includeRide
        ? useHiHat
          ? ["r", "x", "x", "r", "x", "r", "r", "x", "x", "r", "x", "r"]
          : ["r", "x", "x", "rh", "x", "r", "r", "x", "x", "rh", "x", "r"]
        : Array(12).fill("x");
      const randomArray = Array(12).fill("x");
      const selectedDifficulty = document.getElementById("difficulty").value;

      // Adjust the valid positions for notes based on difficulty level
      let allowedPositions = [];

      if (selectedDifficulty === "1") {
        // Level 1: Only downbeats (1, 2, 3, 4)
        allowedPositions = [0, 3, 6, 9]; // First note of each beat
      } else if (selectedDifficulty === "2") {
        // Level 2: Downbeats and the third partial of triplets
        allowedPositions = [0, 2, 3, 5, 6, 8, 9, 11]; // First and third note of each beat
      } else if (selectedDifficulty === "3") {
        // Level 3: All positions (what we currently have)
        allowedPositions = Array.from({ length: 12 }, (_, i) => i); // All positions (0-11)
      }

      const selectedNotePositions = getSelectedNotePositions(
        allowedPositions,
        selectedDensity,
      );

      // Fill only the density-selected positions within the allowed difficulty grid.
      for (let i = 0; i < randomArray.length; i++) {
        if (selectedNotePositions.has(i)) {
          let newNote;
          let availableVoices = [];

          if (useSnare) availableVoices.push("s");
          if (useBass) availableVoices.push("b");
          if (useHiHat) availableVoices.push("h");

          // If neither checkbox is checked, don't generate a note.
          if (availableVoices.length === 0) {
            newNote = "x";
          } else {
            let choices = [...availableVoices];

            if (snareRepetitionCount >= 3) {
              choices = choices.filter((v) => v !== "s");
            }

            if (bassRepetitionCount >= 2) {
              choices = choices.filter((v) => v !== "b");
            }

            // Never allow two hi-hats in a row
            if (hiHatRepetitionCount >= 1) {
              choices = choices.filter((v) => v !== "h");
            }

            newNote =
              choices.length > 0
                ? choices[Math.floor(Math.random() * choices.length)]
                : "x";
          }

          // Update repetition counts and set the note
          if (newNote === "s") {
            snareRepetitionCount++;
            bassRepetitionCount = 0;
            hiHatRepetitionCount = 0;
          } else if (newNote === "b") {
            bassRepetitionCount++;
            snareRepetitionCount = 0;
            hiHatRepetitionCount = 0;
          } else if (newNote === "h") {
            hiHatRepetitionCount++;
            snareRepetitionCount = 0;
            bassRepetitionCount = 0;
          } else {
            snareRepetitionCount = 0;
            bassRepetitionCount = 0;
            hiHatRepetitionCount = 0;
          }

          randomArray[i] = newNote;
          lastNote = newNote;
        } else {
          randomArray[i] = "x"; // Rest for all non-allowed positions
          snareRepetitionCount = 0; // Reset repetition count on rest
          bassRepetitionCount = 0;
          hiHatRepetitionCount = 0;
        }
      }

      // Combine the ostinato with the random snare/bass notes
      const combinedArray = [];
      for (let i = 0; i < ostinatoArray.length; i++) {
        let cymbal = ostinatoArray[i];
        let drum = randomArray[i];

        combinedArray[i] = Array.from(
          new Set((cymbal + drum).split("").filter((c) => c !== "x")),
        ).join("");
      }

      return combinedArray;
    }

    for (let measure = 0; measure < numMeasures; measure++) {
      const lineIndex = Math.floor(measure / measuresPerLine); // Track which line (row) the stave is on
      const xOffset = (measure % measuresPerLine) * staveWidth;

      // Create a stave for each measure
      const stave = new VF.Stave(
        10 + xOffset,
        40 + lineIndex * heightPerLine,
        staveWidth,
      );
      if (measure === 0) {
        stave.addClef("percussion");
      }

      stave.setContext(context).draw();

      // Show measure numbers every 4 bars (1, 5, 9, ...).
      if (measure % 4 === 0) {
        context.setFont("Space Grotesk", 12, "600");
        context.fillText(
          String(measure + 1),
          stave.getX() + 4,
          stave.getY() - 8,
        );
      }

      // Generate a unique ostinato for each measure
      const combinedArray = generateOstinato();

      // Helper function to map elements of the array to musical note keys
      function getNoteFromChar(char) {
        switch (char) {
          case "r": // Ride cymbal
            return { key: "f/5/x2" };
          case "h": // Hi-hat
            return { key: "d/4/x2" };
          case "s": // Snare
            return { key: "c/5" };
          case "b": // Bass drum
            return { key: "f/4" };
          case "x": // Rest
            return { key: "c/5" };
          default:
            console.error("Invalid character encountered: " + char);
            return null;
        }
      }

      function getPlayableChars(combo) {
        return combo.split("").filter((c) => c !== "x");
      }

      function createNoteFromCombo(combo, noteDuration, restDuration) {
        const playableChars = getPlayableChars(combo);
        if (playableChars.length === 0) {
          return new VF.StaveNote({
            keys: ["c/5"],
            duration: restDuration,
            clef: "percussion",
          });
        }

        const keys = playableChars.map((c) => getNoteFromChar(c).key);
        return new VF.StaveNote({
          keys: keys,
          duration: noteDuration,
          clef: "percussion",
        });
      }

      // Create notes beat-by-beat so first-partial-only triplets become quarter notes.
      const notes = [];
      const triplets = [];
      const beams = [];
      for (let i = 0; i < combinedArray.length; i += 3) {
        const beatCombos = combinedArray.slice(i, i + 3);
        const firstHasNote = getPlayableChars(beatCombos[0]).length > 0;
        const secondHasNote = getPlayableChars(beatCombos[1]).length > 0;
        const thirdHasNote = getPlayableChars(beatCombos[2]).length > 0;

        const pattern =
          (firstHasNote ? 4 : 0) +
          (secondHasNote ? 2 : 0) +
          (thirdHasNote ? 1 : 0);

        switch (pattern) {
          // 100 = Quarter note
          case 4:
            notes.push(createNoteFromCombo(beatCombos[0], "q", "qr"));
            continue;

          // 101 = Two beamed eighth notes
          case 5: {
            const eighthNotes = [
              createNoteFromCombo(beatCombos[0], "8", "8r"),
              createNoteFromCombo(beatCombos[2], "8", "8r"),
            ];

            notes.push(...eighthNotes);
            beams.push(new VF.Beam(eighthNotes));
            continue;
          }

          // 000 = Quarter rest (only when ride is disabled)
          case 0:
            if (!includeRide) {
              notes.push(
                new VF.StaveNote({
                  keys: ["c/5"],
                  duration: "qr",
                  clef: "percussion",
                }),
              );
              continue;
            }
            break;

          // 001 = Eighth rest + eighth note
          case 1:
            notes.push(
              new VF.StaveNote({
                keys: ["c/5"],
                duration: "8r",
                clef: "percussion",
              }),
              createNoteFromCombo(beatCombos[2], "8", "8r"),
            );
            continue;
        }
        const tripletNotes = [
          createNoteFromCombo(beatCombos[0], "8", "8r"),
          createNoteFromCombo(beatCombos[1], "8", "8r"),
          createNoteFromCombo(beatCombos[2], "8", "8r"),
        ];

        notes.push(...tripletNotes);
        triplets.push(new VF.Tuplet(tripletNotes));

        // Only beam the first two notes if the last one is a rest
        const noRestInLast = !tripletNotes[2].isRest();
        const noRestInFirstTwo =
          !tripletNotes[0].isRest() && !tripletNotes[1].isRest();

        if (noRestInLast) {
          beams.push(new VF.Beam(tripletNotes)); // Beam all three
        } else if (noRestInFirstTwo) {
          beams.push(new VF.Beam(tripletNotes.slice(0, 2))); // Only beam first two
        }
      }

      // Create a voice in 4/4 time and add the notes
      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);

      // Format notes to the true drawable width between the stave's start/end note bounds.
      const noteAreaWidth = stave.getNoteEndX() - stave.getNoteStartX() - 8;
      new VF.Formatter().joinVoices([voice]).format([voice], noteAreaWidth);

      // Render the voice and notes
      voice.draw(context, stave);

      // Render the triplets (grouping)
      triplets.forEach(function (tuplet) {
        tuplet.setContext(context).draw();
      });

      // Render the beams
      beams.forEach(function (beam) {
        beam.setContext(context).draw();
      });
    }
  }

  // Button click event to generate music
  document
    .getElementById("generate-btn")
    .addEventListener("click", function () {
      const numMeasures =
        parseInt(document.getElementById("num-measures").value, 10) || 1; // Get number of measures from input

      // Generate the sheet music with the specified number of measures
      generateSheetMusic(numMeasures);
    });
};
