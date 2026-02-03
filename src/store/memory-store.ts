/**
 * In-memory store for telemetry data. Keeps the most recent items.
 */

const MAX_TRACES = 500;
const MAX_METRICS = 200;
const MAX_LOGS = 500;

interface StoredItem<T> {
    data: T;
    receivedAt: number;
}

const traces: StoredItem<unknown>[] = [];
const metrics: StoredItem<unknown>[] = [];
const logs: StoredItem<unknown>[] = [];

function pushWithLimit<T>(arr: StoredItem<T>[], item: StoredItem<T>, max: number): void {
    arr.push(item);
    if (arr.length > max) {
        arr.splice(0, arr.length - max);
    }
}

export function addTrace(data: unknown): void {
    pushWithLimit(traces, { data, receivedAt: Date.now() }, MAX_TRACES);
}

export function addMetrics(data: unknown): void {
    pushWithLimit(metrics, { data, receivedAt: Date.now() }, MAX_METRICS);
}

export function addLogs(data: unknown): void {
    pushWithLimit(logs, { data, receivedAt: Date.now() }, MAX_LOGS);
}

export function getTraces(limit = 100): { data: unknown; receivedAt: number }[] {
    return traces.slice(-limit).reverse();
}

export function getMetrics(limit = 100): { data: unknown; receivedAt: number }[] {
    return metrics.slice(-limit).reverse();
}

export function getLogs(limit = 100): { data: unknown; receivedAt: number }[] {
    return logs.slice(-limit).reverse();
}

export function getStats(): { traces: number; metrics: number; logs: number } {
    return {
        traces: traces.length,
        metrics: metrics.length,
        logs: logs.length,
    };
}
