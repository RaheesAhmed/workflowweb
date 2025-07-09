# Remote MCP servers

Several companies have deployed remote MCP servers that developers can connect to via the Anthropic MCP connector API. These servers expand the capabilities available to developers and end users by providing remote access to various services and tools through the MCP protocol.

<Note>
  The remote MCP servers listed below are third-party services designed to work with the Anthropic API. These servers
  are not owned, operated, or endorsed by Anthropic. Users should only connect to remote MCP servers they trust and
  should review each server's security practices and terms before connecting.
</Note>

## Connecting to remote MCP servers

To connect to a remote MCP server:

1. Review the documentation for the specific server you want to use.
2. Ensure you have the necessary authentication credentials.
3. Follow the server-specific connection instructions provided by each company.

For more information about using remote MCP servers with the Anthropic API, see the [MCP connector docs](/en/docs/agents-and-tools/mcp-connector).

## Remote MCP server examples

| **Company**                                                                                   | **Description**                                                                                            | **Server URL**                                                                                                    |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **[Asana](https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server)** | Interact with your Asana workspace through AI tools to keep projects on track.                             | `https://mcp.asana.com/sse`                                                                                       |
| **[Atlassian](https://www.atlassian.com/platform/remote-mcp-server)**                         | Access Atlassian's collaboration and productivity tools.                                                   | `https://mcp.atlassian.com/v1/sse`                                                                                |
| **[Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare/tree/main)**               | Build applications, analyze traffic, monitor performance, and manage security settings through Cloudflare. | See [`mcp-server-cloudflare` repo](https://github.com/cloudflare/mcp-server-cloudflare/tree/main) for server URLs |
| **[Intercom](https://developers.intercom.com/docs/guides/mcp)**                               | Access real-time customer conversations, tickets, and user data—from Intercom.                             | `https://mcp.intercom.com/sse`                                                                                    |
| **[invideo](https://invideo.io/ai/mcp)**                                                      | Build video creation capabilities into your applications.                                                  | `https://mcp.invideo.io/sse`                                                                                      |
| **[Linear](https://linear.app/docs/mcp)**                                                     | Integrate with Linear's issue tracking and project management system.                                      | `https://mcp.linear.app/sse`                                                                                      |
| **[PayPal](https://www.paypal.ai/)**                                                          | Integrate PayPal commerce capabilities.                                                                    | `https://mcp.paypal.com/sse`                                                                                      |
| **[Plaid](https://plaid.com/blog/plaid-mcp-ai-assistant-claude/)**                            | Analyze, troubleshoot, and optimize Plaid integrations.                                                    | `https://api.dashboard.plaid.com/mcp/sse`                                                                         |
| **[Square](https://developer.squareup.com/docs/mcp)**                                         | Use an agent to build on Square APIs. Payments, inventory, orders, and more.                               | `https://mcp.squareup.com/sse`                                                                                    |
| **[Workato](https://docs.workato.com/mcp.html)**                                              | Access any application, workflows or data via Workato, made accessible for AI                              | MCP servers are programmatically generated.                                                                       |
| **[Zapier](https://zapier.com/mcp)**                                                          | Connect to nearly 8,000 apps through Zapier's automation platform.                                         | `https://mcp.zapier.com/`                                                                                         |
