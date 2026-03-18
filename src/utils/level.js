export function getLevelInfo(totalExp) {
  let level = 1;
  let needExp = 100;

  while (totalExp >= needExp) {
    totalExp -= needExp;
    level++;
    needExp += 50; // 점점 증가
  }

  return {
    level,
    currentExp: totalExp,
    nextExp: needExp,
  };
}