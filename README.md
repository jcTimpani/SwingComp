Drumset Music Generator
The Drumset Music Generator is a web-based tool designed to generate dynamic comping patterns for jazz swing beats. Users can customize the difficulty level, select different voices (snare, bass, or both), and control the number of measures generated for practice. This tool helps drummers practice and improve their rhythm and coordination by generating new and random rhythmic patterns for every session.

Features
Difficulty Levels: Choose from three different difficulty levels.
Level 1: Only generates notes on the downbeats (beats 1, 2, 3, and 4).
Level 2: Generates notes on the downbeats and the third partial of triplets.
Level 3: Generates notes on all triplets (full complexity).
Voice Selection: Choose whether to generate only snare, only bass, or both.
Custom Measures: Specify how many measures of music you want to generate.
Random Patterns: Every time you generate a new pattern, the rhythm changes randomly, helping drummers practice a variety of comping rhythms.
Technologies Used
HTML: For structuring the user interface.
CSS: For styling and layout.
JavaScript (VexFlow): For generating and rendering the drumset sheet music.
Installation and Setup
Clone or download the repository to your local machine.
Open the project in a text editor or IDE like Visual Studio Code or Visual Studio.
Make sure your project is configured to serve static files (HTML, CSS, and JavaScript).
The project uses VexFlow to generate the sheet music. No installation is necessary for VexFlow, as it is linked via a CDN in the HTML file.
Open the index.html file in a web browser to use the Drumset Music Generator.
Usage
Open the web page in your browser.
Enter the number of measures you'd like to generate.
Select a difficulty level from the dropdown.
Choose whether to generate snare, bass, or both using the checkboxes.
Click the Generate Music button to display the sheet music.
To generate new music with the same settings, click the Generate Again button. To reset the form, use the Go Back button.
Project Structure
index.html: The main web page where the user can interact with the Drumset Music Generator.
css/styles.css: Contains all the styles for the page layout and form.
js/test.js: The main JavaScript logic, including random rhythm generation and rendering the sheet music using VexFlow.
