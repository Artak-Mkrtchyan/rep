/** Figma REP home screen tokens (node 1670:30767 / 1674:32571) */
export const HOME_DESIGN = {
  neutral950: '#111111',
  neutral500: '#777777',
  neutral300: '#ABABAB',
  neutral200: '#C6C6C6',
  neutral100: '#E2E2E2',
  neutral50: '#F1F1F1',
  green500: '#5EBC39',
  green50: '#E3FEDE',
  main500: '#087443',
  orange500: '#F96800',
  beigeSection: '#F8F3E8',
  /** House illustration mat — matches section so letterboxing isn’t a white card */
  affordabilityIllustrationBg: '#F8F3E8',
  white: '#FFFFFF',
  overlayDark: 'rgba(17,17,17,0.3)',
  imageOverlay: 'rgba(0,0,0,0.2)',
  cardShadow: {
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 6,
  },
  /**
   * Gray-strip carousels (agents, developers): flat white tiles — no shadow (overlap artifact)
   * and no border per design; contrast comes from #F1F1F1 strip vs white card.
   */
  carouselStripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  heroBottomRadius: 24,
  featuredCardWidth: 249,
  featuredImageHeight: 139,
  /** Vertical rhythm from Figma (REP home) */
  layout: {
    /** Space between hero, featured, affordability, agents, companies */
    sectionGap: 36,
    /** Section title row → horizontal carousel */
    headerToCarousel: 16,
    /** Carousel → dot pagination */
    carouselToDots: 12,
    /** Inside affordability beige block: title ↔ illustration ↔ form */
    affordabilityBlockGap: 28,
    affordabilityPaddingH: 16,
    affordabilityPaddingV: 24,
    /** Space between horizontal carousel cards */
    carouselCardGap: 8,
  },
  /**
   * Bounds / ratios for {@link useHomeMetrics} (rotation, split view, small/large phones).
   */
  responsive: {
    featuredCardWidthMin: 200,
    featuredCardWidthMax: 340,
    agentCardWidthRatio: 0.78,
    agentCardWidthMin: 250,
    agentCardWidthMax: 400,
    companyCardWidthRatio: 0.62,
    companyCardWidthMin: 200,
    companyCardWidthMax: 360,
  },
} as const;
