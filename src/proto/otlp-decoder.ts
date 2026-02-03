/**
 * OTLP Protobuf decoder - decodes binary OTLP payloads to JSON-serializable objects
 */
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';
import { dirname, join, isAbsolute } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTOS_PATH = join(__dirname, '../../protos');

let traceRoot: protobuf.Root | null = null;
let metricsRoot: protobuf.Root | null = null;
let logsRoot: protobuf.Root | null = null;

function createRootWithResolvePath(): protobuf.Root {
    const root = new protobuf.Root();
    root.resolvePath = (_origin: string, target: string) => {
        // If target is already absolute, use as-is
        if (isAbsolute(target)) return target;
        // Handle path that lost leading slash (e.g. "Users/.../protos/..." from protobufjs)
        if (target.startsWith('Users/') || target.startsWith('home/')) {
            return join('/', target);
        }
        return join(PROTOS_PATH, target);
    };
    return root;
}

async function loadTraceProto(): Promise<protobuf.Root> {
    if (!traceRoot) {
        const root = createRootWithResolvePath();
        traceRoot = await root.load(
            join(PROTOS_PATH, 'opentelemetry/proto/collector/trace/v1/trace_service.proto')
        );
    }
    return traceRoot;
}

async function loadMetricsProto(): Promise<protobuf.Root> {
    if (!metricsRoot) {
        const root = createRootWithResolvePath();
        metricsRoot = await root.load(
            join(PROTOS_PATH, 'opentelemetry/proto/collector/metrics/v1/metrics_service.proto')
        );
    }
    return metricsRoot;
}

async function loadLogsProto(): Promise<protobuf.Root> {
    if (!logsRoot) {
        const root = createRootWithResolvePath();
        logsRoot = await root.load(
            join(PROTOS_PATH, 'opentelemetry/proto/collector/logs/v1/logs_service.proto')
        );
    }
    return logsRoot;
}

export async function decodeTraceRequest(buffer: Uint8Array): Promise<unknown> {
    const root = await loadTraceProto();
    const ExportTraceServiceRequest = root.lookupType(
        'opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest'
    );
    const message = ExportTraceServiceRequest.decode(buffer);
    return ExportTraceServiceRequest.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
    });
}

export async function decodeMetricsRequest(buffer: Uint8Array): Promise<unknown> {
    const root = await loadMetricsProto();
    const ExportMetricsServiceRequest = root.lookupType(
        'opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest'
    );
    const message = ExportMetricsServiceRequest.decode(buffer);
    return ExportMetricsServiceRequest.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
    });
}

export async function decodeLogsRequest(buffer: Uint8Array): Promise<unknown> {
    const root = await loadLogsProto();
    const ExportLogsServiceRequest = root.lookupType(
        'opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest'
    );
    const message = ExportLogsServiceRequest.decode(buffer);
    return ExportLogsServiceRequest.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
    });
}
