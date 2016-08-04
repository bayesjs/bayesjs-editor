const rain = {
  id: 'RAIN',
  states: ['T', 'F'],
  parents: [],
  position: { x: 395, y: 80 },
  cpt: { T: 0.2, F: 0.8 },
};

const sprinkler = {
  id: 'SPRINKLER',
  states: ['T', 'F'],
  parents: ['RAIN'],
  position: { x: 160, y: 90 },
  cpt: [
    { when: { RAIN: 'T' }, then: { T: 0.01, F: 0.99 } },
    { when: { RAIN: 'F' }, then: { T: 0.4, F: 0.6 } },
  ],
};

const grassWet = {
  id: 'GRASS_WET',
  states: ['T', 'F'],
  parents: ['RAIN', 'SPRINKLER'],
  position: { x: 230, y: 235 },
  cpt: [
    { when: { RAIN: 'T', SPRINKLER: 'T' }, then: { T: 0.99, F: 0.01 } },
    { when: { RAIN: 'T', SPRINKLER: 'F' }, then: { T: 0.8, F: 0.2 } },
    { when: { RAIN: 'F', SPRINKLER: 'T' }, then: { T: 0.9, F: 0.1 } },
    { when: { RAIN: 'F', SPRINKLER: 'F' }, then: { T: 0, F: 1 } },
  ],
};

export default {
  nodes: [rain, sprinkler, grassWet],
};
