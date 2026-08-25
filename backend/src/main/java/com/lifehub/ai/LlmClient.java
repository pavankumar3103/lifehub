package com.lifehub.ai;

public interface LlmClient {

    /**
     * Sends the prompt to the LLM and returns its raw JSON text response.
     */
    String generateJson(String prompt);
}
