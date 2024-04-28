# Golang Server for ChatGPT Integration

This Golang server acts as an intermediary between clients and the OpenAI's ChatGPT API. It handles incoming requests, caches responses to optimize performance, and refreshes the cache periodically to ensure the relevance of the data.

## Features

- **Caching Mechanism**: Reduces the number of requests made to the OpenAI API by caching responses.
- **Automatic Cache Refresh**: Periodically refreshes cached entries to keep the information up-to-date.
- **Concurrent Access**: Utilizes Golang's concurrency model to handle multiple requests safely.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Golang (at least version 1.16)
- Access to the internet to reach OpenAI's ChatGPT API
- An API key from OpenAI

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. **Clone the repository**
   ```bash
   git clone https://github.com/jculley01/MuseumMate.git
   cd code
   cd GPT
   ```
2. Set Up ENV Variable
```bash
export API_KEY=[your_openai_api_key]
```
3. Install dependencies
```bash
go mod tidy
```
4. Run the server
```bash
go run main.go
```

This will start the server on the default port `4040`. You can access the server at `http://localhost:4040`. 


## API Usage

**Endpoint:** `/chat`

- **Method:** POST
- **Body:**
  ```json
  {
    "prompt": "Hello, how are you?"
  }
    ```

### Success Response:

- **Code:** 200
- **Content:**
  ```json
  {
    "response": "I'm doing great, thanks for asking!"
  }
  ```

  ### Error Response:

- **Code:** 400 BAD REQUEST
- **Content:**
  ```json
  {
    "error": "Invalid request data"
  }
```