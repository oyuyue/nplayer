/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://woopen.github.io',
  baseUrl: '/RPlayer/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'woopen', // Usually your GitHub org/user name.
  projectName: 'rplayer', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'RPlayer',
      logo: {
        alt: 'RPlayer',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: '文档',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'api',
          label: 'API',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'api',
          label: '弹幕文档',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'playground',
          label: '在线演示',
          position: 'left',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'Rplayer',
        src: 'img/logo.svg',
        href: 'https://github.com/woopen/RPlayer',
      },
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '快速开始',
              to: 'docs/',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/rplayer',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/woopen/RPlayer/issues',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/woopen/RPlayer',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} `,
    },
  },
  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
