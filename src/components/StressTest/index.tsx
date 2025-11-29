'use client';

import { useState } from 'react';
import styles from './StressTest.module.scss';

interface StressResult {
  success: boolean;
  type: string;
  duration: number;
  message: string;
  heapUsedMB?: number;
  heapTotalMB?: number;
  intensity?: number;
  allocatedMB?: number;
  cpuIntensity?: number;
  memoryMB?: number;
}

interface ResourceUsage {
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    externalMB: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  uptime: number;
}

export default function StressTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<ResourceUsage | null>(null);

  // CPU Stress Test
  const handleCpuStress = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        '/api/stress/cpu?duration=5000&intensity=100',
        {
          method: 'POST',
        },
      );

      if (!response.ok) {
        throw new Error('CPU stress test failed');
      }

      const data = await response.json();
      setResult(data);
      await fetchUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Memory Stress Test
  const handleMemoryStress = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        '/api/stress/memory?sizeMB=200&duration=5000',
        {
          method: 'POST',
        },
      );

      if (!response.ok) {
        throw new Error('Memory stress test failed');
      }

      const data = await response.json();
      setResult(data);
      await fetchUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Combined Stress Test
  const handleCombinedStress = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        '/api/stress/combined?duration=10000&cpuIntensity=75&memoryMB=150',
        {
          method: 'POST',
        },
      );

      if (!response.ok) {
        throw new Error('Combined stress test failed');
      }

      const data = await response.json();
      setResult(data);
      await fetchUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current resource usage
  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/stress/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  };

  return (
    <div className={styles.stressTest}>
      <h2>🔥 Stress Testing</h2>
      <p className={styles.description}>
        Generate controlled load to test monitoring, tracing, and autoscaling
        capabilities.
      </p>

      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.cpu}`}
          onClick={handleCpuStress}
          disabled={loading}
        >
          {loading ? '⏳ Running...' : '💻 CPU Stress (5s)'}
        </button>

        <button
          className={`${styles.button} ${styles.memory}`}
          onClick={handleMemoryStress}
          disabled={loading}
        >
          {loading ? '⏳ Running...' : '🧠 Memory Stress (200MB)'}
        </button>

        <button
          className={`${styles.button} ${styles.combined}`}
          onClick={handleCombinedStress}
          disabled={loading}
        >
          {loading ? '⏳ Running...' : '⚡ Combined Stress (10s)'}
        </button>

        <button
          className={`${styles.button} ${styles.usage}`}
          onClick={fetchUsage}
          disabled={loading}
        >
          📊 Refresh Usage
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h3>✅ Test Completed</h3>
          <div className={styles.details}>
            <p>
              <strong>Type:</strong> {result.type}
            </p>
            <p>
              <strong>Duration:</strong> {result.duration}ms
            </p>
            {result.intensity && (
              <p>
                <strong>CPU Intensity:</strong> {result.intensity}%
              </p>
            )}
            {result.allocatedMB && (
              <p>
                <strong>Memory Allocated:</strong> {result.allocatedMB}MB
              </p>
            )}
            {result.heapUsedMB && (
              <p>
                <strong>Heap Used:</strong> {result.heapUsedMB}MB
              </p>
            )}
            {result.heapTotalMB && (
              <p>
                <strong>Heap Total:</strong> {result.heapTotalMB}MB
              </p>
            )}
            {result.cpuIntensity && (
              <p>
                <strong>CPU Intensity:</strong> {result.cpuIntensity}%
              </p>
            )}
            {result.memoryMB && (
              <p>
                <strong>Memory Allocated:</strong> {result.memoryMB}MB
              </p>
            )}
            <p className={styles.message}>{result.message}</p>
          </div>
        </div>
      )}

      {usage && (
        <div className={styles.usage}>
          <h3>📊 Current Resource Usage</h3>
          <div className={styles.usageGrid}>
            <div className={styles.usageCard}>
              <h4>💾 Memory</h4>
              <p>
                <strong>Heap Used:</strong> {usage.memory.heapUsedMB}MB
              </p>
              <p>
                <strong>Heap Total:</strong> {usage.memory.heapTotalMB}MB
              </p>
              <p>
                <strong>RSS:</strong> {usage.memory.rssMB}MB
              </p>
              <p>
                <strong>External:</strong> {usage.memory.externalMB}MB
              </p>
            </div>
            <div className={styles.usageCard}>
              <h4>⚙️ CPU</h4>
              <p>
                <strong>User:</strong> {(usage.cpu.user / 1000000).toFixed(2)}s
              </p>
              <p>
                <strong>System:</strong>{' '}
                {(usage.cpu.system / 1000000).toFixed(2)}s
              </p>
              <p>
                <strong>Uptime:</strong> {Math.floor(usage.uptime)}s
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.info}>
        <h4>ℹ️ Test Information</h4>
        <ul>
          <li>
            <strong>CPU Stress:</strong> Performs intensive mathematical
            calculations for 5 seconds
          </li>
          <li>
            <strong>Memory Stress:</strong> Allocates 200MB of memory for 5
            seconds
          </li>
          <li>
            <strong>Combined Stress:</strong> CPU + Memory load simultaneously
            for 10 seconds
          </li>
          <li>
            <strong>Monitoring:</strong> All tests are traced with OpenTelemetry
            - check Jaeger UI!
          </li>
        </ul>
      </div>
    </div>
  );
}
