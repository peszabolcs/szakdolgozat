export const formatDistanceToNow = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} másodperce`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} perce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} órája`;
  return `${Math.floor(diffInSeconds / 86400)} napja`;
};
