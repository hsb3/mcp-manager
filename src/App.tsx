import { MCPServers } from "@/components/mcp-servers"
import { TerminalCommand } from "@/components/terminal-command"
import { SERVER_CONFIGS } from "@/config/server-configs"
import { capitalizeFirstLetter } from "@/utils"
import { Check, Copy, Save, Upload, XCircle } from "lucide-react"
import type React from "react"
import { useState } from "react"

function App() {
	const [jsonContent, setJsonContent] = useState<{
		mcpServers: Record<string, { command: string; args: string[] }>
	}>({
		mcpServers: {}
	})
	const [terminalServers, setTerminalServers] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "success" | "error"
	>("idle")
	const [hasCopied, setHasCopied] = useState(false)
	const [hasCopiedSave, setHasCopiedSave] = useState(false)
	const [isInstructionsOpen, setIsInstructionsOpen] = useState(true)

	const command =
		"test -f ~/Library/Application\\ Support/Claude/claude_desktop_config.json && pbcopy < ~/Library/Application\\ Support/Claude/claude_desktop_config.json || (echo '{\\n  \"mcpServers\": {}\\n}' | tee ~/Library/Application\\ Support/Claude/claude_desktop_config.json | pbcopy)"

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setIsLoading(true)
			setUploadStatus("idle")
			const reader = new FileReader()
			reader.onload = (e) => {
				try {
					const content = JSON.parse(e.target?.result as string)
					setJsonContent(content)
					setUploadStatus("success")
				} catch (error) {
					console.error("Error parsing JSON:", error)
					setUploadStatus("error")
				} finally {
					setIsLoading(false)
				}
			}
			reader.readAsText(file)
		}
	}

	const handleSaveAs = async () => {
		try {
			const jsonString = JSON.stringify(jsonContent, null, 2)
			const blob = new Blob([jsonString], { type: "application/json" })
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement("a")
			link.href = url
			link.download = "claude_desktop_config.json"
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Error saving file:", error)
		}
	}

	const handleSaveCommand = () => {
		try {
			const jsonString = JSON.stringify(jsonContent, null, 2)
			// Escape quotes and newlines for shell command
			const escapedJson = jsonString
				.replace(/"/g, '\\"')
				.replace(/\n/g, "\\n")
			const saveCommand = `echo "${escapedJson}" > ~/Library/Application\\ Support/Claude/claude_desktop_config.json`

			navigator.clipboard.writeText(saveCommand)
			setHasCopiedSave(true)
			setTimeout(() => setHasCopiedSave(false), 2000)
		} catch (error) {
			console.error("Error generating save command:", error)
		}
	}

	const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		try {
			const content = JSON.parse(e.target.value)
			setJsonContent(content)
			setUploadStatus("success")
			setIsInstructionsOpen(false) // Close accordion on successful upload
		} catch (error) {
			console.error("Error parsing JSON:", error)
			setUploadStatus("error")
		}
	}

	const handleServerAdd = (serverType: keyof typeof SERVER_CONFIGS) => {
		const serverConfig = SERVER_CONFIGS[serverType]

		if (serverConfig.terminalCommand) {
			setTerminalServers((prev) => [...prev, serverType])
		} else {
			const updatedContent = {
				...jsonContent,
				mcpServers: {
					...jsonContent.mcpServers,
					[serverType]: {
						command: "mcp",
						args: [serverType]
					}
				}
			}
			setJsonContent(updatedContent)
		}
	}

	const handleServerRemove = (serverType: string) => {
		// Remove from terminalServers if present
		if (terminalServers.includes(serverType)) {
			setTerminalServers((prev) => prev.filter((s) => s !== serverType))
		}

		// Remove from mcpServers if present
		if (jsonContent.mcpServers[serverType]) {
			const { [serverType]: _, ...rest } = jsonContent.mcpServers
			setJsonContent({
				...jsonContent,
				mcpServers: rest
			})
		}
	}

	return (
		<main className="max-h-screen p-16">
			<div className="container mx-auto p-4 max-w-3xl">
				<h1 className="text-3xl text-center m-8">
					MCP Manager for Claude Desktop
				</h1>

				<div className="flex justify-center">
					<span className="text-md text-center mb-8">
						This is a simple GUI to manage MCP servers that your
						Claude Desktop App can use.
						<br />
						This app runs entirely client-side in your browser. No
						data is stored or sent to any servers.
						<br />
						<br />
						Learn more about MCP{" "}
						<a
							href="https://modelcontextprotocol.io"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							here
						</a>{" "}
						and{" "}
						<a
							href="https://www.anthropic.com/news/model-context-protocol"
							className="link"
							target="_blank"
							rel="noreferrer"
						>
							here
						</a>
						.
					</span>
				</div>

				<div className="space-y-6">
					<div className="join join-vertical w-full">
						<div className="collapse collapse-arrow join-item border border-base-300 bg-white">
							<input
								type="checkbox"
								checked={isInstructionsOpen}
								onChange={(e) =>
									setIsInstructionsOpen(e.target.checked)
								}
							/>
							<h2 className="collapse-title text-xl ">
								Instructions to load your config file (MacOS)
							</h2>
							<div className="collapse-content">
								<div className="prose">
									<div className="space-y-6">
										<div className="bg-base-200 rounded-lg p-4">
											<div>
												<h3 className="text-md font-tiempos-regular mb-4">
													Step 1: Run this terminal
													command to copy your config
													to your clipboard
												</h3>
												<TerminalCommand
													command={command}
												/>
											</div>
										</div>

										<div className="bg-base-200 rounded-lg p-4">
											<div>
												<h3 className="text-lg font-tiempos-regular mb-4">
													Step 2: Paste the copied
													content below.
												</h3>
												<textarea
													className="textarea textarea-bordered w-full h-16 font-mono"
													placeholder="Paste the copied JSON content here..."
													onChange={handleJsonInput}
												/>
												{uploadStatus === "success" && (
													<div className="mt-2 flex items-center text-primary">
														<Check className="w-5 h-5" />
														<span className="ml-2">
															Uploaded
															successfully.
														</span>
													</div>
												)}
												{uploadStatus === "error" && (
													<div className="mt-2 flex items-center text-error">
														<XCircle className="w-5 h-5" />
														<span className="ml-2">
															Error: Please ensure
															the content is valid
															JSON.
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{Object.keys(jsonContent).length > 0 &&
						uploadStatus === "success" && (
							<div className="space-y-6">
								<MCPServers
									jsonContent={
										jsonContent as {
											mcpServers: Record<
												string,
												{
													command: string
													args: string[]
												}
											>
										}
									}
									onUpdate={setJsonContent}
									onServerAdd={handleServerAdd}
									onServerRemove={handleServerRemove}
								/>

								{/* Only show if there are MCP servers or terminal servers */}
								{(Object.keys(jsonContent.mcpServers).length >
									0 ||
									terminalServers.length > 0) && (
									<div className="join join-vertical w-full">
										<div className="collapse collapse-arrow join-item border border-base-300 bg-white mb-16">
											<input type="checkbox" />
											<h2 className="collapse-title text-xl font-tiempos-regular">
												Apply your changes
											</h2>
											<div className="collapse-content">
												<div className="bg-base-200 rounded-lg p-4">
													<div className="space-y-4">
														<div>
															<h3 className="text-lg font-tiempos-regular mb-4">
																Step 1: Run
																these terminal
																commands
															</h3>

															{/* Only show JSON write command if there are MCP servers */}
															{Object.keys(
																jsonContent.mcpServers
															).length > 0 && (
																<TerminalCommand
																	command={`echo "${JSON.stringify(
																		jsonContent,
																		null,
																		2
																	)
																		.replace(
																			/"/g,
																			'\\"'
																		)
																		.replace(
																			/\n/g,
																			"\\n"
																		)}" > ~/Library/Application\\ Support/Claude/claude_desktop_config.json`}
																/>
															)}

															{/* Show terminal commands for selected servers */}
															{terminalServers.map(
																(
																	serverType
																) => {
																	const serverConfig =
																		SERVER_CONFIGS[
																			serverType as keyof typeof SERVER_CONFIGS
																		]
																	return (
																		<div
																			key={
																				serverType
																			}
																			className="mt-4"
																		>
																			<TerminalCommand
																				command={
																					serverConfig.terminalCommand
																				}
																			/>
																		</div>
																	)
																}
															)}
														</div>
													</div>
												</div>
												<div className="bg-base-200 rounded-lg p-4 mt-4">
													<h3 className="text-lg font-tiempos-regular">
														Step 2: Restart
														Claude.app
													</h3>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
				</div>
				<div className="flex justify-center mt-8">
					<span className="text-sm text-center">
						Made with ❤️ by{" "}
						<a href="https://zue.ai" className="link">
							zue.ai
						</a>{" "}
						- AI automation agency and product studio.
						<br />
						Contact us for AI automation solutions and product
						development -{" "}
						<a href="mailto:hi@zue.ai" className="link">
							hi@zue.ai
						</a>
						<br />
						This project is not affiliated with Anthropic.
					</span>
				</div>
			</div>
		</main>
	)
}

export default App
