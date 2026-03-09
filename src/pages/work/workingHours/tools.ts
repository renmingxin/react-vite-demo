/**
 * 生成 "YYMM-WW" 格式的字符串（年份后两位+月份-当月周数）
 * @param {Date} [date] - 输入日期，默认使用当前日期
 * @param {boolean} [weekStartWithMonday=true] - 周起始日是否为周一（true:周一为第一天，false:周日为第一天）
 * @returns {string} 格式为 "YYMM-WW" 的字符串（例如 "2509-03"）
 */
function formatDateToYYMMWeek(date = new Date(), weekStartWithMonday = true) {
  // 验证日期有效性
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("请输入有效的日期对象");
  }

  // 1. 提取年份后两位（例如 2025 -> "25"）
  const year = date.getFullYear();
  const yearStr = (year % 100).toString().padStart(2, "0"); // 确保两位，补0

  // 2. 提取月份（1-12，格式化为两位，例如 9月 -> "09"）
  const month = date.getMonth() + 1; // getMonth() 返回 0-11，需+1
  const monthStr = month.toString().padStart(2, "0");

  // 3. 计算当月第几周（格式化为两位，例如 3 -> "03"）
  const weekOfMonth = getWeekOfMonth(date, weekStartWithMonday);
  const weekStr = weekOfMonth.toString().padStart(2, "0");

  // 拼接结果
  return `${yearStr}${monthStr}-${weekStr}`;
}

/**
 * 计算日期在当月是第几周
 * @param {Date} date - 目标日期
 * @param {boolean} weekStartWithMonday - 周起始日是否为周一
 * @returns {number} 当月周数（1开始）
 */
function getWeekOfMonth(date, weekStartWithMonday) {
  // 获取当月第一天
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  // 当月第一天是星期几（0=周日，1=周一，...，6=周六）
  const firstDayWeek = firstDayOfMonth.getDay();

  // 计算周起始偏移（调整周一为一周第一天时的偏移量）
  const offset = weekStartWithMonday
    ? firstDayWeek === 0
      ? 6
      : firstDayWeek - 1
    : firstDayWeek;

  // 目标日期是当月的第几天（1开始）
  const dayOfMonth = date.getDate();

  // 计算总天数差（从当月第一天到目标日期的天数）
  const daysDiff = dayOfMonth - 1;

  // 计算周数（向上取整）
  return Math.ceil((daysDiff + offset + 1) / 7);
}

export { formatDateToYYMMWeek };
