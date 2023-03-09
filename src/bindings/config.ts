import ms from "ms";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

import { BotConfig, BotConfigSchema } from "../types";
import {
  DefaultPriceConfig,
  DEFAULT_BOT_DELAY,
  DEFAULT_CHAIN_ID,
  DEFAULT_DISQUALIFY_TIME,
  DEFAULT_FOLLOWUP_TIME,
  DEFAULT_PAYMENT_TOKEN,
  DEFAULT_PERMIT_BASE_URL,
  DEFAULT_RPC_ENDPOINT,
} from "../configs";
import { ajv } from "../utils";

export const loadConfig = async (): Promise<BotConfig> => {
  let configFile: any = {};
  try {
    const configFilePath = path.join(__dirname, "../../.github/ubiquibot-config.yml");
    configFile = yaml.load(fs.readFileSync(configFilePath, "utf8"));
  } catch (err) {
    console.error(err);
  }

  const botConfig: BotConfig = {
    log: {
      level: process.env.LOG_LEVEL || "deubg",
      ingestionKey: process.env.LOGDNA_INGESTION_KEY ?? "",
    },
    price: {
      baseMultiplier: process.env.BASE_MULTIPLIER ? Number(process.env.BASE_MULTIPLIER) : configFile.baseMultiplier ?? DefaultPriceConfig.baseMultiplier,
      timeLabels: configFile.timeLabels ?? DefaultPriceConfig.timeLabels,
      priorityLabels: configFile.priorityLabels ?? DefaultPriceConfig.priorityLabels,
    },
    payout: {
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : DEFAULT_CHAIN_ID,
      rpc: process.env.RPC_PROVIDER_URL || DEFAULT_RPC_ENDPOINT,
      privateKey: process.env.UBIQUITY_BOT_EVM_PRIVATE_KEY || "",
      paymentToken: process.env.PAYMENT_TOKEN || DEFAULT_PAYMENT_TOKEN,
      permitBaseUrl: process.env.PERMIT_BASE_URL || DEFAULT_PERMIT_BASE_URL,
    },
    unassign: {
      followUpTime: ms(process.env.FOLLOW_UP_TIME || DEFAULT_FOLLOWUP_TIME),
      disqualifyTime: ms(process.env.DISQUALIFY_TIME || DEFAULT_DISQUALIFY_TIME),
    },
    supabase: {
      url: process.env.SUPABASE_URL ?? "",
      key: process.env.SUPABASE_KEY ?? "",
    },
    telegram: {
      token: process.env.TELEGRAM_BOT_TOKEN ?? "",
      delay: process.env.TELEGRAM_BOT_DELAY ? Number(process.env.TELEGRAM_BOT_DELAY) : DEFAULT_BOT_DELAY,
    },
    mode: {
      autoPay: process.env.AUTO_PAY_MODE === "TRUE" ? true : false,
      analytics: process.env.ANALYTICS_MODE === "TRUE" ? true : false,
    },
  };

  if (botConfig.log.ingestionKey == "") {
    throw new Error("LogDNA ingestion key missing");
  }

  if (botConfig.payout.privateKey == "") {
    botConfig.mode.autoPay = false;
  }

  const validate = ajv.compile(BotConfigSchema);
  const valid = validate(botConfig);
  if (!valid) {
    throw new Error(`Config schema validation failed!!!, config: ${botConfig}`);
  }

  if (botConfig.unassign.followUpTime < 0 || botConfig.unassign.disqualifyTime < 0) {
    throw new Error(`Invalid time interval, followUpTime: ${botConfig.unassign.followUpTime}, disqualifyTime: ${botConfig.unassign.disqualifyTime}`);
  }

  return botConfig;
};
