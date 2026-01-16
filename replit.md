# AI Code Plagiarism Detector

## Overview
A static frontend web application that detects AI-generated code plagiarism. Users can paste code into a text area, click "Analyze Code", and the app sends the code to an external AI backend API for analysis, displaying results with an animated percentage circle.

## Project Structure
- `index.html` - Main HTML page with the UI
- `script.js` - Frontend JavaScript with API calls and UI logic
- `server.js` - Simple Node.js static file server for development
- `css/` - Styling files:
  - `body.css` - Base body styles
  - `header.css` - Header styling
  - `button.css` - Analyze button styles
  - `CodeArea.css` - Textarea styling
  - `footer.css` - Footer styles
  - `reponseArea.css` - AI response area styling

## Technical Details
- Pure HTML/CSS/JavaScript frontend (no build process)
- External API: `https://ai-backend-2snf.onrender.com/analyze`
- Server runs on port 5000 using Node.js http module

## Development
Run the workflow "Web Server" to start the development server.

## Deployment
This is a static site that can be deployed directly. The `server.js` file provides a simple static file server for production use.
