import { useEffect, useState } from 'react';

export function Feed() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    void fetch('/api/items').then(async (response) => setItems(await response.json()));
  }, []);
  return <p>{items.length}</p>;
}
