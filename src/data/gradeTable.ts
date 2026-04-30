// 協会けんぽ 標準報酬月額 等級表（健康保険50等級・厚生年金32等級）
// grade:           健康保険の等級（1〜50）
// pensionGrade:    厚生年金の等級（1〜32、対応外はnull）
// monthly:         標準報酬月額（円）
// lowerInclusive:  この等級に該当する報酬月額の下限（以上、円）。null は下限なし
// upperExclusive:  この等級に該当する報酬月額の上限（未満、円）。null は上限なし

export interface Grade {
  grade: number;
  pensionGrade: number | null;
  monthly: number;
  lowerInclusive: number | null;
  upperExclusive: number | null;
}

export const GRADE_TABLE: Grade[] = [
  { grade: 1,  pensionGrade: null, monthly:  58000, lowerInclusive:    null, upperExclusive:   63000 },
  { grade: 2,  pensionGrade: null, monthly:  68000, lowerInclusive:   63000, upperExclusive:   73000 },
  { grade: 3,  pensionGrade: null, monthly:  78000, lowerInclusive:   73000, upperExclusive:   83000 },
  { grade: 4,  pensionGrade: 1,    monthly:  88000, lowerInclusive:   83000, upperExclusive:   93000 },
  { grade: 5,  pensionGrade: 2,    monthly:  98000, lowerInclusive:   93000, upperExclusive:  101000 },
  { grade: 6,  pensionGrade: 3,    monthly: 104000, lowerInclusive:  101000, upperExclusive:  107000 },
  { grade: 7,  pensionGrade: 4,    monthly: 110000, lowerInclusive:  107000, upperExclusive:  114000 },
  { grade: 8,  pensionGrade: 5,    monthly: 118000, lowerInclusive:  114000, upperExclusive:  122000 },
  { grade: 9,  pensionGrade: 6,    monthly: 126000, lowerInclusive:  122000, upperExclusive:  130000 },
  { grade: 10, pensionGrade: 7,    monthly: 134000, lowerInclusive:  130000, upperExclusive:  138000 },
  { grade: 11, pensionGrade: 8,    monthly: 142000, lowerInclusive:  138000, upperExclusive:  146000 },
  { grade: 12, pensionGrade: 9,    monthly: 150000, lowerInclusive:  146000, upperExclusive:  155000 },
  { grade: 13, pensionGrade: 10,   monthly: 160000, lowerInclusive:  155000, upperExclusive:  165000 },
  { grade: 14, pensionGrade: 11,   monthly: 170000, lowerInclusive:  165000, upperExclusive:  175000 },
  { grade: 15, pensionGrade: 12,   monthly: 180000, lowerInclusive:  175000, upperExclusive:  185000 },
  { grade: 16, pensionGrade: 13,   monthly: 190000, lowerInclusive:  185000, upperExclusive:  195000 },
  { grade: 17, pensionGrade: 14,   monthly: 200000, lowerInclusive:  195000, upperExclusive:  210000 },
  { grade: 18, pensionGrade: 15,   monthly: 220000, lowerInclusive:  210000, upperExclusive:  230000 },
  { grade: 19, pensionGrade: 16,   monthly: 240000, lowerInclusive:  230000, upperExclusive:  250000 },
  { grade: 20, pensionGrade: 17,   monthly: 260000, lowerInclusive:  250000, upperExclusive:  270000 },
  { grade: 21, pensionGrade: 18,   monthly: 280000, lowerInclusive:  270000, upperExclusive:  290000 },
  { grade: 22, pensionGrade: 19,   monthly: 300000, lowerInclusive:  290000, upperExclusive:  310000 },
  { grade: 23, pensionGrade: 20,   monthly: 320000, lowerInclusive:  310000, upperExclusive:  330000 },
  { grade: 24, pensionGrade: 21,   monthly: 340000, lowerInclusive:  330000, upperExclusive:  350000 },
  { grade: 25, pensionGrade: 22,   monthly: 360000, lowerInclusive:  350000, upperExclusive:  370000 },
  { grade: 26, pensionGrade: 23,   monthly: 380000, lowerInclusive:  370000, upperExclusive:  395000 },
  { grade: 27, pensionGrade: 24,   monthly: 410000, lowerInclusive:  395000, upperExclusive:  425000 },
  { grade: 28, pensionGrade: 25,   monthly: 440000, lowerInclusive:  425000, upperExclusive:  455000 },
  { grade: 29, pensionGrade: 26,   monthly: 470000, lowerInclusive:  455000, upperExclusive:  485000 },
  { grade: 30, pensionGrade: 27,   monthly: 500000, lowerInclusive:  485000, upperExclusive:  515000 },
  { grade: 31, pensionGrade: 28,   monthly: 530000, lowerInclusive:  515000, upperExclusive:  545000 },
  { grade: 32, pensionGrade: 29,   monthly: 560000, lowerInclusive:  545000, upperExclusive:  575000 },
  { grade: 33, pensionGrade: 30,   monthly: 590000, lowerInclusive:  575000, upperExclusive:  605000 },
  { grade: 34, pensionGrade: 31,   monthly: 620000, lowerInclusive:  605000, upperExclusive:  635000 },
  { grade: 35, pensionGrade: 32,   monthly: 650000, lowerInclusive:  635000, upperExclusive:  665000 },
  { grade: 36, pensionGrade: null, monthly: 680000, lowerInclusive:  665000, upperExclusive:  695000 },
  { grade: 37, pensionGrade: null, monthly: 710000, lowerInclusive:  695000, upperExclusive:  730000 },
  { grade: 38, pensionGrade: null, monthly: 750000, lowerInclusive:  730000, upperExclusive:  770000 },
  { grade: 39, pensionGrade: null, monthly: 790000, lowerInclusive:  770000, upperExclusive:  810000 },
  { grade: 40, pensionGrade: null, monthly: 830000, lowerInclusive:  810000, upperExclusive:  855000 },
  { grade: 41, pensionGrade: null, monthly: 880000, lowerInclusive:  855000, upperExclusive:  905000 },
  { grade: 42, pensionGrade: null, monthly: 930000, lowerInclusive:  905000, upperExclusive:  955000 },
  { grade: 43, pensionGrade: null, monthly: 980000, lowerInclusive:  955000, upperExclusive: 1005000 },
  { grade: 44, pensionGrade: null, monthly:1030000, lowerInclusive: 1005000, upperExclusive: 1055000 },
  { grade: 45, pensionGrade: null, monthly:1090000, lowerInclusive: 1055000, upperExclusive: 1115000 },
  { grade: 46, pensionGrade: null, monthly:1150000, lowerInclusive: 1115000, upperExclusive: 1175000 },
  { grade: 47, pensionGrade: null, monthly:1210000, lowerInclusive: 1175000, upperExclusive: 1235000 },
  { grade: 48, pensionGrade: null, monthly:1270000, lowerInclusive: 1235000, upperExclusive: 1295000 },
  { grade: 49, pensionGrade: null, monthly:1330000, lowerInclusive: 1295000, upperExclusive: 1355000 },
  { grade: 50, pensionGrade: null, monthly:1390000, lowerInclusive: 1355000, upperExclusive:    null },
];

// 厚生年金の上限（第32等級・標準報酬月額650,000円）
// 報酬月額が635,000円以上の場合、健保等級は上に行くが厚生年金は32等級で頭打ち
export const PENSION_MAX_MONTHLY = 650000;
