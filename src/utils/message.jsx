const mergeAndDeduplicate = (cached, fresh) => {
  const seen = new Set();
  return [...cached, ...fresh]
    .filter(msg => {
      if (!msg?.item_id) return false;
      if (seen.has(msg.item_id)) return false;
      seen.add(msg.item_id);
      return true;
    })
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

export default mergeAndDeduplicate;
