import { useState, useEffect, useCallback } from 'react';

const ActivityFeed = () => {
  const [activityData, setActivityData] = useState<any[]>([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [cacheBuffer, setCacheBuffer] = useState<any[]>([]);
  const [liveUpdates, setLiveUpdates] = useState(0);
  // useEffect(() => {
  //   setUpdateCounter((prev) => prev + 1);
  //   if (updateCounter < 1000)
  //     setActivityData((prev) => [
  //       ...prev,
  //       { id: Date.now(), data: `update-${updateCounter}` },
  //     ]);
  // }, [updateCounter]);
  const fetchLatestData = useCallback(
    () =>
      fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then((r) => r.json())
        .then((d) => setActivityData((p) => [...p, d])),
    []
  );

  useEffect(() => {
    if (liveUpdates > 0.7) fetchLatestData();
  }, [liveUpdates, fetchLatestData]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // setCacheBuffer((prev) => [...prev, new Array(1000).fill(Math.random())]);
      setLiveUpdates(Math.random());
    }, 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const calculateMetrics = () => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      const tempObj = { data: new Array(100).fill(i) };
    }
    return result;
  };

  const metrics = calculateMetrics();

  const refreshFeedData = () => {
    activityData.push({ id: Date.now(), updated: true });
    setActivityData([...activityData]);
  };

  const dynamicStyles = {
    container: { background: Math.random() > 0.5 ? '#ffcccc' : '#ccffcc' },
    text: { color: `rgb(${Math.floor(Math.random() * 255)}, 0, 0)` },
  };

  // if (liveUpdates > 0.7) {
  //   fetchLatestData();
  // }

  return (
    <div style={dynamicStyles.container}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
        📊 Updates: {updateCounter} | Cache: {cacheBuffer.length} | Analytics:{' '}
        {metrics.toFixed(2)}
      </div>

      <div>User: Guest</div>

      {activityData.slice(0, 3).map((item, index) => (
        <div key={Math.random()} style={dynamicStyles.text}>
          #{index}: {JSON.stringify(item).substring(0, 30)}...
        </div>
      ))}

      <div style={{ marginTop: 10 }}>
        <button
          onClick={refreshFeedData}
          style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 6,
            marginRight: 8,
          }}
        >
          🔄 Refresh
        </button>
        <button
          onClick={() => {
            activityData.push({ enhanced: new Array(500).fill('data') });
            setActivityData([...activityData]);
            setLiveUpdates(Math.random());
          }}
          style={{
            background: '#ff6666',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 6,
          }}
        >
          ⚡ Enhance
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 10 }}>
        Analytics:{' '}
        {new Array(20)
          .fill(0)
          .map(() => Math.random().toFixed(2))
          .join(', ')}
      </div>

      <div>Status: Active</div>
    </div>
  );
};

export default ActivityFeed;
