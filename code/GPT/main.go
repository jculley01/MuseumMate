package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

const chatGPTAPIURL = "https://api.openai.com/v1/chat/completions"
const apiKey = "" // Hardcoded API Key

// ChatGPTResponse defines the structure of the response received from the OpenAI API
type ChatGPTResponse struct {
	Choices []struct {
		Text string `json:"text"`
	} `json:"choices"`
}

// RequestPayload defines the structure of the request payload received from the client
type RequestPayload struct {
	Prompt string `json:"prompt"`
}

// generateChatGPTResponse sends a request to the OpenAI API and returns the generated response
func generateChatGPTResponse(inputText string) (string, error) {
	// Prepare the message payload for the API request
	messages := []map[string]string{
		{"role": "system", "content": "You are a helpful assistant."},
		{"role": "user", "content": inputText},
	}
	requestPayload := map[string]interface{}{
		"model":    "gpt-3.5-turbo",
		"messages": messages,
	}
	jsonPayload, err := json.Marshal(requestPayload)
	if err != nil {
		return "", err
	}

	// Create a new POST request with the JSON payload
	req, err := http.NewRequest("POST", chatGPTAPIURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", apiKey)

	// Send the request and get the response
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Handle non-OK responses
	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return "", fmt.Errorf("API request failed with status code: %d and body: %s", resp.StatusCode, string(body))
	}

	// Read and parse the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	var responsePayload struct {
		Choices []struct {
			Message map[string]string `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(body, &responsePayload); err != nil {
		return "", err
	}

	// Return the response text or an error if no choices were found
	if len(responsePayload.Choices) > 0 && len(responsePayload.Choices[0].Message) > 0 {
		return responsePayload.Choices[0].Message["content"], nil
	}
	return "", fmt.Errorf("No choices in the response")
}

// chatHandler handles incoming POST requests to the /chat endpoint
func chatHandler(c *gin.Context) {
	var requestPayload RequestPayload
	// Bind the incoming JSON payload to the RequestPayload struct
	if err := c.BindJSON(&requestPayload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate the chat response using the OpenAI API
	response, err := generateChatGPTResponse(requestPayload.Prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Send the response back to the client
	c.JSON(http.StatusOK, gin.H{"response": response})
}

func main() {
	// Create a Gin router and register the chatHandler for the POST /chat endpoint
	r := gin.Default()
	r.POST("/chat", chatHandler)

	// Get the port from the environment variable or use the default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4040" // Default port if not specified
	}

	// Start the server and listen on the specified port
	log.Printf("Server starting on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
