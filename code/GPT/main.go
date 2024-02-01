package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

const chatGPTAPIURL = "https://api.openai.com/v1/chat/completions"
const apiKey = "Bearer " // Hardcoded API Key

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

// ResponseCache to hold the prompts and their responses.
type ResponseCache struct {
	cache map[string]string
	mutex sync.RWMutex
}

// NewResponseCache initializes a new ResponseCache.
func NewResponseCache() *ResponseCache {
	return &ResponseCache{
		cache: make(map[string]string),
	}
}

// Get looks up a prompt in the cache.
func (c *ResponseCache) Get(prompt string) (string, bool) {
	c.mutex.RLock()
	defer c.mutex.RUnlock()
	response, found := c.cache[prompt]
	return response, found
}

// Set adds a prompt and its response to the cache.
func (c *ResponseCache) Set(prompt, response string) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	c.cache[prompt] = response
}

// RefreshCache iterates through all prompts in the cache, calls the ChatGPT API for each,
// and updates the cache with the new responses.
func (c *ResponseCache) RefreshCache() {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	for prompt := range c.cache {
		// Call the generateChatGPTResponse function to get an updated response.
		newResponse, err := generateChatGPTResponse(prompt)
		if err != nil {
			log.Printf("Error updating cache for prompt '%s': %s\n", prompt, err)
			continue // Skip this prompt if there's an error
		}

		// Update the cache with the new response.
		c.cache[prompt] = newResponse
	}
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

	// Check if the response is in the cache.
	if response, found := cache.Get(requestPayload.Prompt); found {
		c.JSON(http.StatusOK, gin.H{"response": response})
		return
	}

	// Generate the chat response using the OpenAI API if not found in cache.
	response, err := generateChatGPTResponse(requestPayload.Prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Save the new response to the cache.
	cache.Set(requestPayload.Prompt, response)

	// Send the response back to the client.
	c.JSON(http.StatusOK, gin.H{"response": response})
}

var cache = NewResponseCache() // Initialize the cache.

func main() {
	// Create a Gin router and register the chatHandler for the POST /chat endpoint
	r := gin.Default()
	r.POST("/chat", chatHandler)

	// Get the port from the environment variable or use the default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4040" // Default port if not specified
	}

	// Schedule cache refresh every 5 hours
	ticker := time.NewTicker(5 * time.Hour)
	go func() {
		for range ticker.C {
			log.Println("Refreshing cache...")
			cache.RefreshCache()
		}
	}()

	// Start the server and listen on the specified port
	log.Printf("Server starting on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
