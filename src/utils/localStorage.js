export const saveDraft = (chapterId, title, content) => {
  if (!chapterId) return;
  localStorage.setItem(
    `draft:${chapterId}`,
    JSON.stringify({
      title,
      content,
      updatedAt: Date.now(),
    }),
  );
};

export const loadDraft = (chapterId) => {
  if (!chapterId) return null;
  const data = localStorage.getItem(`draft:${chapterId}`);
  return data ? JSON.parse(data) : null;
};

export const deleteDraft = (chapterId) => {
  if (chapterId) localStorage.removeItem(`draft:${chapterId}`);
};

export const hasDraft = (chapterId) => {
  if (!chapterId) return false;
  return localStorage.getItem(`draft:${chapterId}`) !== null;
};
