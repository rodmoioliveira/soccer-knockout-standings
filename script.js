const {
  operators: { mergeMap, map, startWith },
  fromEvent,
  of,
} = rxjs;

const parent = i => {
  if (i === 0) {
    return null;
  }
  if (i === 1) {
    return 0;
  }
  return (i - 1) >> 1;
};
const sibling = i => {
  if (i === 0) {
    return 0;
  }
  return i % 2 === 0 ? i - 1 : i + 1;
};
const left = i => (i << 1) + 1;
const right = i => (i << 1) + 2;
const team = name => ({ name, win: false, played: false });
const positions = {
  campeao: 0,
  final_time1: 1,
  final_time2: 2,
  semifinal1_time1: 3,
  semifinal1_time2: 4,
  semifinal2_time1: 5,
  semifinal2_time2: 6,
  quartas1_time1: 7,
  quartas1_time2: 8,
  quartas2_time1: 9,
  quartas2_time2: 10,
  quartas3_time1: 11,
  quartas3_time2: 12,
  quartas4_time1: 13,
  quartas4_time2: 14,
  oitavas1_time1: 15,
  oitavas1_time2: 16,
  oitavas2_time1: 17,
  oitavas2_time2: 18,
  oitavas3_time1: 19,
  oitavas3_time2: 20,
  oitavas4_time1: 21,
  oitavas4_time2: 22,
  oitavas5_time1: 23,
  oitavas5_time2: 24,
  oitavas6_time1: 25,
  oitavas6_time2: 26,
  oitavas7_time1: 27,
  oitavas7_time2: 28,
  oitavas8_time1: 29,
  oitavas8_time2: 30,
};

const mataMata = [
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team(null),
  team('Corinthians'),
  team('Santos'),
  team('São Paulo'),
  team('Internacional'),
  team('Grêmio'),
  team('Bahia'),
  team('Ponte Preta'),
  team('Oeste'),
  team('Guarani'),
  team('Palmeiras'),
  team('Flamengo'),
  team('Fluminense'),
  team('Botafogo'),
  team('Atlético-Mg'),
  team('Bangu'),
  team('Portuguesa'),
].map((pos, i) => {
  return {
    ...pos,
    el: document.getElementById(`id${i}`),
    arrayEl: document.getElementById(`array${i}`),
  };
});
let prevTrajectory = [];
let trajectory = [];

const getTrajectory = key => {
  let index = positions[key];
  let path = [index];
  const { name: winner } = mataMata[index];

  if (winner) {
    while (right(index) < mataMata.length || left(index) < mataMata.length) {
      const l = mataMata[left(index)];
      const r = mataMata[right(index)];

      if (l.name === winner) {
        index = left(index);
        path.push(index);
      }

      if (r.name === winner) {
        index = right(index);
        path.push(index);
      }
    }

    if (trajectory.length) {
      prevTrajectory = trajectory;
    }
    trajectory = path;
  }
};

const displayTrajectory = i => {
  mataMata[i].el.setAttribute('data-trajectory', '');
  mataMata[i].arrayEl.setAttribute('data-trajectory', '');
};

const removeTrajectory = i => {
  mataMata[i].el.removeAttribute('data-trajectory');
  mataMata[i].arrayEl.removeAttribute('data-trajectory');
};

const setTrail = key => {
  let index = positions[key];
  const { win, name } = mataMata[index];
  const nameToClimb = win ? name : mataMata[sibling(index)].name;
  const nameToFall = !win ? name : mataMata[sibling(index)].name;
  const trailIndex = [];
  const trailName = [];

  while (index !== 0) {
    const p = parent(index);
    const pName = mataMata[p].name;
    if (pName) {
      trailIndex.push(p);
      trailName.push(pName);
    }
    index = p;
  }

  trailName.forEach((n, i) => {
    if (n === nameToFall || n === nameToClimb) {
      mataMata[trailIndex[i]].name = nameToClimb;
    }
  });
};

const toogleWinner = key => {
  const i = positions[key];

  if (mataMata[i].name) {
    const status = mataMata[i].win;
    const sib = sibling(i);
    const p = parent(i);

    mataMata[i].win = !status;
    mataMata[sib].win = !!status;

    mataMata[i].played = true;
    mataMata[sib].played = true;
    mataMata[p] = mataMata[p].name
      ? {
          ...mataMata[p],
          name: mataMata[i].name,
        }
      : {
          ...mataMata[p],
          name: mataMata[i].name,
          win: false,
          played: false,
        };
  }
};

const render = arr => {
  arr.forEach((node, i) => {
    node.el.innerText = node.name;
    node.el.setAttribute('data-win', node.win);
    node.el.setAttribute('data-played', node.played);
    node.arrayEl.setAttribute('data-win', node.win);
    node.arrayEl.setAttribute('data-played', node.played);
    node.el.innerText = node.name;
    node.el[
      node.name && arr[sibling(i)].name && i !== 0
        ? 'removeAttribute'
        : 'setAttribute'
    ]('data-disable', '');
    node.arrayEl[
      node.name && arr[sibling(i)].name && i !== 0
        ? 'removeAttribute'
        : 'setAttribute'
    ]('data-disable', '');

    if (i === 0 && node.name) {
      node.el.setAttribute('data-win', true);
      node.el.setAttribute('data-played', true);
      node.arrayEl.setAttribute('data-win', true);
      node.arrayEl.setAttribute('data-played', true);
    }
  });
};

of(
  ...[...document.querySelectorAll('[data-key]')],
  ...[...document.querySelectorAll('[data-array-key]')]
)
  .pipe(
    mergeMap(div =>
      fromEvent(div, 'click').pipe(
        map(() => {
          const position =
            div.getAttribute('data-key') || div.getAttribute('data-array-key');
          return {
            index: positions[position],
            position,
          };
        })
      )
    ),
    startWith({ position: null })
  )
  .subscribe(val => {
    if (val.position) {
      toogleWinner(val.position);
      setTrail(val.position);
      getTrajectory('campeao');
      prevTrajectory.forEach(removeTrajectory);
      trajectory.forEach(displayTrajectory);
    }
    render(mataMata);
  });
