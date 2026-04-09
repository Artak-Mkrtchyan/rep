export type BrokerStat = {
  value: string;
  label: string;
};

export type BrokerStatsRowProps = {
  stats: BrokerStat[];
  className?: string;
};
