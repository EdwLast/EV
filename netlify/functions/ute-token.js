const https = require('https');

function postJson(url, headers, body) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const bodyStr = JSON.stringify(body);
        const options = {
            hostname: u.hostname, port: 443,
            path: u.pathname, method: 'POST',
            headers: { ...headers, 'Content-Length': Buffer.byteLength(bodyStr) },
        };
        const req = https.request(options, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
}

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    try {
        const r = await postJson(
            'https://movilidadelectrica.ute.com.uy/api/v2/token',
            {
                'Content-Type':  'application/json; charset=utf-8',
                'User-Agent':    'Dart/3.4 (dart:io)',
                'uniquekeyuser': '8590310810698',
            },
            { clientIdIDP: 'cargaME', identifier: 'Anonymous' }
        );
        return { statusCode: r.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: r.body };
    } catch (err) {
        return { statusCode: 502, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
    }
};
