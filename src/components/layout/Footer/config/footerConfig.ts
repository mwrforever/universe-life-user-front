import { FooterConfig } from '../types/component';

// 万象生活企业级底栏默认配置
// 升级自原有配置，增强企业级特性

export const footerConfig: FooterConfig = {
  topBar: {
    logo: {
      icon: "🏠",
      text: "万象生活",
      href: "/",
      external: false,
      alt: "万象生活 - 您的品质生活服务平台"
    },
    navigation: [
      {
        id: "home",
        title: "首页",
        href: "/",
        description: "返回万象生活首页",
        analytics: {
          eventCategory: "footer_navigation",
          eventAction: "click_home",
          eventLabel: "首页"
        }
      },
      {
        id: "services",
        title: "服务",
        href: "/services",
        badge: 5,
        description: "查看所有生活服务",
        analytics: {
          eventCategory: "footer_navigation",
          eventAction: "click_services",
          eventLabel: "服务"
        }
      },
      {
        id: "orders",
        title: "我的订单",
        href: "/orders",
        description: "查看订单状态和历史",
        analytics: {
          eventCategory: "footer_navigation",
          eventAction: "click_orders",
          eventLabel: "我的订单"
        }
      },
      {
        id: "profile",
        title: "个人中心",
        href: "/profile",
        description: "管理个人信息和设置",
        analytics: {
          eventCategory: "footer_navigation",
          eventAction: "click_profile",
          eventLabel: "个人中心"
        }
      }
    ],
    userActions: [
      {
        id: "login",
        title: "登录",
        href: "/login",
        type: "primary",
        size: "middle",
        analytics: {
          eventCategory: "footer_user_action",
          eventAction: "click_login",
          eventLabel: "登录"
        }
      },
      {
        id: "register",
        title: "注册",
        href: "/register",
        type: "default",
        size: "middle",
        analytics: {
          eventCategory: "footer_user_action",
          eventAction: "click_register",
          eventLabel: "注册"
        }
      }
    ]
  },
  mainContent: {
    services: [
      {
        id: "cleaning",
        title: "家政保洁",
        icon: "🧹",
        badge: 23,
        color: "#52c41a",
        description: "专业家政服务，让家焕然一新",
        href: "/services/cleaning",
        status: "active",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_cleaning",
          eventLabel: "家政保洁"
        }
      },
      {
        id: "repair",
        title: "维修安装",
        icon: "🔧",
        badge: 15,
        color: "#1890ff",
        description: "专业维修师傅，快速上门服务",
        href: "/services/repair",
        isNew: true,
        status: "active",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_repair",
          eventLabel: "维修安装"
        }
      },
      {
        id: "errand",
        title: "代办跑腿",
        icon: "🏃",
        badge: 8,
        color: "#faad14",
        description: "同城代办服务，省时省心",
        href: "/services/errand",
        status: "active",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_errand",
          eventLabel: "代办跑腿"
        }
      },
      {
        id: "membership",
        title: "会员中心",
        icon: "👑",
        color: "#722ed1",
        description: "会员专享特权与优惠",
        href: "/membership",
        status: "active",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_membership",
          eventLabel: "会员中心"
        }
      },
      {
        id: "customer",
        title: "客服支持",
        icon: "💬",
        color: "#13c2c2",
        description: "7×24小时在线客服支持",
        href: "/customer-service",
        status: "active",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_customer",
          eventLabel: "客服支持"
        }
      },
      {
        id: "moving",
        title: "搬家服务",
        icon: "🚚",
        color: "#eb2f96",
        description: "专业搬家团队，安全高效",
        href: "/services/moving",
        status: "coming-soon",
        analytics: {
          eventCategory: "footer_service",
          eventAction: "click_moving",
          eventLabel: "搬家服务"
        }
      }
    ],
    promotion: {
      id: "spring-promotion",
      title: "🌸 春季特惠活动",
      description: "新用户专享88折优惠，限时抢购",
      backgroundColor: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
      textColor: "#FFFFFF",
      link: "/promotions/spring",
      button: {
        text: "立即抢购",
        href: "/promotions/spring",
        type: "primary"
      },
      closable: true,
      analytics: {
        eventCategory: "footer_promotion",
        eventAction: "click_spring_promotion",
        eventLabel: "春季特惠活动"
      }
    }
  },
  bottomBar: {
    links: [
      {
        id: "about",
        title: "关于我们",
        href: "/about",
        description: "了解万象生活品牌故事",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_about",
          eventLabel: "关于我们"
        }
      },
      {
        id: "help",
        title: "帮助中心",
        href: "/help",
        description: "常见问题解答和使用指南",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_help",
          eventLabel: "帮助中心"
        }
      },
      {
        id: "contact",
        title: "联系我们",
        href: "/contact",
        description: "联系万象生活客服团队",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_contact",
          eventLabel: "联系我们"
        }
      },
      {
        id: "privacy",
        title: "隐私政策",
        href: "/privacy",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
        description: "查看隐私保护政策",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_privacy",
          eventLabel: "隐私政策"
        }
      },
      {
        id: "terms",
        title: "服务条款",
        href: "/terms",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
        description: "查看服务使用条款",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_terms",
          eventLabel: "服务条款"
        }
      },
      {
        id: "license",
        title: "营业执照",
        href: "/license",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
        description: "查看营业执照信息",
        analytics: {
          eventCategory: "footer_link",
          eventAction: "click_license",
          eventLabel: "营业执照"
        }
      }
    ],
    legal: {
      icp: "京ICP备12345678号",
      police: "京公网安备11010801234567号",
      copyright: "© 2024 万象生活. 保留所有权利.",
      privacy: "/privacy",
      terms: "/terms",
      license: "/license"
    },
    social: [
      {
        id: "wechat",
        title: "微信公众号",
        qrCode: "/assets/images/wechat-qr-code.webp",
        description: "扫码关注万象生活公众号",
        modal: {
          title: "关注万象生活公众号",
          description: "扫码关注，获取更多优惠信息和活动资讯",
          width: 320
        },
        analytics: {
          eventCategory: "footer_social",
          eventAction: "click_wechat",
          eventLabel: "微信公众号"
        }
      },
      {
        id: "github",
        title: "GitHub",
        href: "https://github.com/universe-life",
        icon: "github",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
        description: "查看万象生活开源项目",
        analytics: {
          eventCategory: "footer_social",
          eventAction: "click_github",
          eventLabel: "GitHub"
        }
      },
      {
        id: "weibo",
        title: "新浪微博",
        href: "https://weibo.com/universe-life",
        icon: "weibo",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
        description: "关注万象生活官方微博",
        analytics: {
          eventCategory: "footer_social",
          eventAction: "click_weibo",
          eventLabel: "新浪微博"
        }
      }
    ]
  }
};

// 获取默认配置的Hook函数
export const useDefaultFooterConfig = () => {
  return footerConfig;
};