"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [cnt, setCnt] = useState(0);
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "ヒトカゲ",
      isSeed: true,
      isPokemon: true,
    },
    {
      id: 2,
      name: "ヒトカゲ",
      isSeed: true,
      isPokemon: true,
    },
    {
      id: 3,
      name: "リザードンex",
      isSeed: false,
      isPokemon: true,
    },
    {
      id: 4,
      name: "リザードンex",
      isSeed: false,
      isPokemon: true,
    },
    {
      id: 5,
      name: "ふしぎなアメ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 6,
      name: "ふしぎなアメ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 7,
      name: "博士の研究",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 8,
      name: "博士の研究",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 9,
      name: "ポケモン通信",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 10,
      name: "ポケモン通信",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 11,
      name: "ナンジャモ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 12,
      name: "ナンジャモ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 13,
      name: "リザード",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 14,
      name: "リザード",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 15,
      name: "モンスターボール",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 16,
      name: "モンスターボール",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 17,
      name: "ナツメ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 18,
      name: "ナツメ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 19,
      name: "アカギ",
      isSeed: false,
      isPokemon: false,
    },
    {
      id: 20,
      name: "アカギ",
      isSeed: false,
      isPokemon: false,
    },
  ]);
  const [skewness, setSkewness] = useState(0);
  const [kurtosis, setKurtosis] = useState(0);

  const [hands, setHands] = useState([]);
  const [deck, setDeck] = useState([]);
  const [trash, setTrash] = useState([]);
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    title: {
      display: true,
      text: "タイトル",
    },
  });
  const [outliers, setOutliers] = useState({
    lowerOutliers: [],
    upperOutliers: [],
  });
  const [above232Percentage, setAbove232Percentage] = useState(0);

  const [median, setMedian] = useState(0);
  const [avg, setAvg] = useState(0);

  const [okCnt, setOkCnt] = useState(0);

  const [labels, setLabels] = useState([]);

  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "10000回500戦してリザードンexが最速進化した結果",
        data: [],
        backgroundColor: "rgba(255,99,132,0.5",
      },
    ],
  });

  const [cumulativePercentiles, setCumulativePercentiles] = useState([]);

  const [quartiles, setQuartiles] = useState({ Q1: 0, Q2: 0, Q3: 0 });

  const [activeP, setActiveP] = useState(0);

  function shuffleArray(array) {
    const shuffled = [...array]; // 元の配列をコピー
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0からiの間のランダムなインデックスを取得
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 要素を交換
    }
    return shuffled; // シャッフルされた配列を返す
  }

  function draw(deck, hands, count) {
    const updated = [...deck];
    const newHands = [...hands, ...updated.splice(0, count)];
    const newDeck = [...deck.splice(count)];

    return { newHands, newDeck };
  }

  function isOk(newTrash, newHands) {
    return (
      newTrash.some((v) => v.name === "ヒトカゲ") &&
      newHands.some((v) => v.name === "リザードンex") &&
      newHands.some((v) => v.name === "ふしぎなアメ")
    );
  }

  function handleRotom(hands, deck, trash, one = false) {
    if (one) {
      if (
        !isCard(hands, "ロトム図鑑") ||
        (isCard(hands, "ナンジャモ") && !isCard(hands, "博士の研究"))
      )
        return { newHands: hands, newDeck: deck, newTrash: trash };

      const topCard = deck[0];

      const rotomCard = hands.find((card) => card.name === "ロトム図鑑");

      const newHands = hands.filter((card) => card.name !== rotomCard);
      const newTrash = [...trash, rotomCard];

      if (
        (topCard === isCard(newHands, "リザードンex") &&
          !isHandName(newHands, "リザードンex")) ||
        (topCard === isCard(newHands, "ふしぎなアメ") &&
          !isHandName(newHands, "ふしぎなアメ")) ||
        (topCard === isCard(newHands, "ポケモン通信") &&
          !isHandName(newHands, "ポケモン通信") &&
          ((isCard(newHands, "博士の研究") &&
            isCard(newHands, "ふしぎなアメ")) ||
            (isCard(newHands, "博士の研究") && isCardInPokemon(newHands)) ||
            (isCard(newHands, "ふしぎなアメ") && isCardInPokemon(newHands)))) ||
        topCard === isCard(newHands, "博士の研究") ||
        (topCard === isCard(newHands, "ナンジャモ") &&
          !isHandName(newHands, "ナンジャモ") &&
          !isHandName(newHands, "博士の研究") &&
          !(
            isCard(newHands, "ふしぎなアメ") &&
            isCard(newHands, "ポケモン通信") &&
            isCardInPokemon(newHands)
          ))
      ) {
        return { newHands, newDeck: deck, newTrash };
      }
    }

    if (!isCard(hands, "博士の研究") || !isCard(hands, "ロトム図鑑"))
      return { newHands: hands, newDeck: deck, newTrash: trash };

    const rotomCard = hands.find((card) => card.name === "ロトム図鑑");

    const newHands = hands.filter((card) => card.name !== rotomCard);
    const newTrash = [...trash, rotomCard];

    // deckの先頭を確認
    const topCard = deck[0];
    if (
      (topCard === isCard(newHands, "リザードンex") &&
        !isHandName(newHands, "リザードンex")) ||
      (topCard === isCard(newHands, "ふしぎなアメ") &&
        !isHandName(newHands, "ふしぎなアメ")) ||
      (topCard === isCard(newHands, "ポケモン通信") &&
        !isHandName(newHands, "ポケモン通信") &&
        !isCard(newHands, "ふしぎなアメ")) ||
      (topCard === isCardInPokemon(newHands) &&
        !isCard(newHands, "ふしぎなアメ"))
    ) {
      return { newHands, newDeck: deck, newTrash };
    }

    const newDeck = shuffleArray(deck);

    return { newHands, newDeck, newTrash };
  }

  function handleMonsterBall(hands, deck, trash) {
    if (!deck.some((v) => v.isSeed) || !isCard(hands, "モンスターボール"))
      return { newHands: hands, newDeck: deck, newTrash: trash };

    let { newHands, newTrash } = useCard("モンスターボール", hands, trash);
    const seedPokemon = shuffleArray([...deck.filter((v) => v.isSeed)])[0];
    const newDeck = [...deck.filter((v) => v.id !== seedPokemon.id)];
    newHands = [...newHands, seedPokemon];

    return { newHands, newDeck, newTrash };
  }

  function isHandName(hands, cardName) {
    return hands.some((v) => v.name === cardName);
  }

  function useCard(cardName, hands, trash) {
    const target = hands.find((v) => v.name === cardName);
    if (!target) return { newHands: hands, newTrash: trash }; // カードが見つからない場合はそのまま返す

    const newHands = hands.filter((v) => v.id !== target.id);
    const newTrash = [...trash, target];

    return { newHands, newTrash };
  }

  function handleIono(hands, deck, trash, candy = false) {
    if (
      candy &&
      isCard(hands, "ふしぎなアメ") &&
      isCard(hands, "ポケモン通信") &&
      isCardInPokemon(hands)
    )
      return { newDeck: deck, newTrash: trash, newHands: hands };

    let { newHands, newTrash } = useCard("ナンジャモ", hands, trash);
    const handsNum = newHands.length;
    const newDeck = shuffleArray([...deck, ...newHands]).splice(handsNum);

    return { newDeck, newTrash, newHands };
  }

  function isCard(hands, cardName) {
    return hands.some((card) => card.name === cardName);
  }

  function isCardInPokemon(hands) {
    return hands.some((v) => v.isPokemon);
  }

  function handlePokemonCommunication(hands, deck, trash) {
    if (
      !isCard(hands, "ポケモン通信") ||
      !isCardInPokemon(hands) ||
      isCard(hands, "リザードンex") ||
      !deck.some((v) => v.isPokemon)
    )
      return { newHands: hands, newDeck: deck, newTrash: trash };

    let { newTrash, newHands } = useCard("ポケモン通信", hands, trash);

    const pokemon = deck.filter((v) => v.isPokemon)[0];

    const handPokemon = newHands.filter((v) => v.isPokemon)[0];

    let newDeck = shuffleArray([
      ...deck.filter((v) => v.id !== pokemon.id),
      handPokemon,
    ]);

    newHands = [...newHands.filter((v) => v.id !== handPokemon.id), pokemon];

    return { newHands, newDeck, newTrash };
  }

  useEffect(() => {
    let updatedOkCnt = 0;
    let updateLabels = [];
    const updatedData = {
      labels: updateLabels,
      datasets: [
        {
          label: "10000回500戦してリザードンexが最速進化した結果",
          data: [],
          backgroundColor: "rgba(255,99,132,0.5)",
        },
      ],
    };
    let activePoint = 0;
    for (let j = 0; j < 10000; j++) {
      let upCnt = 0;

      // 1戦の設定
      for (let i = 0; i < 500; i++) {
        let newDeck = [...cards];
        let newTrash = [newDeck[0]];
        let updated;
        let newHands = [];

        newDeck = shuffleArray(newDeck.splice(1));

        ({ newHands, newDeck } = draw(newDeck, newHands, 5));

        if (isOk(newTrash, newHands)) {
          upCnt++;
          continue;
        } else {
          ({ newDeck, newHands, newTrash } = handleRotom(
            newHands,
            newDeck,
            newTrash,
            true
          ));

          ({ newDeck, newHands, newTrash } = handleMonsterBall(
            newHands,
            newDeck,
            newTrash
          ));

          switch (true) {
            case isHandName(newHands, "博士の研究"):
              ({ newHands, newDeck } = draw(newDeck, newHands, 2));
              ({ newHands, newTrash } = useCard(
                "博士の研究",
                newHands,
                newTrash
              ));
              break;

            default:
              // どの条件にも一致しない場合の処理（必要なら記述）
              break;
          }
        }

        // 2ターン目
        ({ newHands, newDeck } = draw(newDeck, newHands, 1));

        ({ newDeck, newHands, newTrash } = handleRotom(
          newHands,
          newDeck,
          newTrash
        ));

        ({ newDeck, newHands, newTrash } = handleMonsterBall(
          newHands,
          newDeck,
          newTrash
        ));

        if (isOk(newTrash, newHands)) {
          upCnt++;
          continue;
        } else {
          switch (true) {
            case isHandName(newHands, "博士の研究"):
              ({ newHands, newDeck } = draw(newDeck, newHands, 2));
              ({ newHands, newTrash } = useCard(
                "博士の研究",
                newHands,
                newTrash
              ));
              break;

            case isHandName(newHands, "ナンジャモ"):
              ({ newHands, newDeck, newTrash } = handleIono(
                newHands,
                newDeck,
                newTrash,
                true
              ));
              break;

            default:
              // どの条件にも一致しない場合の処理（必要なら記述）
              break;
          }
        }
        ({ newHands, newDeck, newTrash } = handlePokemonCommunication(
          newHands,
          newDeck,
          newTrash
        ));
        if (isOk(newTrash, newHands)) {
          upCnt++;
          continue;
        }
      }

      if (updateLabels.some((v) => v === upCnt)) {
        ++updatedData.datasets[0].data[
          updateLabels.findIndex((v) => v === upCnt)
        ];
      } else {
        updateLabels = [...updateLabels, upCnt].sort((a, b) => a - b);

        updatedData.datasets[0].data.splice(
          updateLabels.findIndex((v) => v === upCnt),
          0,
          1
        );
        updatedData.labels = updateLabels;
      }
      if (232 <= upCnt) activePoint++;
      updatedOkCnt += upCnt;
    }
    setOkCnt(updatedOkCnt);

    setMedian((prev) => calculateMedian(updatedData.datasets[0].data));
    setAvg((prev) => calculateAverage(updatedData.datasets[0].data));
    setData((prev) => updatedData);
    setLabels((prev) => updateLabels);
    setActiveP((prev) => activePoint);

    setQuartiles((prev) => calculateQuartiles(updatedData.datasets[0].data));
    setOutliers((prev) => calculateOutliers(updatedData.datasets[0].data));
    setSkewness((prev) => calculateSkewness(updatedData.datasets[0].data));
    setKurtosis((prev) => calculateKurtosis(updatedData.datasets[0].data));

    const percentiles = calculateCumulativePercentiles(
      updateLabels,
      updatedData.datasets[0].data
    );
    setCumulativePercentiles(percentiles);

    const percentage = calculateAboveThresholdPercentage(
      updateLabels,
      updatedData.datasets[0].data,
      232
    );
    setAbove232Percentage(percentage);
  }, []);

  function calculateAverage(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const sum = data.reduce((acc, value) => acc + value, 0); // 配列の合計を計算
    return sum / data.length; // 合計を配列の長さで割る
  }

  function calculateMedian(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const sortedData = [...data].sort((a, b) => a - b); // 昇順にソート
    const mid = Math.floor(sortedData.length / 2);

    if (sortedData.length % 2 === 0) {
      // 配列の長さが偶数の場合
      return (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
      // 配列の長さが奇数の場合
      return sortedData[mid];
    }
  }

  function calculateMedian(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const sortedData = [...data].sort((a, b) => a - b); // 昇順にソート
    const mid = Math.floor(sortedData.length / 2);

    if (sortedData.length % 2 === 0) {
      // 配列の長さが偶数の場合
      return (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
      // 配列の長さが奇数の場合
      return sortedData[mid];
    }
  }

  function calculatePoint() {
    // 定数の設定
    const totalCount = 500; // 試合数
    const winP = 10; // 勝利ポイント
    const loseP = -7; // 敗北ポイント
    const targetPoint = 440; // 目標ポイント

    let maxY = 0; // 最大の敗北数
    let result = { x: 0, y: 0 }; // 結果を格納するオブジェクト

    // ループで条件を満たす x, y を探索
    for (let x = 0; x <= totalCount; x++) {
      const y = totalCount - x; // 敗北数は試合数から勝利数を引いたもの
      const totalPoints = winP * x + loseP * y; // 総ポイントを計算

      if (totalPoints >= targetPoint && y > maxY) {
        maxY = y; // 最大の敗北数を更新
        result = { x, y }; // 結果を更新
      }
    }

    return maxY;
  }

  function calculateStandardDeviation(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const mean = calculateAverage(data); // 平均値を計算
    const variance =
      data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) /
      data.length; // 分散を計算

    return Math.sqrt(variance); // 分散の平方根を取る
  }

  function calculateQuartiles(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const sortedData = [...data].sort((a, b) => a - b); // 昇順にソート
    const mid = Math.floor(sortedData.length / 2);

    const median = calculateMedian(sortedData); // 中央値 (Q2)

    const lowerHalf = sortedData.slice(0, mid); // 下位50%
    const upperHalf =
      sortedData.length % 2 === 0
        ? sortedData.slice(mid)
        : sortedData.slice(mid + 1); // 上位50%

    const Q1 = calculateMedian(lowerHalf); // 第1四分位数
    const Q3 = calculateMedian(upperHalf); // 第3四分位数

    return { Q1, Q2: median, Q3 };
  }

  function calculateOutliers(data) {
    if (data.length === 0) return { lowerOutliers: [], upperOutliers: [] }; // データが空の場合

    const { Q1, Q3 } = calculateQuartiles(data); // 四分位数を計算
    const IQR = Q3 - Q1; // 四分位範囲を計算

    const lowerLimit = Q1 - 1.5 * IQR; // 下限
    const upperLimit = Q3 + 1.5 * IQR; // 上限

    // 外れ値を抽出
    const lowerOutliers = data.filter((value) => value < lowerLimit);
    const upperOutliers = data.filter((value) => value > upperLimit);

    return { lowerOutliers, upperOutliers };
  }

  function calculateCumulativePercentiles(labels, data) {
    if (data.length === 0) return []; // データが空の場合は空配列を返す

    const pairs = [...labels.map((v, i) => ({ label: v, value: data[i] }))];

    const sortedData = [...pairs].sort((a, b) => a.labels - b.labels); // 昇順にソート
    const total = sortedData.reduce((acc, value) => acc + value.value, 0); // 合計を計算

    let cumulativeSum = 0;
    return sortedData.map(({ value }) => {
      cumulativeSum += value; // 累積和を計算
      return (cumulativeSum / total) * 100; // 累積割合（パーセンタイル）を計算
    });
  }

  function calculateSkewness(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const mean = calculateAverage(data); // 平均値を計算
    const n = data.length;
    const numerator =
      data.reduce((acc, value) => acc + Math.pow(value - mean, 3), 0) / n;
    const denominator = Math.pow(
      data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / n,
      1.5
    );

    return numerator / denominator; // 歪度を計算
  }

  function calculateKurtosis(data) {
    if (data.length === 0) return null; // データが空の場合は null を返す

    const mean = calculateAverage(data); // 平均値を計算
    const n = data.length;
    const numerator =
      data.reduce((acc, value) => acc + Math.pow(value - mean, 4), 0) / n;
    const denominator = Math.pow(
      data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / n,
      2
    );

    return numerator / denominator; // 尖度を計算
  }

  function calculateAboveThresholdPercentage(labels, data, threshold) {
    if (data.length === 0) return 0; // データが空の場合は0を返す

    const total = 10000; // データの総数

    const pairs = [
      ...labels.map((label, index) => ({
        label,
        value: data[index],
      })),
    ];

    return (
      (pairs
        .filter((v) => v.label >= threshold)
        .reduce((acc, value) => acc + value.value, 0) *
        100) /
      total
    );
  }

  return (
    <div className="">
      {!data.datasets[0].length && (
        <div className="spinner">
          <div className="loading-circle"></div>
          <p>データの計算には数秒~数分かかります</p>
        </div>
      )}
      <Bar options={options} data={data} />
      <div>{calculatePoint()}</div>
      <div>リザードンに進化した回数{(100 * okCnt) / (500 * 10000)}%</div>
      {/* 268回負けてもいい */}
      <div>10,000回中{activeP}回</div>
      <div>{activeP / 10000}%</div>
      <div>データ数{data.datasets[0].data.length}</div>
      <div>平均値{avg}</div>
      <div>中央値{median}</div>
      <div>標準偏差{calculateStandardDeviation(data.datasets[0].data)}</div>
      <div>第1四分位数: {quartiles.Q1}</div>
      <div>中央値 (第2四分位数): {quartiles.Q2}</div>
      <div>第3四分位数: {quartiles.Q3}</div>
      <div>下限外れ値: {outliers.lowerOutliers.join(", ")}</div>
      <div>上限外れ値: {outliers.upperOutliers.join(", ")}</div>
      <div>歪度: {skewness.toFixed(2)}</div>
      <div>尖度: {kurtosis.toFixed(2)}</div>
      <div>232以上の累積割合: {above232Percentage.toFixed(2)}%</div>
      <div>
        累積割合:
        {cumulativePercentiles.map((percentile, index) => (
          <div key={index}>
            {labels[index]}: {percentile.toFixed(2)}%
          </div>
        ))}
      </div>
      <div>データ</div>
      {data &&
        data.datasets[0].data.map((v, i) => (
          <div key={i}>
            {labels[i]}: {v}
          </div>
        ))}
    </div>
  );
}
