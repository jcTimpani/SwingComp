window.onload = function () {
    const VF = Vex.Flow;

    // Function to reset the page to its original state (clear the output)
    function resetPage() {
        document.getElementById("output").innerHTML = "";
        const goBackBtn = document.getElementById("go-back-btn");
        if (goBackBtn) {
            goBackBtn.remove();
        }
    }

    // Function to draw the Jazz Swing Ostinato
    function drawJazzSwingOstinato(numMeasures) {
        const div = document.getElementById("output");
        div.innerHTML = "";

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        const context = renderer.getContext();

        // Determine the width for each stave (two measures per line)
        const staveWidth = 350; // Half of the usual stave width for two measures per line
        const heightPerLine = 150; // Height per line for staves

        // Adjust the renderer height dynamically based on number of lines required
        const numLines = Math.ceil(numMeasures / 2);
        renderer.resize(800, numLines * heightPerLine);

        for (let i = 0; i < numMeasures; i++) {
            const lineIndex = Math.floor(i / 2); // Track which line (row) the stave is on
            const xOffset = (i % 2) * staveWidth; // Move right by `staveWidth` for the second measure

            // Create a new stave for each measure
            const stave = new VF.Stave(10 + xOffset, 40 + (lineIndex * heightPerLine), staveWidth);
            if (i === 0) {
                stave.addClef("percussion");
            }

            stave.setContext(context).draw();
            // Jazz swing ostinato array
            const ostinato = ['r', 'x', 'x', 'rh', 'x', 'r', 'r', 'x', 'x', 'rh', 'x', 'r'];

            
            const notes = [
                new VF.StaveNote({
                    keys: ["f/5/x2"], // Ride cymbal with X notehead
                    duration: "q",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "d/4/x2"], // Ride cymbal and Hi-hat
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2"], // Ride cymbal (third triplet partial)
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2"], // Ride cymbal (quarter note)
                    duration: "q",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "d/4/x2"], // Ride cymbal and Hi-hat
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2"], // Ride cymbal (third triplet partial)
                    duration: "8",
                    clef: "percussion"
                })
            ];

            const beams = [
                new VF.Beam([notes[1], notes[2]]),
                new VF.Beam([notes[4], notes[5]])
            ];

            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);
            new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);

            voice.draw(context, stave);
            beams.forEach(function (beam) {
                beam.setContext(context).draw();
            });
        }

        const goBackBtn = document.createElement("button");
        goBackBtn.id = "go-back-btn";
        goBackBtn.textContent = "Go Back";
        goBackBtn.addEventListener("click", resetPage);
        div.appendChild(goBackBtn);
    }

    // Function to draw the Samba Ostinato
    function drawSambaOstinato(numMeasures) {
        const div = document.getElementById("output");
        div.innerHTML = "";

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        const context = renderer.getContext();

        const staveWidth = 350; // Half width for two measures per line
        const heightPerLine = 150; // Height for each line of staves

        // Adjust renderer height based on number of lines required
        const numLines = Math.ceil(numMeasures / 2);
        renderer.resize(800, numLines * heightPerLine);

        for (let i = 0; i < numMeasures; i++) {
            const lineIndex = Math.floor(i / 2);
            const xOffset = (i % 2) * staveWidth;

            const stave = new VF.Stave(10 + xOffset, 40 + (lineIndex * heightPerLine), staveWidth);
            if (i === 0) {
                stave.addClef("percussion");
            }

            stave.setContext(context).draw();

            const notes = [
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["d/4/x2", "f/5/x2"], // Ride cymbal and Hi-hat
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"],//ride cymbal, and bass drum
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["d/4/x2", "f/5/x2"], // Ride cymbal and Hi-hat
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["d/4/x2", "f/5/x2"], // Ride cymbal and Hi-hat
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"],//ride cymbal, and bass drum
                    duration: "8",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["d/4/x2", "f/5/x2"], // Ride cymbal and Hi-hat
                    duration: "16",
                    clef: "percussion"
                }),
                new VF.StaveNote({
                    keys: ["f/5/x2", "f/4"], // Ride cymbal and bass drum
                    duration: "16",
                    clef: "percussion"
                })
            ];

            const beams = [
                new VF.Beam([notes[0], notes[1], notes[2]]),
                new VF.Beam([notes[3], notes[4], notes[5]]),
                new VF.Beam([notes[6], notes[7], notes[8]]),
                new VF.Beam([notes[9], notes[10], notes[11]])
            ];

            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);
            new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);

            voice.draw(context, stave);
            beams.forEach(function (beam) {
                beam.setContext(context).draw();
            });
        }

        const goBackBtn = document.createElement("button");
        goBackBtn.id = "go-back-btn";
        goBackBtn.textContent = "Go Back";
        goBackBtn.addEventListener("click", resetPage);
        div.appendChild(goBackBtn);
    }

    // Button click event to generate music
    document.getElementById("generate-btn").addEventListener("click", function () {
        const ostinato = document.getElementById("ostinato").value;
        const numMeasures = parseInt(document.getElementById("num-measures").value, 10);

        if (ostinato === "samba") {
            drawSambaOstinato(numMeasures);
        } else if (ostinato === "jazz-swing") {
            drawJazzSwingOstinato(numMeasures);
        } else {
            console.log("Other ostinatos are not yet implemented");
        }
    });
};
