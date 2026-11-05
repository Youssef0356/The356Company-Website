export interface ProductScreenshot {
  src: string;
  caption: string;
}

export interface ProductData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  badge: string;
  version: string;
  storeUrl: string;
  itchUrl?: string;
  githubUrl?: string;
  webUrl?: string;
  description: string;
  highlights: { title: string; desc: string }[];
  screenshots: ProductScreenshot[];
  stats: { label: string; value: string }[];
}

export const PRODUCTS: ProductData[] = [
  {
    id: 'ar-explorer',
    name: 'AR Explorer',
    title: 'AR Explorer: Learn & Build',
    subtitle: 'Real-Time Spatial Computing & Dimensional Inspection',
    tagline: 'Transform any physical room into an interactive spatial 3D laboratory.',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badge: 'SPATIAL AR // 3D',
    version: 'ARCore Live',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.the356company.arexplorer',
    githubUrl: 'https://github.com/Youssef0356/ar_explorer',
    webUrl: 'https://youssef0356.github.io/AR_ExplorerWebsite/',
    description:
      'Powered by Google ARCore, AR Explorer scans physical floors, tables, and environments in real time, anchoring complex 3D engineering models and interactive assemblies with millimeter spatial precision.',
    highlights: [
      {
        title: 'Surface Plane Detection',
        desc: 'Instant camera-based floor and table scanning with real-time reticle tracking.',
      },
      {
        title: 'Interactive 3D Anchoring',
        desc: 'Pin dimensional assemblies into physical space with persistent spatial coordinates.',
      },
      {
        title: '6-DOF Manipulation',
        desc: 'Intuitive pinch-to-scale, dual-axis elevation, and 360-degree rotation.',
      },
      {
        title: 'Educational Inspection',
        desc: 'Inspect internal mechanisms, structural cutaways, and physics simulations.',
      },
    ],
    stats: [
      { label: 'Tracking Tech', value: 'Google ARCore' },
      { label: 'Spatial Degrees', value: '6-DOF' },
      { label: 'Model Format', value: 'Realtime 3D' },
      { label: 'Deployment', value: 'Production APK' },
    ],
    screenshots: [
      { src: '/screenshots/ar-explorer/play_01.png', caption: 'Real-time surface detection and spatial reticle lock' },
      { src: '/screenshots/ar-explorer/play_02.png', caption: 'Anchoring interactive 3D mechanical components' },
      { src: '/screenshots/ar-explorer/play_03.png', caption: '6-DOF spatial rotation and gesture scaling' },
      { src: '/screenshots/ar-explorer/play_04.png', caption: 'Educational assembly view and structural cutaway' },
      { src: '/screenshots/ar-explorer/play_05.png', caption: 'Real-world physics simulation and room collision' },
      { src: '/screenshots/ar-explorer/play_06.png', caption: 'High-resolution AR snapshot capture and model library' },
      { src: '/screenshots/ar-explorer/play_07.png', caption: 'Multi-model spatial scene arrangement' },
    ],
  },
  {
    id: 'pagelit',
    name: 'Pagelit',
    title: 'Pagelit: PDF Reader & Viewer',
    subtitle: 'Fast, Lightweight & 100% Offline Document Management',
    tagline: 'Your documents remain 100% on your device with zero tracking.',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.4)',
    badge: 'OFFLINE DOCUMENT READER',
    version: 'v1.0 Live (Nov 2026)',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.the356company.pagelit',
    githubUrl: 'https://github.com/Youssef0356/pagelit',
    webUrl: 'https://youssef0356.github.io/pagelit/',
    description:
      'An ultra-fast, privacy-first document viewer engineered for Android. Open and annotate PDF, Word (DOCX), Excel (XLSX), and PowerPoint (PPTX) with complete offline privacy — zero accounts, zero cloud uploads, and zero tracking.',
    highlights: [
      {
        title: '100% On-Device Privacy',
        desc: 'Zero registration, zero cloud uploads, and zero external tracking. Works 100% offline.',
      },
      {
        title: 'Universal Document Viewer',
        desc: 'Instant native viewing of PDF, Word (.docx), Excel (.xlsx), and PowerPoint (.pptx).',
      },
      {
        title: '7-Color Markup Suite',
        desc: 'Versatile highlight, underline, strikethrough, squiggly lines, and sticky notes.',
      },
      {
        title: 'Reading Comfort Modes',
        desc: 'Clean Light, AMOLED Deep Dark, Warm Sepia, and Night Dim modes to reduce strain.',
      },
    ],
    stats: [
      { label: 'Cloud Uploads', value: '0 MB (100% Offline)' },
      { label: 'File Formats', value: 'PDF, DOCX, XLSX, PPTX' },
      { label: 'Markup Colors', value: '7 Palettes' },
      { label: 'Languages', value: 'English, French, Arabic RTL' },
    ],
    screenshots: [
      { src: '/screenshots/pagelit/play_01.png', caption: 'Distraction-free PDF reader with fluid page scrubbing' },
      { src: '/screenshots/pagelit/play_02.png', caption: 'Universal format viewer: Word, Excel & PowerPoint' },
      { src: '/screenshots/pagelit/play_03.png', caption: 'Precision 7-color annotation and sticky comments' },
      { src: '/screenshots/pagelit/play_04.png', caption: 'Eye-care reading modes: Sepia, Night Dim & Dark' },
      { src: '/screenshots/pagelit/play_05.png', caption: 'Instant smart in-text search with diacritic support' },
      { src: '/screenshots/pagelit/play_06.png', caption: '100% offline, zero data tracking or cloud uploads' },
    ],
  },
  {
    id: 'the-system',
    name: 'The System',
    title: 'The System: Party Card Game',
    subtitle: 'Social Deduction, Bluffing & Secret Identities',
    tagline: 'Claim powers out loud, call suspect bluffs, and survive the syndicate.',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badge: 'SOCIAL DEDUCTION & BLUFFING',
    version: '2-8 Players Pass & Play',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.the356company.the_system',
    itchUrl: 'https://youssef356.itch.io/the-system-card-game',
    webUrl: 'https://youssef0356.github.io/The_system-Website/',
    description:
      'A high-stakes tabletop card game of secret identities and psychological deception. Assume clandestine roles: Assassin, Politician, Taxman, Marshal, or Detective. Claim powers out loud, challenge opponents bluffs, and dominate the table offline.',
    highlights: [
      {
        title: '7 Secret Roles',
        desc: 'Businessman, Taxman, Assassin, Marshal, Detective, Politician, and Thief.',
      },
      {
        title: 'Call Your Bluff Core Loop',
        desc: 'Claim powers freely. Opponents may challenge your claim at their own peril.',
      },
      {
        title: 'Single-Device Pass & Play',
        desc: 'Gather 2 to 8 players around one phone. Zero internet connection required.',
      },
      {
        title: 'Influence & Coin Economy',
        desc: 'Accumulate coins, execute assassinations, and orchestrate tactical raids.',
      },
    ],
    stats: [
      { label: 'Player Count', value: '2 - 8 Players' },
      { label: 'Game Mode', value: 'Offline Pass & Play' },
      { label: 'Secret Roles', value: '7 Archetypes' },
      { label: 'Average Round', value: '5 - 15 Minutes' },
    ],
    screenshots: [
      { src: '/screenshots/the-system/play_01.png', caption: 'Main game table with live player influence cards' },
      { src: '/screenshots/the-system/play_02.png', caption: 'Secret role assignment: The Assassin' },
      { src: '/screenshots/the-system/play_03.png', caption: 'The confrontation: Calling an opponents bluff' },
      { src: '/screenshots/the-system/play_04.png', caption: '2-8 player pass-and-play room setup' },
      { src: '/screenshots/the-system/play_05.png', caption: 'Tactical action menu: Steal, Tax, Assassinate' },
      { src: '/screenshots/the-system/play_06.png', caption: 'Rich illustrated character roles and rules' },
      { src: '/screenshots/the-system/play_07.png', caption: 'Detective investigation and deduction log' },
      { src: '/screenshots/the-system/play_08.png', caption: 'Showdown and victory declaration screen' },
    ],
  },
  {
    id: 'battle-cows',
    name: 'Battle Cows',
    title: 'Battle Cows: Hex Board Game',
    subtitle: 'Tactical Hexagonal Territory Conquest',
    tagline: 'Deploy bovine armies, construct barricades, and conquer dynamic pastures.',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badge: 'HEXAGONAL STRATEGY BOARD',
    version: 'Flame Engine 1.36 Live',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.the356company.battlecows',
    itchUrl: 'https://youssef356.itch.io/battle-cows',
    description:
      'A charming turn-based territory conquest game. Command bovine armies across dynamic hex-tiled pastures, construct fence barricades, unlock quirky cow factions, and outmaneuver opponent herds with indie charm and authentic banjo soundscapes.',
    highlights: [
      {
        title: 'Hexagonal Grid Conquering',
        desc: 'Deploy herds across expanding hex tiles to dominate contiguous pastures.',
      },
      {
        title: 'Tactical Fence Defenses',
        desc: 'Place fence gates and hay bale blockades to stall incoming enemy invasions.',
      },
      {
        title: 'Daily Puzzle Campaigns',
        desc: 'Hand-crafted single-player scenarios and daily tactical board challenges.',
      },
      {
        title: 'Quirky Indie Character',
        desc: 'Customizable cow factions, tactile animations, and an authentic country soundtrack.',
      },
    ],
    stats: [
      { label: 'Engine', value: 'Flutter + Flame 1.36' },
      { label: 'Grid System', value: 'Hexagonal Axial' },
      { label: 'Game Modes', value: 'Campaign & Puzzles' },
      { label: 'App Version', value: 'v1.2.2+14 Live' },
    ],
    screenshots: [
      { src: '/screenshots/battle-cows/play_01.png', caption: 'Dynamic hexagonal board grid and pasture control' },
      { src: '/screenshots/battle-cows/play_02.png', caption: 'Bovine herd deployment and tactical movements' },
      { src: '/screenshots/battle-cows/play_03.png', caption: 'Pasture capture and fence barricade defense' },
      { src: '/screenshots/battle-cows/play_04.png', caption: 'Turn-based strategy HUD and live score tracking' },
      { src: '/screenshots/battle-cows/play_05.png', caption: 'Campaign map progression and daily puzzles' },
      { src: '/screenshots/battle-cows/play_06.png', caption: 'Quirky cow customization and faction badges' },
    ],
  },
];
