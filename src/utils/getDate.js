export const getDate = (obj) => {
  return obj?.createdAt || obj?.created_at || null;
};
