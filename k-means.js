const access_token = 'APROuFj1RJGxDAGVh00HOAA';
    const DataParams_spaceId = 'KIlcuBQR';

 $.getJSON("https://xyz.api.here.com/hub/spaces/" + DataParams_spaceId + "/iterate?access_token=" + access_token).done(async(data)=>{
    let dataset = [];
   let k = 8

function getRandomCentroids(dataset, k) {
  // выбираеv случайные точки в качестве центроидов из набора данных
  const numSamples = dataset.length;
  const centroidsIndex = [];
  let index;
  while (centroidsIndex.length < k) {
    index = randomBetween(0, numSamples);
    if (centroidsIndex.indexOf(index) === -1) {
      centroidsIndex.push(index);
    }
  }
  const centroids = [];
  for (let i = 0; i < centroidsIndex.length; i++) {
    const centroid = [...dataset[centroidsIndex[i]]];
    centroids.push(centroid);
  }
  return centroids;
}
// Назначим метки каждой точке данных на основе центроидов
let labels = getLabels(dataset, centroids);

// Вычислим Квадрат Евклидова Расстояния
function getDistanceSQ(a, b) {
  const diffs = [];
  for (let i = 0; i < a.length; i++) {
    diffs.push(a[i] - b[i]);
  }
  return diffs.reduce((r, e) => (r + (e * e)), 0);
}

// Возвращаем метку для каждого фрагмента данных в наборе данных.
function getLabels(dataSet, centroids) {
  // prep data structure:
  const labels = {};
  for (let c = 0; c < centroids.length; c++) {
    labels[c] = {
      points: [],
      centroid: centroids[c],
    };
  }
   // Для каждого элемента в наборе данных выбераем ближайший центроид. 
  // Сделаем этот центроид меткой элемента.
  for (let i = 0; i < dataSet.length; i++) {
    const a = dataSet[i];
    let closestCentroid, closestCentroidIndex, prevDistance;
    for (let j = 0; j < centroids.length; j++) {
      let centroid = centroids[j];
      if (j === 0) {
        closestCentroid = centroid;
        closestCentroidIndex = j;
        prevDistance = getDistanceSQ(a, closestCentroid);
      } else {
        // получим расстояние:
        const distance = getDistanceSQ(a, centroid);
        if (distance < prevDistance) {
          prevDistance = distance;
          closestCentroid = centroid;
          closestCentroidIndex = j;
        }
      }
    }
 // add point to centroid labels:
    labels[closestCentroidIndex].points.push(a);
  }
  return labels;
}
function getPointsMean(pointList) {
  const totalPoints = pointList.length;
  const means = [];
  for (let j = 0; j < pointList[0].length; j++) {
    means.push(0);
  }
  for (let i = 0; i < pointList.length; i++) {
    const point = pointList[i];
    for (let j = 0; j < point.length; j++) {
      const val = point[j];
      means[j] = means[j] + val / totalPoints;
    }
  }
  return means;
}

function recalculateCentroids(dataSet, labels, k) {
  // Each centroid is the geometric mean of the points that
  // have that centroid's label. Important: If a centroid is empty (no points have
  // that centroid's label) you should randomly re-initialize it.
  let newCentroid;
  const newCentroidList = [];
  for (const k in labels) {
    const centroidGroup = labels[k];
    if (centroidGroup.points.length > 0) {
      // find mean:
      newCentroid = getPointsMean(centroidGroup.points);
    } else {
      // get new random centroid
      newCentroid = getRandomCentroids(dataSet, 1)[0];
    }
    newCentroidList.push(newCentroid);
  }
  return newCentroidList;
}
