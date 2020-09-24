const emotes = require("../emotes.json");

module.exports = {
  Badges: async (bitfield) => {
    let badges = [];

    const staff = 1 << 0;
    const partner = 1 << 1;
    const hypesquad_events = 1 << 2;
    const bughunter_green = 1 << 3;
    const hypesquad_bravery = 1 << 6;
    const hypesquad_brilliance = 1 << 7;
    const hypesquad_balance = 1 << 8;
    const earlysupport = 1 << 9;
    const bughunter_gold = 1 << 14;
    const botdeveloper = 1 << 17;

    if ((bitfield & staff) === staff) badges.push(emotes.badges.staff);
    if ((bitfield & partner) === partner) badges.push(emotes.badges.partner);
    if ((bitfield & hypesquad_events) === hypesquad_events)
      badges.push(emotes.badges.hypesquad_events);
    if ((bitfield & bughunter_green) === bughunter_green)
      badges.push(emotes.badges.bug_hunter_green);
    if ((bitfield & hypesquad_bravery) === hypesquad_bravery)
      badges.push(emotes.badges.hypesquad_bravery);
    if ((bitfield & hypesquad_brilliance) === hypesquad_brilliance)
      badges.push(emotes.badges.hypesquad_brilliance);
    if ((bitfield & hypesquad_balance) === hypesquad_balance)
      badges.push(emotes.badges.hypesquad_balance);
    if ((bitfield & earlysupport) === earlysupport)
      badges.push(emotes.badges.eary_supporter);
    if ((bitfield & bughunter_gold) === bughunter_gold)
      badges.push(emotes.badges.bug_hunter_gold);
    if ((bitfield & botdeveloper) === botdeveloper)
      badges.push(emotes.badges.verfied_bot_developer);

    return badges.map((i) => `${i}`).join(" ");
  },

  Features: async (guildFeatures) => {
    let features = [];

    guildFeatures.forEach((feature) => {
      if (feature === "INVITE_SPLASH") feature = emotes.features.invite_splash;
      else if (feature === "VIP_REGIONS") feature = emotes.features.vip_regions;
      else if (feature === "VANITY_URL") feature = emotes.features.vanity_url;
      else if (feature === "VERIFIED") feature = emotes.features.verified;
      else if (feature === "PARTNERED") feature = emotes.features.partnered;
      else if (feature === "PUBLIC") feature = emotes.features.public;
      else if (feature === "COMMERCE") feature = emotes.features.commerce;
      else if (feature === "DISCOVERABLE")
        feature = emotes.features.discoverable;
      else if (feature === "FEATURABLE") feature = emotes.features.featurable;
      else if (feature === "ANIMATED_ICON")
        feature = emotes.features.animated_icon;
      else if (feature === "BANNER") feature = emotes.features.banner;
      else if (feature === "PUBLIC_DISABLED")
        feature = emotes.features.public_disabled;
      else if (feature === "WELCOME_SCREEN_ENABLED")
        feature = emotes.features.welcome_screen_enabled;
      else if (feature === "NEWS") feature = emotes.features.news;
      else if (feature === "COMMUNITY") feature = emotes.features.community;

      features.push(feature);
    });

    return features.map((i) => `${i}`).join(" ");
  },

  Regions: async (region) => {
    switch (region) {
      case "brazil":
        region = `:flag_br: ${region}`;
        break;
      case "eu-central":
      case "europe":
        region = `:flag_eu: ${region}`;
        break;
      case "hongkong":
        region = `:flag_hk: ${region}`;
        break;
      case "india":
        region = `:flag_in: ${region}`;
        break;
      case "japan":
        region = `:flag_jp: ${region}`;
        break;
      case "russia":
        region = `:flag_ru: ${region}`;
        break;
      case "singapore":
        region = `:flag_sg: ${region}`;
        break;
      case "southafrica":
        region = `:flag_za: ${region}`;
        break;
      case "sydney":
        region = `:flag_au: ${region}`;
        break;
      case "us-central":
      case "us-east":
      case "us-south":
      case "us-west":
        region = `:flag_us: ${region}`;
        break;
      default:
        break;
    }

    return region;
  },
};
