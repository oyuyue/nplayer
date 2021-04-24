module.exports = {
  docs: [
    'installation',
    'getting-started',
    'shortcut',
    'contextmenu',
    'control',
    'settings',
    'poster',
    'thumbnail',
    'ie11',
    'theme',
    'plugin',
    'streaming',
    {
      type: 'category',
      label: '生态',
      collapsed: false,
      items: [
        'ecosystem/danmaku',
        'ecosystem/react',
        'ecosystem/vue',
      ],
    },
    {
      type: 'category',
      label: '例子',
      collapsed: false,
      items: [
        'examples/quantity-switch',
        'examples/screenshot',
        'examples/mirroring',
      ],
    },
  ],
  api: [
    'api/config',
    'api/events',
    'api/attrs',
    'api/methods',
    'api/components',
  ]
};
