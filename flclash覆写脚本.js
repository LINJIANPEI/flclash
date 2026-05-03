const main = (config) => {
//dns覆写
config.dns = {
    enable: true,
    listen: "0.0.0.0:1053",
    ipv6: true,

    // ===== 核心：全部走本地 DNS =====
    nameserver: [
      "tcp://127.0.0.1:5591",
      "tcp://[::1]:5591"
    ],

    // ===== 备用也指向本地（避免泄漏）=====
    default_nameserver: [
      "tcp://127.0.0.1:5591",
      "tcp://[::1]:5591"
    ],

    fallback: [
      "tcp://127.0.0.1:5591",
      "tcp://[::1]:5591"
    ],

    // ===== 不做分流 =====
    nameserver_policy: {},

    // ===== 可选：fake-ip（看你本地DNS是否支持）=====
    enhanced_mode: "fake-ip",
    fake_ip_range: "198.18.0.1/16",

    fake_ip_filter: [
      "*.lan",
      "*.local",
      "*.msftconnecttest.com",
      "*.msftncsi.com"
    ]
  };


  //使用配置的代理节点
  config.proxies ??= [];

  //添加直连节点(如果没有)
  const exists = config.proxies.some(p => p.name === "直连");
  if (!exists) {
    config.proxies.push({
      name: "直连",
      type: "direct",
      udp: true,
      "ip-version": "ipv4-prefer",
      "client-fingerprint": "chrome"
    });
  }
  
  const proxies = config.proxies.map(p => p.name);
  
  // 覆写代理组
  config["proxy-groups"] = [

    {
      name: "🚀 默认代理",
      type: "select",
      proxies: ["♻️ 自动选择", "🌐 手动选择", "🎯 全球直连"]
    },

    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: ["♻️ 自动选择", "🌐 手动选择", "🎯 全球直连"]
    },

    {
      name: "♻️ 自动选择",
      type: "url-test",
      url: "http://cp.cloudflare.com/generate_204",
      interval: 300,
      tolerance: 150,
      proxies: proxies.filter(n => !n.includes("直连"))
    },

    {
      name: "🌐 手动选择",
      type: "select",
      proxies: proxies
    },

    {
      name: "🎯 全球直连",
      type: "select",
      proxies: ["直连"]
    }

  ];
  
  
  // 添加规则组
  /*
  const addGroup = (name, regex) => {
    const list = proxies.filter(p => regex.test(p));
    if (list.length > 0) {
      config["proxy-groups"].push({
        name,
        type: "select",
        proxies: list
      });
    }
  };

  addGroup("🇭🇰 港台", /(香港|HK|台湾|TW)/);
  addGroup("🇯🇵 日韩新", /(日本|JP|韩国|KR|新加坡|SG)/);
  addGroup("🇺🇸 欧美", /(美国|US|英国|UK|德国|DE)/);
  */
  
  

  // 覆写规则链接
  config["rule-providers"] = {

    private_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/private_ip.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs",
      interval: 86400
    },

    private_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/private_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
      interval: 86400
    },

    bilibili_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/bilibili_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bilibili.mrs",
      interval: 86400
    },

    cn_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/cn_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
      interval: 86400
    },

    github_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/github_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
      interval: 86400
    },

    google_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/google_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
      interval: 86400
    },

    youtube_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/youtube_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
      interval: 86400
    },

    tiktok_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/tiktok_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs",
      interval: 86400
    },

    netflix_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/netflix_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs",
      interval: 86400
    },

    telegram_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/telegram_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
      interval: 86400
    },

    nocn_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/nocn_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
      interval: 86400
    },

    gfw_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/gfw_domain.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.mrs",
      interval: 86400
    },

    cn_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/cn_ip.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
      interval: 86400
    },

    google_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/google_ip.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs",
      interval: 86400
    },

    netflix_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/netflix_ip.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs",
      interval: 86400
    },

    telegram_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/telegram_ip.mrs",
      format: "mrs",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
      interval: 86400
    }

  };
  
  
  


  // 覆写规则
  const DIRECT = "🎯 全球直连";
  const PROXY = "🚀 默认代理";
  const FINAL = "🐟 漏网之鱼";

  config.rules = [

    // ===== 私有 =====
    `RULE-SET,private_ip,${DIRECT}`,
    `RULE-SET,private_domain,${DIRECT}`,

    // ===== 国内 =====
    `RULE-SET,bilibili_domain,${DIRECT}`,
    `RULE-SET,cn_domain,${DIRECT}`,
    `RULE-SET,cn_ip,${DIRECT}`,

    // ===== 代理 =====
    `RULE-SET,github_domain,${PROXY}`,
    `RULE-SET,google_domain,${PROXY}`,
    `RULE-SET,youtube_domain,${PROXY}`,
    `RULE-SET,tiktok_domain,${PROXY}`,
    `RULE-SET,netflix_domain,${PROXY}`,
    `RULE-SET,telegram_domain,${PROXY}`,
    `RULE-SET,gfw_domain,${PROXY}`,
    `RULE-SET,nocn_domain,${PROXY}`,

    `RULE-SET,google_ip,${PROXY}`,
    `RULE-SET,netflix_ip,${PROXY}`,
    `RULE-SET,telegram_ip,${PROXY}`,

    // ===== 兜底 =====
    `MATCH,${FINAL}`
  ];



  return config;
};