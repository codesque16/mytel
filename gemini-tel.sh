# 1. Enable telemetry
export GEMINI_TELEMETRY_ENABLED=1

# 2. Choose exporters (both are optional - configure only what you need)
export GEMINI_TELEMETRY_TARGET="local"       # Options: gcp, local


# 5. For debugging: reduce export intervals
export GEMINI_TELEMETRY_OTLP_ENDPOINT=http://localhost:4318
export GEMINI_TELEMETRY_OTLP_PROTOCOL="http"
export GEMINI_TELEMETRY_LOG_PROMPTS=true

gemini