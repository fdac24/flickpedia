import { readdirSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  try {
    // Correct path to the 'public/transcripts' directory
    const transcriptDir = join(process.cwd(), 'public', 'transcripts');
    
    // Log the path being used
    console.log('Transcript directory path:', transcriptDir);

    // Try reading the filenames in the transcripts directory
    const filenames = readdirSync(transcriptDir);
    console.log('Filenames found:', filenames);

    // Map the filenames to episode metadata
    const episodes = filenames.map((filename) => {
      const id = filename.split(' ')[0].toLowerCase(); // Extract the episode ID
      const title = filename.replace('.txt', '').replace(/_/g, ' '); // Format the title
      return { id, title, transcript: filename };
    });

    console.log('Episodes data:', episodes);

    // Return the episodes as JSON
    res.status(200).json(episodes);
  } catch (error) {
    // Log the detailed error message
    console.error('Error loading episodes:', error.message);
    res.status(500).json({ error: 'Failed to load episodes', details: error.message });
  }
}
