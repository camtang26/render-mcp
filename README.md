# Render MCP Server

Deploy to [Render.com](https://render.com) directly through AI assistants.

This MCP (Model Context Protocol) server allows AI assistants like Claude to interact with the Render API, enabling deployment and management of services on Render.com.

## Features

- List all services in your Render account
- Get details of a specific service
- Deploy services
- Create new services
- Delete services
- Get deployment history
- Manage environment variables
- Manage custom domains
- **Get backend logs** for services with filtering and pagination

## Installation

```bash
npm install -g @niyogi/render-mcp
```

## Configuration

1. Get your Render API key from [Render Dashboard](https://dashboard.render.com/account/api-keys)
2. Configure the MCP server with your key:

```bash
node bin/render-mcp.js configure --api-key=YOUR_API_KEY
```

Alternatively, you can run `node bin/render-mcp.js configure` without the `--api-key` flag to be prompted for your API key.

## Usage

### Starting the Server

```bash
node bin/render-mcp.js start
```

### Checking Configuration

```bash
node bin/render-mcp.js config
```

### Running Diagnostics

```bash
node bin/render-mcp.js doctor
```

Note: If you've installed the package globally, you can also use the shorter commands:
```bash
render-mcp start
render-mcp config
render-mcp doctor
```

## Using with Different AI Assistants

### Using with Cline

1. Add the following to your Cline MCP settings file:
   ```json
   {
     "mcpServers": {
       "render": {
         "command": "node",
         "args": ["/path/to/render-mcp/bin/render-mcp.js", "start"],
         "env": {
           "RENDER_API_KEY": "your-render-api-key"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

2. Restart Cline for the changes to take effect
3. You can now interact with Render through Claude:
   ```
   Claude, please deploy my web service to Render
   ```

### Using with Windsurf/Cursor

1. Install the render-mcp package:
   ```bash
   npm install -g @niyogi/render-mcp
   ```

2. Configure your API key:
   ```bash
   node bin/render-mcp.js configure --api-key=YOUR_API_KEY
   ```

3. Start the MCP server in a separate terminal:
   ```bash
   node bin/render-mcp.js start
   ```

4. In Windsurf/Cursor settings, add the Render MCP server:
   - Server Name: render
   - Server Type: stdio
   - Command: node
   - Arguments: ["/path/to/render-mcp/bin/render-mcp.js", "start"]

5. You can now use the Render commands in your AI assistant

### Using with Claude API Integrations

For custom applications using Claude's API directly:

1. Ensure the render-mcp server is running:
   ```bash
   node bin/render-mcp.js start
   ```

2. In your application, when sending messages to Claude via the API, include the MCP server connections in your request:

   ```json
   {
     "mcpConnections": [
       {
         "name": "render",
         "transport": {
           "type": "stdio",
           "command": "node",
           "args": ["/path/to/render-mcp/bin/render-mcp.js", "start"]
         }
       }
     ]
   }
   ```

3. Claude will now be able to interact with your Render MCP server

## Example Prompts

Here are some example prompts you can use with Claude once the MCP server is connected:

- "List all my services on Render"
- "Deploy my web service with ID srv-123456"
- "Create a new static site on Render from my GitHub repo"
- "Show me the deployment history for my service"
- "Add an environment variable to my service"
- "Add a custom domain to my service"
- **"Show me the logs for my service srv-123456"**
- **"Get error logs from the last hour for my web service"**
- **"Show me all warning and error logs across all my services"**

## Log Retrieval

The MCP server now provides full access to backend logs from your Render services. You can:

- Get logs from a specific service or across all services
- Filter logs by time range, log level, instance ID, or deploy ID
- Navigate through paginated results for large log sets

### Log Filtering Options

- **serviceId**: Get logs for a specific service (optional - omit to get all logs)
- **startTime**: ISO 8601 timestamp for start time (e.g., 2024-01-01T00:00:00Z)
- **endTime**: ISO 8601 timestamp for end time (e.g., 2024-01-01T23:59:59Z)
- **limit**: Number of log entries to return (default: 100, max: 1000)
- **level**: Filter by log level (info, warning, error, debug)
- **instanceId**: Filter logs by specific instance
- **deployId**: Filter logs by specific deployment

### Example Log Commands

```
"Show me all logs for service srv-123456"
"Get the last 500 error logs from today"
"Show me logs between 2024-01-01T10:00:00Z and 2024-01-01T12:00:00Z"
"Get debug logs for deploy dep-abc123"
```

## Development

### Building from Source

```bash
git clone https://github.com/niyogi/render-mcp.git
cd render-mcp
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## License

MIT
