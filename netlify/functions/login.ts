import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { petName, pin } = await req.json();

    if (!petName || !pin) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
    }

    const id = petName.toLowerCase().trim();
    const store = getStore("users");
    
    const profileStr = await store.get(id);
    
    if (!profileStr) {
      return new Response(JSON.stringify({ error: 'No existe el perfil' }), { status: 404 });
    }
    
    const profile = JSON.parse(profileStr);

    if (profile.pin !== pin) {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), { status: 401 });
    }

    return new Response(JSON.stringify({ success: true, profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
  }
};
