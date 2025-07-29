export function dedupeMessages(messages) {
  const map = {};

  for (const msg of messages) {
    map[msg.id || msg.clientMessageId] = msg; 
  }

  return Object.values(map).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at) 
  );
}
