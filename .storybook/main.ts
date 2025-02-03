import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-webpack5-compiler-babel'],
}

export default config
