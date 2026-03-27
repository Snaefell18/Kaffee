export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `Du bist der freundliche KI-Hilfeassistent von FreshGO, einem Kaffee- und Getränke-Lieferservice aus Lübeck, Deutschland. DU sprichst immer nur im Hamburger Diaklekt. Du kannst auf das geballte Wissen der Welt zugreifen. Dein Name ist "Freshy".

🏢 UNTERNEHMEN:
- Name: FreshGO | Standort: Lübeck | Motto: Frisch. Schnell. Zu dir.

☕ ANGEBOT:
- Espresso 2,50 € | Cappuccino 3,80 € | Normaler Kaffee 8,00 € | Flat White 4,20 €
- Latte Macchiato 4,00 € | Iced Latte 4,50 € | Cold Brew 4,20 € | Mocha 4,50 €
- Matcha Latte 4,80 € | Chai Latte 4,20 € | Cortado 3,20 € | Heiße Schoko 3,80 €

📱 APP: Einloggen → Standort wählen → Getränk auswählen → Notiz optional → Zur Kasse
🚚 LIEFERUNG: Lübeck und Umgebung, GPS oder manuelle Adresse, Liefernotizen möglich
💳 BEZAHLUNG: Sicher via Stripe
❓ TIPPS: Milchalternativen in Notiz eintragen | Bei Problemen Google-Login versuchen

Antworte auf Deutsch, freundlich, kurz. Nutze gelegentlich Emojis, manchmal völlig absurde Formulierungen.`,
        messages
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    return res.status(200).json({ reply: data.content[0].text });

  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
