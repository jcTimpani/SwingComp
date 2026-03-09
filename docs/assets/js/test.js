window.onload = function () {
    const VF = Vex.Flow;
    const settingsPanel = document.getElementById("settings-panel");
    const toggleControlsBtn = document.getElementById("toggle-controls-btn");

    toggleControlsBtn.addEventListener("click", function () {
        const isCollapsed = settingsPanel.classList.toggle("controls-collapsed");
        toggleControlsBtn.textContent = isCollapsed ? "Show Settings" : "Hide Settings";
        toggleControlsBtn.setAttribute("aria-expanded", (!isCollapsed).toString());
    });

    // Function to convert the combined array into sheet music
    function generateSheetMusic(numMeasures) {
        const div = document.getElementById("output");
        div.classList.remove("is-hidden");
        div.innerHTML = "";

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Determine the stave width and layout based on the number of measures
        const staveWidth = numMeasures === 1 ? 700 : 350; // Full width for single measure, half for multiple
        const heightPerLine = 150;
        const numLines = Math.ceil(numMeasures / 2);
        renderer.resize(800, numLines * heightPerLine);

        const context = renderer.getContext();

        // Get the selected voice type from the dropdown
        const selectedVoice = document.getElementById("voice-select").value;

        // Function to generate a new random ostinato array based on the selected voice
        // Function to generate a new random ostinato array based on the selected voice and difficulty
        function generateOstinato() {
            const ostinatoArray = ["r", "x", "x", "rh", "x", "r", "r", "x", "x", "rh", "x", "r"];
            const randomArray = Array(12).fill("x");

            let lastNote = "";
            let repetitionCount = 0;
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

            // 50/50 chance of replacing an "x" with a snare or bass drum in allowed positions
            for (let i = 0; i < randomArray.length; i++) {
                if (allowedPositions.includes(i) && Math.random() < 0.5) {
                    let newNote;
                    if (selectedVoice === "snare") {
                        // Only snare selected
                        if (lastNote === "s" && repetitionCount >= 2) {
                            newNote = "x"; // Place a rest to break the repetition
                        } else {
                            newNote = "s"; // Always snare
                        }
                    } else if (selectedVoice === "bass") {
                        // Only bass selected
                        if (lastNote === "b" && repetitionCount >= 2) {
                            newNote = "x"; // Place a rest to break the repetition
                        } else {
                            newNote = "b"; // Always bass
                        }
                    } else {
                        // Both snare and bass selected (random choice between snare and bass)
                        do {
                            newNote = Math.random() < 0.5 ? "s" : "b";
                        } while (newNote === lastNote && repetitionCount >= 2);
                    }

                    // Update repetition count and set the note
                    if (newNote === lastNote) {
                        repetitionCount++;
                    } else {
                        repetitionCount = 1;
                    }

                    randomArray[i] = newNote;
                    lastNote = newNote;
                } else {
                    randomArray[i] = "x"; // Rest for all non-allowed positions
                    repetitionCount = 0; // Reset repetition count on rest
                }
            }

            // Combine the ostinato with the random snare/bass notes
            const combinedArray = [];
            for (let i = 0; i < ostinatoArray.length; i++) {
                combinedArray[i] = ostinatoArray[i] + randomArray[i];
            }

            return combinedArray;
        }


        for (let measure = 0; measure < numMeasures; measure++) {
            const lineIndex = Math.floor(measure / 2); // Track which line (row) the stave is on
            const xOffset = (measure % 2) * staveWidth; // Move right by staveWidth for the second measure

            // Create a stave for each measure
            const stave = new VF.Stave(10 + xOffset, 40 + (lineIndex * heightPerLine), staveWidth);
            if (measure === 0) {
                stave.addClef("percussion");
            }

            stave.setContext(context).draw();

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
                return combo.split("").filter(c => c !== "x");
            }

            function createNoteFromCombo(combo, noteDuration, restDuration) {
                const playableChars = getPlayableChars(combo);
                if (playableChars.length === 0) {
                    return new VF.StaveNote({
                        keys: ["c/5"],
                        duration: restDuration,
                        clef: "percussion"
                    });
                }

                const keys = playableChars.map(c => getNoteFromChar(c).key);
                return new VF.StaveNote({
                    keys: keys,
                    duration: noteDuration,
                    clef: "percussion"
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

                if (firstHasNote && !secondHasNote && !thirdHasNote) {
                    notes.push(createNoteFromCombo(beatCombos[0], "q", "qr"));
                    continue;
                }

                const tripletNotes = [
                    createNoteFromCombo(beatCombos[0], "8", "8r"),
                    createNoteFromCombo(beatCombos[1], "8", "8r"),
                    createNoteFromCombo(beatCombos[2], "8", "8r")
                ];

                notes.push(...tripletNotes);
                triplets.push(new VF.Tuplet(tripletNotes));

                // Only beam the first two notes if the last one is a rest
                const noRestInLast = !tripletNotes[2].isRest();
                const noRestInFirstTwo = !tripletNotes[0].isRest() && !tripletNotes[1].isRest();

                if (noRestInLast) {
                    beams.push(new VF.Beam(tripletNotes)); // Beam all three
                } else if (noRestInFirstTwo) {
                    beams.push(new VF.Beam(tripletNotes.slice(0, 2))); // Only beam first two
                }
            }

            // Create a voice in 4/4 time and add the notes
            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);

            // Format and justify the notes to fit within each stave
            new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);

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
    document.getElementById("generate-btn").addEventListener("click", function () {
        const numMeasures = parseInt(document.getElementById("num-measures").value, 10) || 1; // Get number of measures from input

        // Generate the sheet music with the specified number of measures
        generateSheetMusic(numMeasures);
    });
};