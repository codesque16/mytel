import { createHttpReceiver } from './receivers/http-receiver.js';

const HTTP_PORT = parseInt(process.env.PORT || '8010', 10);

const httpApp = createHttpReceiver();

httpApp.listen(HTTP_PORT, () => {
    console.log(`OTLP/HTTP Receiver listening on http://localhost:${HTTP_PORT}`);
    console.log(`URL for Traces: http://localhost:${HTTP_PORT}/v1/traces`);
    console.log(`URL for Metrics: http://localhost:${HTTP_PORT}/v1/metrics`);
    console.log(`URL for Logs: http://localhost:${HTTP_PORT}/v1/logs`);
    console.log(`Dashboard: http://localhost:${HTTP_PORT}/ui/`);
});
