export function getDesiredPhrase(phrases: string[], page: number, row: number) {
  const pageSize = 20;
  const desiredPhrase = (page - 1) * pageSize + (row - 1);
  console.log(`Достаем фразу под номером: ${desiredPhrase}`);
  return phrases[desiredPhrase];
}
