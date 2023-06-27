type DomainProps = {
  name: string;
  icon: any;
  multiBrand: boolean;
  secondHand: boolean;
};

// Predefined domains

export const domainToInfo: { [key: string]: DomainProps } = {
  'zalando.se': {
    name: 'Zalando',
    icon: require('../assets/logos/zalando.png'),
    multiBrand: true,
    secondHand: false,
  },
  'zara.com': {
    name: 'Zara',
    icon: require('../assets/logos/zara.png'),
    multiBrand: false,
    secondHand: false,
  },
  'asos.com': {
    name: 'Asos',
    icon: require('../assets/logos/asos.png'),
    multiBrand: true,
    secondHand: false,
  },
  'hm.com': {
    name: 'H&M',
    icon: require('../assets/logos/hm.png'),
    multiBrand: false,
    secondHand: false,
  },
  'boozt.com': {
    name: 'Boozt',
    icon: require('../assets/logos/boozt.png'),
    multiBrand: true,
    secondHand: false,
  },
  'sellpy.se': {
    name: 'Sellpy',
    icon: require('../assets/logos/sellpy.png'),
    multiBrand: true,
    secondHand: true,
  },
  'na-kd.com': {
    name: 'NA-KD',
    icon: require('../assets/logos/nakd.png'),
    multiBrand: false,
    secondHand: false,
  },
  'softgoat.com': {
    name: 'Softgoat',
    icon: require('../assets/logos/softgoat.png'),
    multiBrand: false,
    secondHand: false,
  },
  'careofcarl.se': {
    name: 'Care of Carl',
    icon: require('../assets/logos/careofcarl.png'),
    multiBrand: true,
    secondHand: false,
  },
  'adaysmarch.com': {
    name: "A Day's March",
    icon: require('../assets/logos/adaysmarch.png'),
    multiBrand: false,
    secondHand: false,
  },
};
