export async function onRequestGet(context: any) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      platform: 'Cloudflare Pages Functions',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
