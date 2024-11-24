const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

// Serve static files (e.g., index.html in the public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Default route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube Downloader API! Use the /download endpoint to download videos.');
});

// Endpoint for downloading YouTube videos
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(url, { format: 'mp4' }).pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Error downloading video', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
