// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Climate API',
  tagline: 'GraphQL API for global historical temperature data',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'alexpalmdev',
  projectName: 'climate-api',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Climate API',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://climate-reading-api.vercel.app/graphql',
            label: 'Playground',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/getting-started' },
              { label: 'Authentication', to: '/auth' },
            ],
          },
          {
            title: 'API',
            items: [
              { label: 'GraphQL Playground', href: 'https://climate-reading-api.vercel.app/graphql' },
            ],
          },
        ],
        copyright: `Climate API — Built with Docusaurus`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
