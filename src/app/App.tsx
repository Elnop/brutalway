import { EditorLayout } from '@/features/editor/components/EditorLayout.tsx';
import { SummaryContainer } from '@/features/summary/components/SummaryContainer.tsx';

export function App() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Floor plan</h1>
        <p>Add rooms, select one on the list or on the plan, edit its dimensions.</p>
      </header>
      <main className="sheet-body">
        <EditorLayout />
        <SummaryContainer />
      </main>
      <footer className="title-block">
        <dl>
          <div>
            <dt>Project</dt>
            <dd>template-vite</dd>
          </div>
          <div>
            <dt>Set</dt>
            <dd>elnop-stacks</dd>
          </div>
          <div>
            <dt>Sheet</dt>
            <dd>01 / 01</dd>
          </div>
          <div>
            <dt>Units</dt>
            <dd>metres</dd>
          </div>
        </dl>
      </footer>
    </div>
  );
}
