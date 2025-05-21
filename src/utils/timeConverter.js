const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const timeConverter = (createdAt) => {
  const postDate = new Date(createdAt);
  const sec = (Date.now() - postDate.getTime()) / 1000;
  const min = Math.floor(sec / 60);
  const hour = Math.floor(sec / 3600);
  const date = Math.floor(sec / 86400);

  if (date > 5) return new Intl.DateTimeFormat('ko-KR', options).format(postDate);
  if (hour >= 24) return `${date}일 전`;
  if (min >= 60) return `${hour}시간 전`;
  if (sec >= 60) return `${min}분 전`;
  return '방금 전';
};

const isToday = (date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const isYesterday = (date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate() - 1
  );
};

const isInWeek = (date) => {
  const now = new Date();
  const nowDay = Math.floor(now.getTime() / 86400000);
  const postDay = Math.floor(date.getTime() / 86400000);
  const diff = nowDay - postDay;
  return diff >= 0 && diff < 7 && now.getDay() >= date.getDay();
};

const isInMonth = (date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
};

export const convertToTimeType = (createdAt) => {
  if (isToday(createdAt)) return '오늘';
  if (isYesterday(createdAt)) return '어제';
  if (isInWeek(createdAt)) return '이번주';
  if (isInMonth(createdAt)) return '이번달';
  return '오래전';
};

export default timeConverter;
