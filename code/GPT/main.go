package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/manifoldco/promptui"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

const chatGPTAPIURL = "https://api.openai.com/v1/chat/completions"

type ChatGPTRequest struct {
	Prompt    string `json:"prompt"`
	MaxTokens int    `json:"max_tokens"`
}
type ChatGPTResponse struct {
	Choices []struct {
		Text string `json:"text"`
	} `json:"choices"`
}

func getAPIKeyFromUser() string {
	prompt := promptui.Prompt{
		Label: "Enter your ChatGPT API key (including 'Bearer')",
	}
	result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}
	return result
}
func generateChatGPTResponse(apiKey, inputText string) (string, error) {
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
	req, err := http.NewRequest("POST", chatGPTAPIURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", apiKey)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return "", fmt.Errorf("API request failed with status code: %d and body: %s", resp.StatusCode, string(body))
	}
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
	if len(responsePayload.Choices) > 0 && len(responsePayload.Choices[0].Message) > 0 {
		return responsePayload.Choices[0].Message["content"], nil
	}
	return "", fmt.Errorf("No choices in the response")
}
func main() {
	apiKey := getAPIKeyFromUser()
	for {
		prompt := promptui.Prompt{
			Label: "Ask a question (or type 'exit' to quit)",
		}
		userInput, err := prompt.Run()
		if err != nil {
			log.Fatalf("Prompt failed: %v\n", err)
		}
		if strings.ToLower(userInput) == "exit" {
			fmt.Println("Exiting the program.")
			os.Exit(0)
		}
		response, err := generateChatGPTResponse(apiKey, userInput)
		if err != nil {
			log.Printf("Error generating ChatGPT response: %v\n", err)
			continue
		}
		fmt.Println("ChatGPT Response:", response)
	}
}
