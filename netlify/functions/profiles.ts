import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  const method = req.method;
  const store = getStore("profiles");

  if (method === 'GET') {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const petName = url.searchParams.get('petName');

    if (action === 'check') {
      const { blobs } = await store.list();
      return new Response(JSON.stringify({ exists: blobs.length > 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (petName) {
      const id = petName.toLowerCase().trim();
      const profileStr = await store.get(id);
      
      if (!profileStr) {
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
      }
      
      const profile = JSON.parse(profileStr);
      // Remove PIN before sending
      const { pin, ...safeProfile } = profile;
      
      return new Response(JSON.stringify(safeProfile), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  if (method === 'POST') {
    try {
      const body = await req.json();
      const { petName, selectedIcon, emoji, pin } = body;

      if (!petName || !selectedIcon || !emoji || !pin || pin.length !== 4) {
        return new Response(JSON.stringify({ error: 'Campos inválidos' }), { status: 400 });
      }

      const id = petName.toLowerCase().trim();
      
      // Check if already exists
      const existing = await store.get(id);
      if (existing) {
        return new Response(JSON.stringify({ error: 'Ya existe un perfil con ese nombre' }), { status: 400 });
      }

      const newProfile = {
        id,
        petName: petName.trim(),
        selectedIcon,
        emoji,
        pin,
        createdAt: Date.now()
      };

      await store.setJSON(id, newProfile);
      
      return new Response(JSON.stringify({ success: true, profile: newProfile }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};
