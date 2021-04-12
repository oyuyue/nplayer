import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import HeaderView from './components/HeaderView'
import Playground from './components/Playground'
import Features from './components/Features'
import StartCoding from './components/StartCoding'
import styles from './styles.module.css';

export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HeaderView />
      {/* <Playground /> */}
      <Features />
      <StartCoding />
    </Layout>
  );
}
