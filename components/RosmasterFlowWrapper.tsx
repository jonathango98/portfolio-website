'use client';

import dynamic from 'next/dynamic';
import styles from '@/app/rosmaster/page.module.css';

const RosmasterFlow = dynamic(() => import('./RosmasterFlow'), {
  ssr: false,
  loading: () => <div className={styles.flowPlaceholder} />,
});

export default function RosmasterFlowWrapper() {
  return <RosmasterFlow />;
}
