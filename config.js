const main = (config) => {
  //dns覆写
  config["dns"] ??= {};
  config["dns"] = {
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

  //添加直连节点
  config["proxies"] ??= [];
  const exists = config["proxies"].some(p => p.name === "➡️ 直连");
  if (!exists) {
    config["proxies"].push({
      name: "➡️ 直连",
      type: "direct",
      udp: true,
      "ip-version": "ipv4-prefer",
      "client-fingerprint": "chrome"
    });
  }
  const proxyNames = config["proxies"].map(p => p.name);
  
  // 覆写代理组
  config["proxy-groups"] ??= [];
  config["proxy-groups"] = [

    {
      name: "🚀 国外代理",
      type: "select",
      proxies: ["♻️ 自动选择", "🌐 手动选择", "➡️ 直连"]
    },
    
    {
      name: "🎯 国内代理",
      type: "select",
      proxies: ["➡️ 直连", "♻️ 自动选择", "🌐 手动选择"]
    },

    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: ["♻️ 自动选择", "🌐 手动选择", "➡️ 直连"]
    },

    {
      name: "♻️ 自动选择",
      type: "url-test",
      url: "http://cp.cloudflare.com/generate_204",
      interval: 300,
      tolerance: 150,
      proxies: proxyNames.filter(n => !n.includes("➡️ 直连"))
    },

    {
      name: "🌐 手动选择",
      type: "select",
      proxies: proxyNames
    }

  ];
  
  
  
  
  // 覆写规则链接
  config["rule-providers"] ??= {};
  config["rule-providers"] = {

    private_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/private_ip.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.yaml",
      interval: 86400
    },

    private_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/private_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.yaml",
      interval: 86400
    },

    bilibili_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/bilibili_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bilibili.yaml",
      interval: 86400
    },

    cn_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/cn_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
      interval: 86400
    },

    github_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/github_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.yaml",
      interval: 86400
    },

    google_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/google_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.yaml",
      interval: 86400
    },

    youtube_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/youtube_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.yaml",
      interval: 86400
    },

    tiktok_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/tiktok_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.yaml",
      interval: 86400
    },

    netflix_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/netflix_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.yaml",
      interval: 86400
    },

    telegram_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/telegram_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.yaml",
      interval: 86400
    },

    nocn_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/nocn_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.yaml",
      interval: 86400
    },

    gfw_domain: {
      type: "http",
      behavior: "domain",
      path: "./rule_provider/gfw_domain.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.yaml",
      interval: 86400
    },

    cn_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/cn_ip.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml",
      interval: 86400
    },

    google_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/google_ip.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.yaml",
      interval: 86400
    },

    netflix_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/netflix_ip.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.yaml",
      interval: 86400
    },

    telegram_ip: {
      type: "http",
      behavior: "ipcidr",
      path: "./rule_provider/telegram_ip.yaml",
      format: "yaml",
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.yaml",
      interval: 86400
    }

  };
  
  
  


  // 覆写规则
  const DIRECT = "🎯 国内代理";
  const PROXY = "🚀 国外代理";
  const FINAL = "🐟 漏网之鱼";
  
  config["rules"] ??= [];
  config["rules"] = [

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
