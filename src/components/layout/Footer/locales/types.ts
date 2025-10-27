// 万象生活底栏多语言系统类型定义

export type FooterLocaleType = 'zh-CN' | 'en-US';

export interface FooterLocaleKeys {
  topBar: {
    navigation: {
      home: string;
      services: string;
      orders: string;
      profile: string;
    };
    userActions: {
      login: string;
      register: string;
    };
  };
  mainContent: {
    services: {
      cleaning: string;
      repair: string;
      errand: string;
      membership: string;
      customer: string;
      moving: string;
    };
    promotion: {
      title: string;
      description: string;
      button: string;
      close: string;
    };
  };
  bottomBar: {
    links: {
      about: string;
      help: string;
      contact: string;
      privacy: string;
      terms: string;
      license: string;
    };
    legal: {
      copyright: string;
      icp: string;
      police: string;
    };
    social: {
      wechat: string;
      github: string;
      weibo: string;
      follow: string;
    };
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    more: string;
    new: string;
    hot: string;
    coming_soon: string;
  };
}

export type FooterLocalePath =
  | 'topBar.navigation.home'
  | 'topBar.navigation.services'
  | 'topBar.navigation.orders'
  | 'topBar.navigation.profile'
  | 'topBar.userActions.login'
  | 'topBar.userActions.register'
  | 'mainContent.services.cleaning'
  | 'mainContent.services.repair'
  | 'mainContent.services.errand'
  | 'mainContent.services.membership'
  | 'mainContent.services.customer'
  | 'mainContent.services.moving'
  | 'mainContent.promotion.title'
  | 'mainContent.promotion.description'
  | 'mainContent.promotion.button'
  | 'mainContent.promotion.close'
  | 'bottomBar.links.about'
  | 'bottomBar.links.help'
  | 'bottomBar.links.contact'
  | 'bottomBar.links.privacy'
  | 'bottomBar.links.terms'
  | 'bottomBar.links.license'
  | 'bottomBar.legal.copyright'
  | 'bottomBar.legal.icp'
  | 'bottomBar.legal.police'
  | 'bottomBar.social.wechat'
  | 'bottomBar.social.github'
  | 'bottomBar.social.weibo'
  | 'bottomBar.social.follow'
  | 'common.loading'
  | 'common.error'
  | 'common.retry'
  | 'common.close'
  | 'common.more'
  | 'common.new'
  | 'common.hot'
  | 'common.coming_soon';