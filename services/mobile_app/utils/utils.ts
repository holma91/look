type DomainProps = {
  name: string;
  icon: any;
  multiBrand: boolean;
  secondHand: boolean;
  highEnd: boolean;
};

// Predefined domains

export const domainToInfo: { [key: string]: DomainProps } = {
  'zalando.se': {
    name: 'Zalando',
    icon: require('../assets/logos/zalando.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  'zara.com': {
    name: 'Zara',
    icon: require('../assets/logos/zara.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'asos.com': {
    name: 'Asos',
    icon: require('../assets/logos/asos.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  'hm.com': {
    name: 'H&M',
    icon: require('../assets/logos/hm.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'boozt.com': {
    name: 'Boozt',
    icon: require('../assets/logos/boozt.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  'sellpy.se': {
    name: 'Sellpy',
    icon: require('../assets/logos/sellpy.png'),
    multiBrand: true,
    secondHand: true,
    highEnd: false,
  },
  'na-kd.com': {
    name: 'NA-KD',
    icon: require('../assets/logos/nakd.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'softgoat.com': {
    name: 'Softgoat',
    icon: require('../assets/logos/softgoat.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'careofcarl.se': {
    name: 'Care of Carl',
    icon: require('../assets/logos/careofcarl.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  'adaysmarch.com': {
    name: "A Day's March",
    icon: require('../assets/logos/adaysmarch.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'loropiana.com': {
    name: 'Loro Piana',
    icon: require('../assets/logos/loropiana.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'eu.lululemon.com': {
    name: 'Lululemon',
    icon: require('../assets/logos/lululemon.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  'gucci.com': {
    name: 'Gucci',
    icon: require('../assets/logos/gucci.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'moncler.com': {
    name: 'Moncler',
    icon: require('../assets/logos/moncler.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'louisvuitton.com': {
    name: 'Louis Vuitton',
    icon: require('../assets/logos/louisvuitton.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'ysl.com': {
    name: 'Yves Saint Laurent',
    icon: require('../assets/logos/ysl.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'farfetch.com': {
    name: 'Farfetch',
    icon: require('../assets/logos/farfetch.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: true,
  },
  'hermes.com': {
    name: 'Hermès',
    icon: require('../assets/logos/hermes.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'prada.com': {
    name: 'Prada',
    icon: require('../assets/logos/prada.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'valentino.com': {
    name: 'Valentino',
    icon: require('../assets/logos/valentino.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  'mytheresa.com': {
    name: 'Mytheresa',
    icon: require('../assets/logos/mytheresa.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: true,
  },
};
