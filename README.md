# LinguaAI

LinguaAI is a multilingual translation web application developed as part of my internship project. The goal of this project was to make translations sound more natural and conversational instead of producing only formal textbook-style outputs.

Apart from standard translations, the application also supports conversational dialect modes such as Hinglish and Hyderabadi Hindi. These modes help demonstrate how the same sentence may be spoken in different real-world communication styles.

The project also includes speech playback, translation history, voice profile selection, and a responsive user interface that works across desktop and mobile devices.

---

## Live Demo

**Website:**
(Add deployed website link here)

---

## Features

* Standard multilingual translation
* Hinglish translation mode
* Hyderabadi Hindi translation mode
* Speech playback using browser speech synthesis
* Male and Female voice profile selection
* Translation history with reuse functionality
* Copy-to-clipboard support
* Responsive design for desktop and mobile devices
* Clean and simple user interface

---

## Technologies Used

### Frontend

* React.js
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express.js

### Translation & AI

* Google Gemini API
* Google Translate API
* Web Speech API

---

## Project Structure

```text
LinguaAI
│
├── frontend
│   ├── src
│   ├── public
│   └── components
│
├── backend
│   ├── src
│   ├── routes
│   ├── ai
│   └── tests
│
└── README.md
```

---

## Screenshots

### Main Interface

(Add screenshot after deployment)

### Standard Translation

<img width="2044" height="932" alt="image" src="https://github.com/user-attachments/assets/c8424a79-c062-4aef-a490-127e6e26cfc8" />


### Hinglish Translation

(Add screenshot after deployment)

### Hyderabadi Hindi Translation

(Add screenshot after deployment)

### Voice Playback

(Add screenshot after deployment)

### Translation History

(Add screenshot after deployment)

### Mobile View

(Add screenshot after deployment)

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd lingua-ai
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add:

```env
GEMINI_API_KEY=your_api_key_here
```

Start the backend server:

```bash
npm start
```

### Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

---

## How It Works

1. The user enters text and selects a target language.
2. Standard translations are generated for normal multilingual communication.
3. Hinglish and Hyderabadi Hindi modes apply conversational dialect transformations to produce more natural outputs.
4. Users can listen to supported translations using browser speech synthesis.
5. Translation history is stored locally and can be reused whenever needed.

---

## Challenges Faced

One of the biggest challenges during development was maintaining a noticeable difference between Hinglish and Hyderabadi Hindi outputs while keeping the translations natural and understandable.

Another challenge was browser speech synthesis support. Different browsers and operating systems provide different voice libraries, which required additional testing and fallback handling to ensure reliable audio playback.

The project also required balancing AI-generated translations with rule-based processing so that dialect outputs remained consistent even when fallback translation mechanisms were used.

---

## Future Improvements

* Support for additional Indian dialects
* Improved speech synthesis quality
* Real-time conversation mode
* User authentication
* Cloud-based translation history
* Additional translation styles and tones
* Support for more regional languages

---

## Author

**Hemanth Krishna**

Internship Project - 2026
