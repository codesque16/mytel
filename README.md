# MyTel

A lightweight OpenTelemetry (OTLP) receiver and dashboard for viewing traces, metrics, and logs. Perfect for local development, debugging, or capturing telemetry from tools like Claude Code.

## Prerequisites

- **Node.js** 18+ 
- **npm** (comes with Node.js)

## Quick Start

```bash
# Clone the repo
git clone git@github.com:codesque16/mytel.git
cd mytel

# Install dependencies
npm install

# Start the server
npm run dev
```

The server runs on **http://localhost:8010** by default. Open the dashboard at:

**http://localhost:8010/ui/**

## Usage

### OTLP Endpoints

Send telemetry data to these endpoints (standard OTLP/HTTP):

| Signal  | Endpoint                    | Methods |
|---------|-----------------------------|---------|
| Traces  | `http://localhost:8010/v1/traces`  | POST    |
| Metrics | `http://localhost:8010/v1/metrics` | POST    |
| Logs    | `http://localhost:8010/v1/logs`    | POST    |

**Supported formats:**
- `application/json` – JSON payloads
- `application/x-protobuf` – Binary Protobuf (OTLP standard)

### Query API

- `GET /api/traces?limit=100` – Fetch stored traces
- `GET /api/metrics?limit=100` – Fetch stored metrics  
- `GET /api/logs?limit=100` – Fetch stored logs
- `GET /api/stats` – Count of stored items

### Dashboard

The web UI at `/ui/` lets you:

- View **logs** as an event timeline (expand for full attributes)
- Browse **metrics** with values and dimensions
- Inspect **traces** and spans

Data auto-refreshes every 5 seconds. Expanded views and scroll position are preserved during refresh.

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `PORT` | `8010`  | Server port  |

Example:

```bash
PORT=3000 npm run dev
```

## Claude Code Integration

To send Claude Code telemetry to MyTel:

1. Start MyTel: `npm run dev`
2. Source the config and run Claude:

```bash
source claude-tel.sh
```

Or copy the env vars from `claude-tel.sh` into your shell before running `claude`.

## Project Structure

```
mytel/
├── src/
│   ├── index.ts           # Server entry point
│   ├── receivers/         # HTTP receiver (OTLP)
│   ├── proto/             # Protobuf decoder
│   └── store/             # In-memory storage
├── public/
│   └── index.html         # Dashboard UI
├── protos/                # OpenTelemetry proto definitions
├── claude-tel.sh          # Claude Code telemetry config
└── package.json
```

## Data Storage

Data is kept **in-memory** only (last 500 traces, 200 metrics, 500 logs). Restarting the server clears all data. No database or persistent storage is used.

## License

ISC
