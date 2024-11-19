import { browser } from '$app/environment';
import { create } from 'xmlbuilder2';

// Function to create MusicXML with rhythm notation only
function generateRhythmMusicXML() {
	const doc = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('score-partwise', { version: '3.1' })
		.ele('part-list')
		.ele('score-part', { id: 'P1' })
		.ele('part-name')
		.txt('Percussion')
		.up()
		.up()
		.up()
		.ele('part', { id: 'P1' })
		.ele('measure', { number: '1' })
		.ele('attributes')
		.ele('divisions')
		.txt('4')
		.up() // Defines rhythm divisions (e.g., 4 for quarter notes)
		.ele('time')
		.ele('beats')
		.txt('4')
		.up() // 4/4 time
		.ele('beat-type')
		.txt('4')
		.up()
		.up()
		.ele('clef')
		.ele('sign')
		.txt('percussion')
		.up() // Percussion clef for rhythm-only notation
		.ele('line')
		.txt('2')
		.up()
		.up()
		.up()

		// First sixteenth note
		.ele('note')
		.ele('unpitched')
		.ele('display-step')
		.txt('C')
		.up()
		.ele('display-octave')
		.txt('4')
		.up()
		.up()
		.ele('duration')
		.txt('1')
		.up() // Sixteenth note duration (1/4 of a quarter)
		.ele('type')
		.txt('16th')
		.up()
		.up()

		// Second sixteenth note
		.ele('note')
		.ele('unpitched')
		.ele('display-step')
		.txt('C')
		.up()
		.ele('display-octave')
		.txt('4')
		.up()
		.up()
		.ele('duration')
		.txt('1')
		.up() // Sixteenth note duration
		.ele('type')
		.txt('16th')
		.up()
		.up()

		// Eighth note rest
		.ele('note')
		.ele('rest')
		.up()
		.ele('duration')
		.txt('2')
		.up() // Eighth note duration (1/2 of a quarter)
		.ele('type')
		.txt('eighth')
		.up()
		.up()
		.up()
		.up();

	// Convert the XML object to a string
	const xmlString = doc.end({ prettyPrint: true });
	return xmlString;
}

async function createSheetMusicDisplay(musicXml: string, containerId: string) {
	if (!browser) return;
	// this is cursed as hell but is the only way I managed to make importing osmd work
	const OpenSheetMusicDisplay = (await import('opensheetmusicdisplay')).OpenSheetMusicDisplay;
	const osmd = new OpenSheetMusicDisplay(containerId, {
		drawPartNames: false, // Removes instrument/part names
		drawTitle: false, // Hides the title
		drawSubtitle: false, // Hides the subtitle
		drawComposer: false, // Hides composer details
		drawLyricist: false, // Hides lyricist details
		renderSingleHorizontalStaffline: false // Makes rendering simple and rhythm-focused
	});
	// TODO: atm, enabling this breaks click interaction with the score, so I can't use it :/
	// osmd.EngravingRules.RenderSingleHorizontalStaffline = true;

	// make layout more compact by reducing margins
	osmd.EngravingRules.PageTopMargin = 0;
	osmd.EngravingRules.PageBottomMargin = 0;
	osmd.EngravingRules.PageLeftMargin = 0;
	osmd.EngravingRules.PageRightMargin = 0;

	// apparently, one can reduce the likelihood for playback issues by increasing/setting this
	// osmd.EngravingRules.PlaybackSkipNotesSafetyInterval = 0.03;

	// uncomment the following for specific fixed measure width
	// osmd.EngravingRules.FixedMeasureWidth = true;
	// osmd.EngravingRules.FixedMeasureWidthFixedValue = 16;
	await osmd.load(musicXml);

	osmd.render();
	return osmd;
}

const musicXML = generateRhythmMusicXML();
console.log(musicXML);
createSheetMusicDisplay(musicXML, 'osmd-container').then(() => console.log('hi'));
