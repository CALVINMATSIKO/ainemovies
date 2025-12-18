# Aine Movies - Free Streaming Website

A clean, modern streaming website that allows users to browse and stream movies/TV shows for free without any registration or login requirements.

## Features

- **No Login Required**: Completely free streaming without user accounts
- **Dark Theme**: Optimized for watching experience
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Search**: Search across movies and TV shows
- **Genre Browsing**: Browse by categories (Action, Comedy, Drama, etc.)
- **Video Player**: Integrated Video.js player with quality selector
- **Continue Watching**: Resume playback from where you left off
- **Watchlist**: Save movies/TV shows for later
- **Recently Viewed**: Track your last 20 watched items
- **Lazy Loading**: Optimized image loading for better performance
- **API Caching**: Faster loading with response caching

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Player**: Video.js
- **API**: TMDB (The Movie Database) v3
- **Hosting**: Static site (GitHub Pages/Netlify recommended)

## Project Structure

```
aine-movies/
├── index.html          # Home page
├── movie.html          # Movie details page
├── tv.html             # TV show details page
├── player.html         # Video player page
├── search.html         # Search results page
├── genres.html         # Genre browsing page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── app.js          # Main JavaScript file
└── assets/             # Static assets (images, icons, etc.)
```

## Setup Instructions

1. **Clone or Download** the project files
2. **Open index.html** in your web browser
3. The site will work immediately with the provided TMDB API key

## API Configuration

The site uses TMDB API v3 with the following key:
- API Key: `eefcc515ed0980a6aa4717c8080f9ccc`

**Important**: Remove the API key from public code before deployment and use environment variables in production.

## Deployment

### GitHub Pages
1. Upload all files to a GitHub repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose your main branch
4. The site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Drag and drop the project folder to Netlify's deployment area
2. The site will be live instantly

## Streaming Sources

The current implementation uses a demo video source. For production:

1. Integrate with free streaming APIs like:
   - 2Embed (https://www.2embed.cc/)
   - VidCloud
   - Or other similar services

2. Update the video source URL in `js/app.js` in the `loadPlayer()` function:
   ```javascript
   // Replace this line:
   document.getElementById('video-source').src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

   // With your streaming API:
   document.getElementById('video-source').src = `https://your-streaming-api.com/embed/${id}`;
   ```

## Features Implementation

### Watchlist & Continue Watching
- Data stored in browser's localStorage
- No server required
- Persists across browser sessions

### Search Functionality
- Real-time search with 500ms debounce
- Searches across movies and TV shows
- Results displayed with posters and basic info

### Genre Browsing
- Dynamic genre loading from TMDB
- Separate tabs for Movies and TV Shows
- Click any genre to browse content

## Legal Disclaimers

This site:
- Does not host any videos
- Sources content from third-party providers
- Uses TMDB for metadata only
- Complies with DMCA guidelines

## Customization

### Changing API Key
1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Replace the key in `js/app.js`:
   ```javascript
   const API_KEY = 'your-new-api-key-here';
   ```

### Updating Streaming Sources
1. Choose a streaming API provider
2. Update the video source URL in `loadPlayer()` function
3. Test with different movie/TV IDs

### Styling Changes
- Main styles in `css/style.css`
- Dark theme with red accents (#ff6b6b)
- Responsive breakpoints at 768px

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance Optimizations

- Lazy loading for images
- API response caching (1 hour)
- Minimal JavaScript bundle
- Optimized CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Ensure compliance with local laws and streaming service terms of service.

## Support

For issues or questions:
- Check the browser console for errors
- Verify TMDB API key is valid
- Ensure streaming sources are accessible

---

**Disclaimer**: This is a demonstration project. Streaming copyrighted content may violate laws in your jurisdiction. Use responsibly and ensure compliance with all applicable regulations.