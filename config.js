const main = (config) => {
  //dns覆写
  config["dns"] ??= {};
  config["dns"] = {
    enable: true,
    listen: "0.0.0.0:1053",
    ipv6: true,

    // ===== 核心：全部走本地 DNS =====
    nameserver: ["tcp://127.0.0.1:5591", "127.0.0.1:5591"],

    // ===== 备用也指向本地（避免泄漏）=====
    default_nameserver: ["tcp://127.0.0.1:5591", "127.0.0.1:5591"],

    fallback: ["tcp://127.0.0.1:5591", "127.0.0.1:5591"],
    enhanced_mode: "redir-host",
  };

  config["sniffer"] ??= {};
  config["sniffer"] = {
    enable: true,
    sniff: {
      HTTP: { ports: [80, "8080-8880"], "override-destination": true },
      TLS: { ports: [443, 8443] },
      QUIC: { ports: [443, 8443] },
    },
    "skip-domain": ["Mijia Cloud", "+.push.apple.com"],
  };

  //添加直连节点
  config["proxies"] ??= [];
  const exists = config["proxies"].some((p) => p.name === "➡️ 直连");
  if (!exists) {
    config["proxies"].push({
      name: "➡️ 直连",
      type: "direct",
      udp: true,
      "ip-version": "ipv4-prefer",
      "client-fingerprint": "chrome",
    });
  }
  const proxyNames = config["proxies"].map((p) => p.name);

  // 覆写代理组
  config["proxy-groups"] ??= [];
  config["proxy-groups"] = [
    {
      name: "🚀 国外代理",
      type: "select",
      proxies: [
        "♻️ 自动选择",
        "➡️ 直连",
        "🇭🇰 香港",
        "🇹🇼 台湾",
        "🇯🇵 日本",
        "🇸🇬 新加坡",
        "🇬🇧 英国",
        "🇺🇸 美国",
        "🌐 全部节点",
      ],
      "disable-udp": false,
    },

    {
      name: "🎯 国内代理",
      type: "select",
      proxies: ["➡️ 直连", "🇨🇳 中国", "♻️ 自动选择"],
      "disable-udp": false,
    },

    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: [
        "♻️ 自动选择",
        "➡️ 直连",
        "🇭🇰 香港",
        "🇹🇼 台湾",
        "🇯🇵 日本",
        "🇸🇬 新加坡",
        "🇬🇧 英国",
        "🇺🇸 美国",
        "🌐 全部节点",
      ],
      "disable-udp": false,
    },

    {
      name: "🇨🇳 中国",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["中国自动选择"],
      filter: "(?i)(🇨🇳|中国|cn|china|CN)",
      "exclude-filter": "(?i)(台湾|tw|taiwan|TW)",
    },

    {
      name: "🇭🇰 香港",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["香港自动选择"],
      filter: "(?i)(🇭🇰|香港|hk|hongkong|hong kong|HK)",
    },

    {
      name: "🇹🇼 台湾",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["台湾自动选择"],
      filter: "(?i)(🇹🇼|台湾|tw|taiwan|TW)",
    },

    {
      name: "🇯🇵 日本",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["日本自动选择"],
      filter: "(?i)(🇯🇵|日|jp|japan|JP)",
    },

    {
      name: "🇺🇸 美国",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["美国自动选择"],
      filter: "(?i)(🇺🇸|美|us|unitedstates|united states|US)",
    },

    {
      name: "🇬🇧 英国",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["英国自动选择"],
      filter: "(?i)(🇬🇧|英国|uk|英国|England|UK)",
    },

    {
      name: "🇸🇬 新加坡",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["新加坡自动选择"],
      filter: "(?i)(🇸🇬|新加坡|sg|singapore|SG)",
    },

    {
      name: "🌐 全部节点",
      type: "select",
      interval: 3600,
      "health-check": {
        enable: "true",
        url: "https://www.gstatic.com/generate_204",
        interval: "300",
        timeout: "3000",
      },
      "include-all": true,
      proxies: ["♻️ 自动选择"],
    },

    {
      name: "中国自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇨🇳|中国|cn|china|CN)",
      "exclude-filter": "(?i)(台湾|tw|taiwan|TW)",
    },

    {
      name: "香港自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇭🇰|香港|hk|hongkong|hong kong|HK)",
    },

    {
      name: "台湾自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇹🇼|台湾|tw|taiwan|TW)",
    },

    {
      name: "日本自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇯🇵|日|jp|japan|JP)",
    },

    {
      name: "美国自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇺🇸|美|us|unitedstates|united states|US)",
    },

    {
      name: "英国自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇬🇧|英国|uk|英国|England|UK)",
    },

    {
      name: "新加坡自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "(?i)(🇸🇬|新加坡|sg|singapore|SG)",
    },

    {
      name: "♻️ 自动选择",
      type: "url-test",
      interval: 300,
      tolerance: 100,
      "health-check": {
        enable: true,
        url: "https://www.gstatic.com/generate_204",
        interval: 120,
        timeout: 3000,
      },
      "include-all": true,
      hidden: true,
      filter: "^((?!(直连)).)*$",
    },
  ];

  // 覆写规则链接
  config["geodata-mode"] = true;
  config["geosite-matche"] = "succinct";
  config["geodata-loader"] = "memconservative";
  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;
  config["geox-url"] = {
    geosite:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    geoip:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat",
  };
  config["rule-providers"] ??= {};

  config["sniffer"] ??= {};
  config["sniffer"] = {
    enable: true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": false,
    sniff: {
      HTTP: {
        ports: [80, "8080-8880"],
        "override-destination": false,
      },
      TLS: {
        ports: [443, 8443],
      },
      QUIC: {
        ports: [443, 8443],
      },
    },
    "force-domain": [
      "+.netflix.com",
      "+.nflxvideo.net",
      "+.amazonaws.com",
      "+.media.dssott.com",
    ],
    "skip-domain": [
      "Mijia Cloud",
      "dlg.io.mi.com",
      "+.oray.com",
      "+.sunlogin.net",
      "+.push.apple.com",
    ],
  };

  // 覆写规则
  const DIRECT = "🎯 国内代理";
  const PROXY = "🚀 国外代理";
  const FINAL = "🐟 漏网之鱼";

  config["rules"] ??= [];
  config["rules"] = [
    `GEOSITE,private,${DIRECT}`,
    `GEOIP,private,${DIRECT}`,
    `GEOSITE,cn,${DIRECT}`,
    `GEOIP,cn,${DIRECT}`,
    `GEOSITE,geolocation-!cn,${PROXY}`,
    `MATCH,${FINAL}`,
  ];

  return config;
};
