import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
    decodeTraceRequest,
    decodeMetricsRequest,
    decodeLogsRequest,
} from '../proto/otlp-decoder.js';
import { addTrace, addMetrics, addLogs, getTraces, getMetrics, getLogs, getStats } from '../store/memory-store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OTLP_PROTOBUF = 'application/x-protobuf';
const OTLP_JSON = 'application/json';

export function createHttpReceiver() {
    const app = express();

    // OTLP/HTTP supports both JSON and Binary (protobuf). Use raw body for routes that need both.
    app.use(bodyParser.raw({ type: OTLP_PROTOBUF, limit: '50mb' }));
    app.use(bodyParser.json({ type: OTLP_JSON, limit: '50mb' }));

    // Serve dashboard UI
    app.use('/ui', express.static(join(__dirname, '../../public')));
    app.get('/ui', (_req, res) => res.redirect('/ui/'));

    // Query API
    app.get('/api/traces', (_req, res) => {
        const limit = Math.min(parseInt(_req.query.limit as string) || 100, 500);
        res.json(getTraces(limit));
    });
    app.get('/api/metrics', (_req, res) => {
        const limit = Math.min(parseInt(_req.query.limit as string) || 100, 500);
        res.json(getMetrics(limit));
    });
    app.get('/api/logs', (_req, res) => {
        const limit = Math.min(parseInt(_req.query.limit as string) || 100, 500);
        res.json(getLogs(limit));
    });
    app.get('/api/stats', (_req, res) => {
        res.json(getStats());
    });

    app.post('/v1/traces', async (req, res) => {
        try {
            let data: unknown;
            const contentType = req.headers['content-type'] ?? '';

            if (contentType.includes(OTLP_PROTOBUF)) {
                const buffer = req.body instanceof Buffer ? req.body : Buffer.from(req.body as ArrayBuffer);
                data = await decodeTraceRequest(new Uint8Array(buffer));
            } else {
                data = req.body;
            }

            addTrace(data);
            console.log('--- Received Traces ---');
            console.log(JSON.stringify(data, null, 2));
            res.status(200).json({});
        } catch (err) {
            console.error('Error processing traces:', err);
            res.status(400).json({ error: 'Invalid trace data' });
        }
    });

    app.post('/v1/metrics', async (req, res) => {
        try {
            let data: unknown;
            const contentType = req.headers['content-type'] ?? '';

            if (contentType.includes(OTLP_PROTOBUF)) {
                const buffer = req.body instanceof Buffer ? req.body : Buffer.from(req.body as ArrayBuffer);
                data = await decodeMetricsRequest(new Uint8Array(buffer));
            } else {
                data = req.body;
            }

            addMetrics(data);
            console.log('--- Received Metrics ---');
            console.log(JSON.stringify(data, null, 2));
            res.status(200).json({});
        } catch (err) {
            console.error('Error processing metrics:', err);
            res.status(400).json({ error: 'Invalid metrics data' });
        }
    });

    app.post('/v1/logs', async (req, res) => {
        try {
            let data: unknown;
            const contentType = req.headers['content-type'] ?? '';

            if (contentType.includes(OTLP_PROTOBUF)) {
                const buffer = req.body instanceof Buffer ? req.body : Buffer.from(req.body as ArrayBuffer);
                data = await decodeLogsRequest(new Uint8Array(buffer));
            } else {
                data = req.body;
            }

            addLogs(data);
            console.log('--- Received Logs ---');
            console.log(JSON.stringify(data, null, 2));
            res.status(200).json({});
        } catch (err) {
            console.error('Error processing logs:', err);
            res.status(400).json({ error: 'Invalid logs data' });
        }
    });

    return app;
}
