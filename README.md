# 00PS

> A CLI utility that allows shell commands typed in CAPS LOCK to execute correctly by normalizing casing.

## The Problem

Have you ever typed a shell command with CAPS LOCK on? You get an error because `LS` doesn't exist—you meant `ls`. Or `CD` fails when you meant `cd`. This is a small but frequent frustration in daily development work.

00PS solves this by normalizing the command name to lowercase before execution.

## Installation

```bash
npm install -g 00ps
```

## Usage

```bash
00ps <command> [arguments...]
```

### Examples

```bash
# Basic command
00ps LS
# Executes: ls

# With arguments
00ps CD /home/user
# Executes: cd /home/user

# With flags
00ps GIT STATUS
# Executes: git status

# Complex command
00ps NPM INSTALL EXPRESS
# Executes: npm install express
```

## How It Works

00PS normalizes **only the first token** (the command name) to lowercase. All arguments, flags, and paths are passed through unchanged.

- `00ps LS -LA` → executes `ls -la`
- `00ps CD /HOME/USER` → executes `cd /HOME/USER` (path unchanged)

## Options

- `-h, --help` - Show help message
- `-v, --version` - Show version number

## Cross-Platform Support

Works on:
- Windows (cmd.exe, PowerShell)
- macOS
- Linux

## Limitations

- Only the first command in a pipeline is normalized
- Paths are not normalized (they may be case-sensitive)
- Shell built-ins work via `shell: true` option

## Exit Codes

- `0` - Command executed successfully
- `1-255` - Command's exit code (passed through)
- `1` - 00PS error (invalid usage, etc.)

## Safety & Security

00PS executes commands as requested. Only run commands you trust. The tool:
- Uses `spawn` with argument arrays (not string concatenation)
- Passes arguments through without modification
- Inherits your environment (doesn't modify it)

## Development

```bash
# Run locally
npm start

# Test
npm test
```

## License

MIT

## Repository

[https://github.com/TheRiseCollection/00ops-plugin](https://github.com/TheRiseCollection/00ops-plugin)

---

**Part of [Rise World](https://riseworld.dev)** - A developer lab for building, documenting, and sharing tools.
