import React from 'react';
import Layout from '@theme/Layout';
import HeaderView from './components/HeaderView'
import Playground from './components/Playground'
import Features from './components/Features'
import StartCoding from './components/StartCoding'

export default function Home() {
  return (
    <Layout
      title="Powerful danmaku video player"
      description="powerful danmaku video player">
      <HeaderView />
      <Features />
      <Playground />
      <StartCoding />
    </Layout>
  );
}
