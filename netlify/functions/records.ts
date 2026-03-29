import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  const method = req.method;
  const store = getStore("records");

  if (method === 'GET') {
    const url = new URL(req.url);
    const profileId = url.searchParams.get('profileId');

    if (!profileId) {
      return new Response(JSON.stringify({ error: 'Missing profileId' }), { status: 400 });
    }

    try {
      // Blobs can be listed by prefix. We retrieve all records with prefix `profileId-`
      const prefix = `${profileId}-`;
      const { blobs } = await store.list({ prefix });
      
      const records = [];
      for (const obj of blobs) {
        const itemStr = await store.get(obj.key);
        if (itemStr) records.push(JSON.parse(itemStr));
      }

      // Sort chronological, newest first
      records.sort((a, b) => b.createdAt - a.createdAt);

      return new Response(JSON.stringify({ records }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'List Error' }), { status: 500 });
    }
  }

  if (method === 'POST') {
    try {
      const body = await req.json();
      const { profileId, by, note } = body;

      if (!profileId || !by) {
        return new Response(JSON.stringify({ error: 'Campos inválidos' }), { status: 400 });
      }

      const recordId = `${profileId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const newRecord = {
        id: recordId,
        profileId,
        by,
        note: note || '',
        fed: true,
        createdAt: Date.now()
      };

      await store.setJSON(recordId, newRecord);
      
      return new Response(JSON.stringify({ success: true, record: newRecord }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};
