import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { AssetDetailPage } from '@/pages/AssetDetail';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/asset/:symbol" element={<AssetDetailPage />} />
    </Routes>
  );
}

export default App;
