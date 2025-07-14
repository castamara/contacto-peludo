export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { chatHistory, systemInstruction } = req.body;

  // Lee la clave de API de forma segura desde las variables de entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [systemInstruction, ...chatHistory],
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error('Gemini API Error:', errorData);
      return res.status(apiResponse.status).json({ error: `API Error: ${errorData}` });
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Failed to fetch from Gemini API.' });
  }
}
