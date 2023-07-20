type CompanyProps = {
  name: string;
  icon: any;
  multiBrand: boolean;
  secondHand: boolean;
  highEnd: boolean;
};

// Predefined domains

export const companyToInfo: { [key: string]: CompanyProps } = {
  zalando: {
    name: 'Zalando',
    icon: require('../assets/logos/zalando.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  zara: {
    name: 'Zara',
    icon: require('../assets/logos/zara.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  asos: {
    name: 'Asos',
    icon: require('../assets/logos/asos.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  hm: {
    name: 'H&M',
    icon: require('../assets/logos/hm.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  boozt: {
    name: 'Boozt',
    icon: require('../assets/logos/boozt.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  sellpy: {
    name: 'Sellpy',
    icon: require('../assets/logos/sellpy.png'),
    multiBrand: true,
    secondHand: true,
    highEnd: false,
  },
  'na-kd': {
    name: 'NA-KD',
    icon: require('../assets/logos/nakd.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  softgoat: {
    name: 'Softgoat',
    icon: require('../assets/logos/softgoat.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  careofcarl: {
    name: 'Care of Carl',
    icon: require('../assets/logos/careofcarl.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: false,
  },
  adaysmarch: {
    name: "A Day's March",
    icon: require('../assets/logos/adaysmarch.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  loropiana: {
    name: 'Loro Piana',
    icon: require('../assets/logos/loropiana.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  lululemon: {
    name: 'Lululemon',
    icon: require('../assets/logos/lululemon.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: false,
  },
  gucci: {
    name: 'Gucci',
    icon: require('../assets/logos/gucci.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  moncler: {
    name: 'Moncler',
    icon: require('../assets/logos/moncler.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  louisvuitton: {
    name: 'Louis Vuitton',
    icon: require('../assets/logos/louisvuitton.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  ysl: {
    name: 'Yves Saint Laurent',
    icon: require('../assets/logos/ysl.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  farfetch: {
    name: 'Farfetch',
    icon: require('../assets/logos/farfetch.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: true,
  },
  hermes: {
    name: 'Hermès',
    icon: require('../assets/logos/hermes.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  prada: {
    name: 'Prada',
    icon: require('../assets/logos/prada.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  valentino: {
    name: 'Valentino',
    icon: require('../assets/logos/valentino.png'),
    multiBrand: false,
    secondHand: false,
    highEnd: true,
  },
  mytheresa: {
    name: 'Mytheresa',
    icon: require('../assets/logos/mytheresa.png'),
    multiBrand: true,
    secondHand: false,
    highEnd: true,
  },
};
