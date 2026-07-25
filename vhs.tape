Output demo.gif
Set Theme "Dracula"
Set FontSize 14
Set Width 900
Set Height 500
Set Padding 20

Hide
Type "Humanity4AI MCP Server — 9 humanity skills for AI agents"
Enter
Sleep 1s
Type "github.com/humanity4ai/project_human"
Enter
Sleep 2s
Show

Sleep 500ms

Type "# Start the MCP server"
Enter
Sleep 300ms

Type "pnpm start"
Enter
Sleep 2s

Type "# 9 skills registered — waiting for MCP client connections"
Enter
Sleep 1s

Type "Ctrl+C"
Sleep 500ms

Type ""
Enter

Type "# Connect remotely — no install needed"
Enter
Sleep 300ms

Type "curl -s -X POST https://humanity4ai.ascent.partners/api/mcp -H Content-Type: application/json -d @- << EOF"
Enter
Type '{'
Sleep 100ms
Type '  \"jsonrpc\": \"2.0\",'
Sleep 100ms
Type '  \"id\": 1,'
Sleep 100ms
Type '  \"method\": \"tools/list\",'
Sleep 100ms
Type '  \"params\": {}'
Sleep 100ms
Type '}'
Sleep 100ms
Type 'EOF'
Enter
Sleep 2s

Type "# All 9 tools returned — crisis detection, WCAG audit, empathy, and more"
Enter
Sleep 2s

Type ""
Enter
Type "# npm: @humanity4ai/mcp-servers"
Enter
Type "# npx @humanity4ai/mcp-servers"
Enter
Sleep 3s
