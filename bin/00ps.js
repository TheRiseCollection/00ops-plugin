#!/usr/bin/env node

/**
 * 00PS - Normalize command casing for CAPS LOCK mistakes
 * 
 * Usage: 00ps <command> [arguments...]
 * Example: 00ps LS -LA → executes: ls -la
 */

const { spawn } = require('child_process');
const { platform } = require('os');

// Version from package.json (will be replaced during build or read dynamically)
const VERSION = '0.1.0';

/**
 * Normalize command name to lowercase
 * Only normalizes the first token (command name), not arguments
 */
function normalizeCommand(command) {
  if (!command || typeof command !== 'string') {
    return null;
  }
  return command.toLowerCase();
}

/**
 * Parse command line arguments
 * Returns { command, args, help, version }
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  // Handle help/version flags
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    return { help: true };
  }
  
  if (args[0] === '--version' || args[0] === '-v') {
    return { version: true };
  }
  
  // Extract command and arguments
  const command = args[0];
  const commandArgs = args.slice(1);
  
  return { command, args: commandArgs };
}

/**
 * Validate input
 */
function validateInput(command) {
  if (!command) {
    return { valid: false, error: 'Error: No command provided' };
  }
  
  if (typeof command !== 'string') {
    return { valid: false, error: 'Error: Invalid command' };
  }
  
  // Check for empty or whitespace-only command
  if (command.trim().length === 0) {
    return { valid: false, error: 'Error: Command cannot be empty' };
  }
  
  return { valid: true };
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
00PS - Normalize command casing for CAPS LOCK mistakes

Usage:
  00ps <command> [arguments...]

Examples:
  00ps LS              # Executes: ls
  00ps CD /home/user    # Executes: cd /home/user
  00ps GIT STATUS       # Executes: git status
  00ps NPM INSTALL      # Executes: npm install

Options:
  -h, --help     Show this help message
  -v, --version  Show version number

Description:
  00PS normalizes the command name (first token) to lowercase,
  allowing commands typed in CAPS LOCK to execute correctly.
  All arguments and flags are passed through unchanged.

For more information, visit: https://github.com/TheRiseCollection/00ops-plugin
`);
}

/**
 * Show version
 */
function showVersion() {
  console.log(VERSION);
}

/**
 * Execute command with spawn
 */
function executeCommand(command, args) {
  return new Promise((resolve) => {
    // Use shell: true for cross-platform compatibility
    // This allows shell built-ins (cd, export, etc.) to work
    const child = spawn(command, args, {
      stdio: 'inherit',  // Connect to parent's stdin/stdout/stderr
      shell: true        // Use shell for cross-platform support
    });
    
    // Handle process termination
    child.on('close', (code) => {
      // Pass through exit code (or 0 if null/undefined)
      resolve(code || 0);
    });
    
    // Handle spawn errors (command not found, etc.)
    child.on('error', (error) => {
      // Error is already printed to stderr by spawn
      // Exit with code 1 to indicate error
      resolve(1);
    });
  });
}

/**
 * Main function
 */
async function main() {
  const parsed = parseArgs();
  
  // Handle help
  if (parsed.help) {
    showHelp();
    process.exit(0);
  }
  
  // Handle version
  if (parsed.version) {
    showVersion();
    process.exit(0);
  }
  
  // Validate command
  const validation = validateInput(parsed.command);
  if (!validation.valid) {
    console.error(validation.error);
    console.error('Run "00ps --help" for usage information.');
    process.exit(1);
  }
  
  // Normalize command name
  const normalizedCommand = normalizeCommand(parsed.command);
  
  if (!normalizedCommand) {
    console.error('Error: Failed to normalize command');
    process.exit(1);
  }
  
  // Execute command
  const exitCode = await executeCommand(normalizedCommand, parsed.args);
  
  // Exit with command's exit code
  process.exit(exitCode);
}

// Run main function
main().catch((error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
