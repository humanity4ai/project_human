# Humanity4AI MCP Server — Terminal Demo
# This file generates demo.gif via vhs (https://github.com/charmbracelet/vhs)

Output demo.gif
Set Theme "Dracula"
Set FontSize 16
Set Width 800
Set Height 600
Set Padding 20
Set PlaybackSpeed 0.8

# Title screen
Hide
Type "Humanity4AI MCP Server Demo"
Sleep 2s
Show

# Start the server
Type "pnpm start"
Enter
Sleep 2s

# Show the banner
Sleep 2s

# Send a tools/list request via stdin
Type "# List all 9 available tools"
Enter
Sleep 500ms

Type "echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts"
Enter
Sleep 2s

# Call a tool
Type "# Call the supportive_reply tool"
Enter
Sleep 500ms

Type "echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"supportive_reply","arguments":{"message":"I feel really alone today","risk_level":"low"}}}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts"
Enter
Sleep 3s

# Show the remote URL option
Type "# Remote access — no install needed"
Enter
Sleep 500ms

Type "curl -X POST https://humanity4ai.ascent.partners/api/mcp -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'"
Enter
Sleep 2s

# End
Type "# 9 humanity skills, ready to use. github.com/humanity4ai/project_human"
Enter
Sleep 2s
