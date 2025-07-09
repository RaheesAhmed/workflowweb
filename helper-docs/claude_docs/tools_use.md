# Tool use with Claude

Claude is capable of interacting with tools and functions, allowing you to extend Claude's capabilities to perform a wider variety of tasks.

<Tip>
  Learn everything you need to master tool use with Claude via our new
  comprehensive [tool use
  course](https://github.com/anthropics/courses/tree/master/tool_use)! Please
  continue to share your ideas and suggestions using this
  [form](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

Here's an example of how to provide tools to Claude using the Messages API:

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-opus-4-20250514",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ]
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-20250514",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"],
            },
        }
    ],
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
          },
          required: ["location"],
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "Tell me the weather in San Francisco.",
      },
    ],
  });

  console.log(response);
}

main().catch(console.error);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class GetWeatherExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location",
                        Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(schema)
                        .build())
                .addUserMessage("What's the weather like in San Francisco?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

---

## How tool use works

Claude supports two types of tools:

1. **Client tools**: Tools that execute on your systems, which include:

   - User-defined custom tools that you create and implement
   - Anthropic-defined tools like [computer use](/en/docs/agents-and-tools/tool-use/computer-use-tool) and [text editor](/en/docs/agents-and-tools/tool-use/text-editor-tool) that require client implementation

2. **Server tools**: Tools that execute on Anthropic's servers, like the [web search](/en/docs/agents-and-tools/tool-use/web-search-tool) tool. These tools must be specified in the API request but don't require implementation on your part.

<Note>
  Anthropic-defined tools use versioned types (e.g., `web_search_20250305`, `text_editor_20250124`) to ensure compatibility across model versions.
</Note>

### Client tools

Integrate client tools with Claude in these steps:

<Steps>
  <Step title="Provide Claude with tools and a user prompt">
    * Define client tools with names, descriptions, and input schemas in your API request.
    * Include a user prompt that might require these tools, e.g., "What's the weather in San Francisco?"
  </Step>

  <Step title="Claude decides to use a tool">
    * Claude assesses if any tools can help with the user's query.
    * If yes, Claude constructs a properly formatted tool use request.
    * For client tools, the API response has a `stop_reason` of `tool_use`, signaling Claude's intent.
  </Step>

  <Step title="Execute the tool and return results">
    * Extract the tool name and input from Claude's request
    * Execute the tool code on your system
    * Return the results in a new `user` message containing a `tool_result` content block
  </Step>

  <Step title="Claude uses tool result to formulate a response">
    * Claude analyzes the tool results to craft its final response to the original user prompt.
  </Step>
</Steps>

Note: Steps 3 and 4 are optional. For some workflows, Claude's tool use request (step 2) might be all you need, without sending results back to Claude.

### Server tools

Server tools follow a different workflow:

<Steps>
  <Step title="Provide Claude with tools and a user prompt">
    * Server tools, like [web search](/en/docs/build-with-claude/tool-use/web-search-tool), have their own parameters.
    * Include a user prompt that might require these tools, e.g., "Search for the latest news about AI."
  </Step>

  <Step title="Claude executes the server tool">
    * Claude assesses if a server tool can help with the user's query.
    * If yes, Claude executes the tool, and the results are automatically incorporated into Claude's response.
  </Step>

  <Step title="Claude uses the server tool result to formulate a response">
    * Claude analyzes the server tool results to craft its final response to the original user prompt.
    * No additional user interaction is needed for server tool execution.
  </Step>
</Steps>

---

## Tool use examples

Here are a few code examples demonstrating various tool use patterns and techniques. For brevity's sake, the tools are simple tools, and the tool descriptions are shorter than would be ideal to ensure best performance.

<AccordionGroup>
  <Accordion title="Single tool example">
    <CodeGroup>
      ```bash Shell
      curl https://api.anthropic.com/v1/messages \
           --header "x-api-key: $ANTHROPIC_API_KEY" \
           --header "anthropic-version: 2023-06-01" \
           --header "content-type: application/json" \
           --data \
      '{
          "model": "claude-opus-4-20250514",
          "max_tokens": 1024,
          "tools": [{
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "input_schema": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      },
                      "unit": {
                          "type": "string",
                          "enum": ["celsius", "fahrenheit"],
                          "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                      }
                  },
                  "required": ["location"]
              }
          }],
          "messages": [{"role": "user", "content": "What is the weather like in San Francisco?"}]
      }'
      ```

      ```Python Python
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="claude-opus-4-20250514",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                          }
                      },
                      "required": ["location"]
                  }
              }
          ],
          messages=[{"role": "user", "content": "What is the weather like in San Francisco?"}]
      )

      print(response)
      ```

      ```java Java
      import java.util.List;
      import java.util.Map;

      import com.anthropic.client.AnthropicClient;
      import com.anthropic.client.okhttp.AnthropicOkHttpClient;
      import com.anthropic.core.JsonValue;
      import com.anthropic.models.messages.Message;
      import com.anthropic.models.messages.MessageCreateParams;
      import com.anthropic.models.messages.Model;
      import com.anthropic.models.messages.Tool;
      import com.anthropic.models.messages.Tool.InputSchema;

      public class WeatherToolExample {

          public static void main(String[] args) {
              AnthropicClient clien
