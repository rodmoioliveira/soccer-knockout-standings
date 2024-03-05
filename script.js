const {
  operators: { mergeMap, map, startWith, filter, distinctUntilChanged, scan },
  fromEvent,
  of,
} = rxjs;

/**
 * @description Obtém index do pai de um vértice.
 * @param {number} i Index do vértice.
 * @returns {number}
 */
const parent = i => {
  if (i === 0) {
    return null;
  }
  if (i === 1) {
    return 0;
  }
  return (i - 1) >> 1;
};

/**
 * @description Obtém index do irmão de um vértice.
 * @param {number} i Index do vértice.
 * @returns {number}
 */
const sibling = i => {
  if (i === 0) {
    return 0;
  }
  return i % 2 === 0 ? i - 1 : i + 1;
};

/**
 * @description Obtém descendente da esquerda de um vértice.
 * @param {number} i Index do vértice.
 * @returns {number}
 */
const left = i => (i << 1) + 1;

/**
 * @description Obtém descendente da direita de um vértice.
 * @param {number} i Index do vértice.
 * @returns {number}
 */
const right = i => (i << 1) + 2;

/**
 * @description Cria um objeto para representar um time.
 * @param {number} obj Parâmetros da função.
 * @param {string} obj.name Nome do time.
 * @param {string} obj.scr Url da imagem do time.
 * @returns {object}
 */
const team = ({ name, src }) => ({ name, win: false, played: false, src });

/**
 * @constant
 * @type {object}
 * @description Hashmap com a associação do nome da posição no mata-mata
 * e o index correspondente no heap.
 */
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

/**
 * @constant
 * @type {array}
 * @description Este é o heap propriamente dito. Cada index representa
 * uma posição na árvore binária do mata-mata.
 */
const mataMata = [
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: null, src: null }),
  team({ name: 'Corinthians', src: 'images/corinthians.png' }),
  team({ name: 'Santos', src: 'images/santos.png' }),
  team({ name: 'São Paulo', src: 'images/saopaulo.png' }),
  team({ name: 'Internacional', src: 'images/internacional.svg' }),
  team({ name: 'Grêmio', src: 'images/gremio.svg' }),
  team({ name: 'Bahia', src: 'images/bahia.png' }),
  team({ name: 'Ponte Preta', src: 'images/pontepreta.png' }),
  team({ name: 'Oeste', src: 'images/oeste.png' }),
  team({ name: 'Guarani', src: 'images/guarani.png' }),
  team({ name: 'Palmeiras', src: 'images/palmeiras.png' }),
  team({ name: 'Flamengo', src: 'images/flamengo.png' }),
  team({ name: 'Fluminense', src: 'images/fluminense.png' }),
  team({ name: 'Botafogo', src: 'images/botafogo.png' }),
  team({ name: 'Atlético-Mg', src: 'images/atleticomg.png' }),
  team({ name: 'Bangu', src: 'images/bangu.png' }),
  team({ name: 'Portuguesa', src: 'images/portuguesa.png' }),
].map((pos, i) => {
  return {
    ...pos,
    el: document.getElementById(`id${i}`),
    arrayEl: document.getElementById(`array${i}`),
    imgEl: document.getElementById(`img${i}`),
    imgArray: document.getElementById(`array-img${i}`),
  };
});

/**
 * @type {array}
 * @description Trajetória do campeão anterior.
 */
let prevTrajectory = [];

/**
 * @type {array}
 * @description Trajetória do campeão atual.
 */
let trajectory = [];

/**
 * @description Obtém a trajetória de indexes de um time.
 * @param {number} i Index do vértice.
 */
const getTrajectory = i => {
  let path = [i];
  const { name: winner } = mataMata[i];

  if (winner) {
    while (right(i) < mataMata.length || left(i) < mataMata.length) {
      const l = mataMata[left(i)];
      const r = mataMata[right(i)];

      if (l.name === winner) {
        i = left(i);
        path.push(i);
      }

      if (r.name === winner) {
        i = right(i);
        path.push(i);
      }
    }

    if (trajectory.length) {
      prevTrajectory = trajectory;
    }
    trajectory = path;
  }
};

/**
 * @description Apresenta o caminho de um time no DOM.
 * @param {number} i Index do vértice.
 */
const displayPath = i => {
  mataMata[i].el.setAttribute('data-trajectory', '');
  mataMata[i].arrayEl.setAttribute('data-trajectory', '');
};

/**
 * @description Remove o caminho de um time do DOM.
 * @param {number} i Index do vértice.
 */
const removePath = i => {
  mataMata[i].el.removeAttribute('data-trajectory');
  mataMata[i].arrayEl.removeAttribute('data-trajectory');
};

/**
 * @description Projeta o caminho de um time pelo heap.
 * @param {number} i Index do vértice.
 */
const projectPath = i => {
  const { win, name, src } = mataMata[i];
  const { name: nameToClimb, src: srcToClimb } = win
    ? { name, src }
    : mataMata[sibling(i)];
  const { name: nameToFall } = !win ? { name } : mataMata[sibling(i)];
  const indexes = [];
  const names = [];

  while (i !== 0) {
    const p = parent(i);
    const { name: pName, src: pSrc } = mataMata[p];
    if (pName) {
      indexes.push(p);
      names.push({ name: pName, src: pSrc });
    }
    i = p;
  }

  names.forEach((n, i) => {
    if (n.name === nameToFall || n.name === nameToClimb) {
      mataMata[indexes[i]].name = nameToClimb;
      mataMata[indexes[i]].src = srcToClimb;
    }
  });
};

/**
 * @description Transforma um time em vencedor ou em perdedor.
 * @param {number} i Index do vértice.
 */
const toogleWinner = i => {
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
          src: mataMata[i].src,
        }
      : {
          ...mataMata[p],
          name: mataMata[i].name,
          src: mataMata[i].src,
          win: false,
          played: false,
        };
  }
};

/**
 * @description Renderiza o mata-mata no DOM.
 * @param {array} arr Heap que representa o mata-mata.
 */
const render = arr => {
  arr.forEach((node, i) => {
    node.el.setAttribute('data-win', node.win);
    node.el.setAttribute('data-played', node.played);
    node.arrayEl.setAttribute('data-win', node.win);
    node.arrayEl.setAttribute('data-played', node.played);
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

    if (node.src) {
      node.imgEl.setAttribute('src', node.src);
      node.imgEl.removeAttribute('data-no-src');
      node.imgArray.setAttribute('src', node.src);
      node.imgArray.removeAttribute('data-no-src');
    }
  });
};

/**
 * @description Aplica ou remove highlights.
 * @param {string} action 'setAttribute' || 'removeAttribute'.
 * @param {number} id Id do elemento.
 */
const highlights = (action, id) => {
  document.getElementById(`img${id}`).parentNode[action]('data-outline', '');
  document.getElementById(`array${id}`)[action]('data-outline', '');
  document.getElementById(`index${id}`)[action]('data-outline', '');
};

/**
 * @type {observable}
 * @description Observável para os highlights dos vértices.
 */
fromEvent(document, 'mousemove')
  .pipe(
    map(({ target }) => target.getAttribute('id')),
    map(id => (id ? parseInt(id.replace(/[a-zA-Z-]/g, ''), 10) : null)),
    distinctUntilChanged(),
    scan((acc, cur) => acc.concat(cur), [])
  )
  .subscribe(stack => {
    if (!stack[0]) {
      stack.pop();
    } else {
      highlights('setAttribute', stack[0]);
      if (stack.length > 1) {
        if (!stack[1]) {
          stack.pop();
          highlights('removeAttribute', stack[0]);
          stack.pop();
        } else {
          highlights('removeAttribute', stack[0]);
          stack.shift();
          highlights('setAttribute', stack[0]);
        }
      }
    }
  });

/**
 * @type {observable}
 * @description Observável das interações do usuário com
 * o mata-mata.
 */
of(
  ...[...document.querySelectorAll('[data-key]')],
  ...[...document.querySelectorAll('[data-array-key]')]
)
  .pipe(
    mergeMap(div =>
      fromEvent(div, 'click').pipe(
        map(
          () =>
            positions[
              div.getAttribute('data-key') || div.getAttribute('data-array-key')
            ]
        )
      )
    ),
    startWith(null)
  )
  .subscribe(i => {
    if (i) {
      toogleWinner(i);
      projectPath(i);
      getTrajectory(positions.campeao);
      prevTrajectory.forEach(removePath);
      trajectory.forEach(displayPath);
    }
    render(mataMata);
  });
