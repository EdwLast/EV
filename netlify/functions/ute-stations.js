// Netlify Function: proxy para obtener cargadores UTE
// Recibe { token, body } y hace el request a movilidadelectrica.ute.com.uy
exports.handler = async (event) => {
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

    let token, filterBody;
    try {
        const payload = JSON.parse(event.body || '{}');
        token      = payload.token;
        filterBody = payload.filterBody;
    } catch(e) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Token requerido' }) };

    try {
        const res = await fetch('https://movilidadelectrica.ute.com.uy/api/v2/station/statusFiltered', {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json; charset=utf-8',
                'User-Agent':    'Dart/3.4 (dart:io)',
                'uniquekeyuser': '8590310810698',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(filterBody),
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
