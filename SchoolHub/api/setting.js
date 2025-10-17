let data = {
  settings: {
    siteName: "Школьный Хаб",
    siteDescription: "Предложите мероприятие своей мечты. Анонимно или от своего имени.",
    primaryColor: "#3A86FF",
    allowRegistration: true,
    categories: ["sport", "art", "science", "charity", "entertainment", "other"]
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json(data.settings);
  }
  
  if (req.method === 'PUT') {
    try {
      data.settings = { ...data.settings, ...req.body };
      return res.json({ message: 'Настройки обновлены', settings: data.settings });
    } catch (error) {
      console.error('Update settings error:', error);
      return res.status(500).json({ error: 'Ошибка обновления настроек' });
    }
  }
  
  return res.status(405).json({ error: 'Метод не разрешен' });
};