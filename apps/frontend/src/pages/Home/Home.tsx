import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import styles from './Home.module.css';

export function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>CryptoViz Dashboard</h1>
        <p className={styles.subtitle}>
          Real-time cryptocurrency data visualization powered by Kafka
        </p>
      </header>

      <div className={styles.grid}>
        <Card hover>
          <CardHeader>
            <CardTitle>📊 Live Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View real-time cryptocurrency prices, charts, and trading data.</p>
            <Link to="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>📈 Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analyze market trends and historical data with advanced charts.</p>
            <Link to="/analysis">
              <Button variant="secondary">View Analysis</Button>
            </Link>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>⚙️ Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure your dashboard preferences and data sources.</p>
            <Link to="/settings">
              <Button variant="ghost">Open Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className={styles.features}>
        <h2>Features</h2>
        <ul>
          <li>Real-time data streaming from Kafka</li>
          <li>Interactive charts with lightweight-charts</li>
          <li>Multiple cryptocurrency pairs support</li>
          <li>Dark/Light theme support</li>
          <li>Responsive design</li>
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
