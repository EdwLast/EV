// Netlify Function: proxy para obtener token UTE
// Evita el bloqueo CORS del browser al llamar a la API de UTE
exports.handler = async (event) => {
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

    try {
        const res = await fetch('https://movilidadelectrica.ute.com.uy/api/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json; charset=utf-8',
                'User-Agent':    'Dart/3.4 (dart:io)',
                'uniquekeyuser': '8590310810698',
            },
            body: JSON.stringify({ clientIdIDP: 'cargaME', identifier: 'Anonymous' }),
        });
        const data = await res.text();
        return {
            statusCode: res.status,
            headers: { ...CORS, 'Content-Type': 'application/json' },
            body: data,
        };
    } catch (err) {
        return {
            statusCode: 502,
            headers: { ...CORS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
