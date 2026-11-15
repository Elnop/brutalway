'use client';
import { feedClient } from '@/features/feed/feedClient.ts';
import { format } from '../shared/format';

// a comment
export default function TodosPage(props: any) {
  const a = props.x ? (props.y ? 1 : 2) : 3;
  console.log(a, feedClient, format);
  async function save() {
    'use server';
  }
  const items = [3, 1, 2].toSorted();
  return <img src="/x.png" alt="" onClick={save} data-items={items} />;
}
