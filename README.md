# tenda-app

A simple greeting application that responds to "hi" and other greetings.

## Features

- Simple web server that responds to greetings
- RESTful API endpoints
- Clean web interface
- Lightweight and easy to run

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the application:

```bash
npm start
```

The app will be available at `http://localhost:3000`

### API Endpoints

- `GET /` - Main greeting with app status
- `GET /hi` - Responds to "hi" greeting  
- `GET /hello` - Responds to "hello" greeting

### Example Responses

**GET /**
```json
{
  "message": "Hi! Welcome to Tenda App",
  "status": "running",
  "greeting": "Hello there!"
}
```

**GET /hi**
```json
{
  "response": "Hi! How can I help you today?",
  "app": "tenda-app"
}
```

## Development

For development, you can run:

```bash
npm run dev
```