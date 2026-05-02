/* eslint-disable @typescript-eslint/no-explicit-any */

export class LLMService {
  private apiKey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apiKey = process.env.OPEN_ROUTER_API_KEY || "";
    this.model =
      process.env.OPEN_ROUTER_LLM_MODEL ||
      "nvidia/nemotron-3-super-120b-a12b:free";

    if (!this.apiKey) {
      throw new Error("OpenRouter api key is missing or not properly configured in env...");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
      // Combine context with prompt for RAG
      let fullPrompt =
        context.length > 0
          ? `Context information:\n${context.join("\n\n")}\n\nQuestion: ${prompt}\n\nAnswer based on the context above.`
          : prompt;

      if (asJson) {
        fullPrompt += `\n\nReturn ONLY a valid JSON object matching this structure: {"tutors": [{"name": "Tutor Name", "reason": "Why they are suitable", "category": "Their category/subject"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }

      const systemMessage = asJson
        ? "You are a helpful assistant for SkillBridge, a tutor marketplace. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags."
        : "You are a helpful assistant for SkillBridge, a tutor marketplace. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";

      const bodyPayload: any = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more deterministic JSON
        max_tokens: 1500,
      };

      if (
        asJson &&
        (this.model.includes("gpt") || this.model.includes("openai"))
      ) {
        bodyPayload.response_format = { type: "json_object" };
      }

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://skillbridge.local",
          "X-Title": "SkillBridge Tutor Platform",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`,
        );
      }

      const data: any = await response.json();

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }
}