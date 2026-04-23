import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Monte à 10 users en 30s
    { duration: '1m',  target: 30 },   // Monte à 30 users pendant 1min
    { duration: '30s', target: 0 },    // Redescend à 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes < 2s
    http_req_failed:   ['rate<0.1'],   // Moins de 10% d'erreurs
  },
};

export default function () {
  const url = 'http://127.0.0.1:54061';

  const res = http.get(url);
  check(res, {
    'status 200': (r) => r.status === 200,
    'response < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}