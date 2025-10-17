module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const ideaId = req.query.id;
    const ideaIndex = global.schoolHubData.ideas.findIndex(idea => idea.id === ideaId);

    if (ideaIndex === -1) {
      return res.status(404).json({ error: 'Идея не найдена' });
    }

    if (req.method === 'POST') {
      // Голосование
      const { voter } = req.body;
      const idea = global.schoolHubData.ideas[ideaIndex];

      if (idea.voters.includes(voter)) {
        idea.votes -= 1;
        idea.voters = idea.voters.filter(v => v !== voter);
      } else {
        idea.votes += 1;
        idea.voters.push(voter);
      }

      return res.json({ message: 'Голос учтен!', idea });
    }

    if (req.method === 'DELETE') {
      // Удаление идеи
      global.schoolHubData.ideas[ideaIndex].status = 'deleted';
      global.schoolHubData.ideas[ideaIndex].deletedAt = new Date().toISOString();
      return res.json({ message: 'Идея удалена' });
    }

    if (req.method === 'PATCH') {
      // Восстановление идеи
      global.schoolHubData.ideas[ideaIndex].status = 'active';
      delete global.schoolHubData.ideas[ideaIndex].deletedAt;
      return res.json({ message: 'Идея восстановлена' });
    }

    return res.status(405).json({ error: 'Метод не поддерживается' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};