// 協会けんぽ 都道府県別 健康保険料率（2026年度・令和8年度）
// rateWithoutCare: 介護保険2号被保険者非該当（40歳未満・65歳以上）の健保料率
// rateWithCare:    介護保険2号被保険者該当（40歳以上65歳未満）の健保料率（介護保険料率込み）
// 数値はいずれも料率（例: 0.0985 = 9.85%）
// 労使折半前の全額。被保険者負担はこの半分。

export interface PrefectureRate {
  name: string;
  rateWithoutCare: number;
  rateWithCare: number;
}

export const PREFECTURES: PrefectureRate[] = [
  { name: "北海道",   rateWithoutCare: 0.1028, rateWithCare: 0.1190 },
  { name: "青森",     rateWithoutCare: 0.0985, rateWithCare: 0.1147 },
  { name: "岩手",     rateWithoutCare: 0.0951, rateWithCare: 0.1113 },
  { name: "宮城",     rateWithoutCare: 0.1010, rateWithCare: 0.1172 },
  { name: "秋田",     rateWithoutCare: 0.1001, rateWithCare: 0.1163 },
  { name: "山形",     rateWithoutCare: 0.0975, rateWithCare: 0.1137 },
  { name: "福島",     rateWithoutCare: 0.0950, rateWithCare: 0.1112 },
  { name: "茨城",     rateWithoutCare: 0.0952, rateWithCare: 0.1114 },
  { name: "栃木",     rateWithoutCare: 0.0982, rateWithCare: 0.1144 },
  { name: "群馬",     rateWithoutCare: 0.0968, rateWithCare: 0.1130 },
  { name: "埼玉",     rateWithoutCare: 0.0967, rateWithCare: 0.1129 },
  { name: "千葉",     rateWithoutCare: 0.0973, rateWithCare: 0.1135 },
  { name: "東京",     rateWithoutCare: 0.0985, rateWithCare: 0.1147 },
  { name: "神奈川",   rateWithoutCare: 0.0992, rateWithCare: 0.1154 },
  { name: "新潟",     rateWithoutCare: 0.0921, rateWithCare: 0.1083 },
  { name: "富山",     rateWithoutCare: 0.0959, rateWithCare: 0.1121 },
  { name: "石川",     rateWithoutCare: 0.0970, rateWithCare: 0.1132 },
  { name: "福井",     rateWithoutCare: 0.0971, rateWithCare: 0.1133 },
  { name: "山梨",     rateWithoutCare: 0.0955, rateWithCare: 0.1117 },
  { name: "長野",     rateWithoutCare: 0.0963, rateWithCare: 0.1125 },
  { name: "岐阜",     rateWithoutCare: 0.0980, rateWithCare: 0.1142 },
  { name: "静岡",     rateWithoutCare: 0.0961, rateWithCare: 0.1123 },
  { name: "愛知",     rateWithoutCare: 0.0993, rateWithCare: 0.1155 },
  { name: "三重",     rateWithoutCare: 0.0977, rateWithCare: 0.1139 },
  { name: "滋賀",     rateWithoutCare: 0.0988, rateWithCare: 0.1150 },
  { name: "京都",     rateWithoutCare: 0.0989, rateWithCare: 0.1151 },
  { name: "大阪",     rateWithoutCare: 0.1013, rateWithCare: 0.1175 },
  { name: "兵庫",     rateWithoutCare: 0.1012, rateWithCare: 0.1174 },
  { name: "奈良",     rateWithoutCare: 0.0991, rateWithCare: 0.1153 },
  { name: "和歌山",   rateWithoutCare: 0.1006, rateWithCare: 0.1168 },
  { name: "鳥取",     rateWithoutCare: 0.0986, rateWithCare: 0.1148 },
  { name: "島根",     rateWithoutCare: 0.0994, rateWithCare: 0.1156 },
  { name: "岡山",     rateWithoutCare: 0.1005, rateWithCare: 0.1167 },
  { name: "広島",     rateWithoutCare: 0.0978, rateWithCare: 0.1140 },
  { name: "山口",     rateWithoutCare: 0.1015, rateWithCare: 0.1177 },
  { name: "徳島",     rateWithoutCare: 0.1024, rateWithCare: 0.1186 },
  { name: "香川",     rateWithoutCare: 0.1002, rateWithCare: 0.1164 },
  { name: "愛媛",     rateWithoutCare: 0.0998, rateWithCare: 0.1160 },
  { name: "高知",     rateWithoutCare: 0.1005, rateWithCare: 0.1167 },
  { name: "福岡",     rateWithoutCare: 0.1011, rateWithCare: 0.1173 },
  { name: "佐賀",     rateWithoutCare: 0.1055, rateWithCare: 0.1217 },
  { name: "長崎",     rateWithoutCare: 0.1006, rateWithCare: 0.1168 },
  { name: "熊本",     rateWithoutCare: 0.1008, rateWithCare: 0.1170 },
  { name: "大分",     rateWithoutCare: 0.1008, rateWithCare: 0.1170 },
  { name: "宮崎",     rateWithoutCare: 0.0977, rateWithCare: 0.1139 },
  { name: "鹿児島",   rateWithoutCare: 0.1013, rateWithCare: 0.1175 },
  { name: "沖縄",     rateWithoutCare: 0.0944, rateWithCare: 0.1106 },
];

// 全国共通の料率
export const COMMON_RATES = {
  pensionRate: 0.183,           // 厚生年金保険料率（全国共通）労使折半前
  pensionRateEmployee: 0.0915,  // 厚生年金（被保険者負担分）
  childCareRate: 0.0036,        // 子ども・子育て拠出金率（事業主負担のみ・参考表示用）
  careInsuranceRate: 0.0162,    // 介護保険料率（rateWithCare に既に含まれているため計算には不要）
  childCareSupportRate: 0.0023, // 子ども・子育て支援金率（2026年度新設・労使折半・全国一律）
} as const;
