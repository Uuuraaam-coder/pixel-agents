import { useEffect, useState } from 'react';
import './PersonalOfficePanel.css';

type RoleId = 'finance' | 'daily' | 'work' | 'health';
type Note = { id: string; role: RoleId; text: string; createdAt: string };
const STORAGE_KEY = 'personal-pixel-office-notes-v1';
const roles: { id: RoleId; title: string; subtitle: string; icon: string; color: string }[] = [
  { id: 'finance', title: '재무', subtitle: '예산과 자산을 정리해요', icon: '💰', color: '#f9dfa4' },
  { id: 'daily', title: '일상', subtitle: '계획과 할 일을 기억해요', icon: '☕', color: '#f8b9c9' },
  { id: 'work', title: '업무', subtitle: '프로젝트 기록을 모아요', icon: '💼', color: '#b7d5f7' },
  { id: 'health', title: '건강', subtitle: '생활 기록을 살펴봐요', icon: '🌱', color: '#b8e4c3' },
];
function isRoleId(value: unknown): value is RoleId {
  return roles.some((role) => role.id === value);
}
function loadNotes(): Note[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is Note =>
      item !== null && typeof item === 'object' &&
      typeof item.id === 'string' && isRoleId(item.role) &&
      typeof item.text === 'string' && typeof item.createdAt === 'string');
  } catch {
    return [];
  }
}
export function PersonalOfficePanel() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleId>('daily');
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [notes]);

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    setNotes((prev) => [{ id: crypto.randomUUID(), role, text, createdAt: new Date().toISOString() }, ...prev]);
    setDraft('');
  };
  const exportNotes = () => {
    const file = new Blob([JSON.stringify({ version: 1, notes }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personal-office-notes.json';
    link.click();
    URL.revokeObjectURL(url);
  };
  const importNotes = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_000_000) { setImportMessage('2MB 이하 JSON 파일만 가져올 수 있습니다.'); return; }
    try {
      const data: unknown = JSON.parse(await file.text());
      if (typeof data !== 'object' || data === null || !('version' in data) ||
          data.version !== 1 || !('notes' in data) || !Array.isArray(data.notes)) {
        throw new Error('invalid backup');
      }
      const imported: Note[] = [];
      for (const item of data.notes) {
        if (typeof item !== 'object' || item === null ||
            typeof item.id !== 'string' || typeof item.text !== 'string' ||
            item.text.length > 3000 || !isRoleId(item.role) ||
            typeof item.createdAt !== 'string' || !Number.isFinite(Date.parse(item.createdAt))) {
          throw new Error('invalid note');
        }
        imported.push({ id: item.id, text: item.text, role: item.role, createdAt: item.createdAt });
      }
      if (imported.length > 2000) throw new Error('too many notes');
      setNotes((previous) => {
        const combined = new Map(previous.map((note) => [note.id, note]));
        imported.forEach((note) => combined.set(note.id, note));
        return Array.from(combined.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      });
      setImportMessage(imported.length + '개 기록을 가져왔습니다.');
    } catch {
      setImportMessage('백업 형식이 올바르지 않습니다. 기존 기록은 그대로 유지됩니다.');
    }
  };
  const selected = roles.find((item) => item.id === role)!;
  const visibleNotes = notes.filter((note) => note.role === role && note.text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  return (
    <div className="personal-office-root">
      <button className="personal-office-toggle" type="button" onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open} aria-controls="personal-office-dialog">
        {open ? '✕ 닫기' : '🏠 나의 AI 오피스'}
      </button>
      {open && (
        <section id="personal-office-dialog" className="personal-office-dialog" aria-label="나의 AI 오피스">
          <header className="personal-office-header">
            <div>
              <h2>🌷 나의 픽셀 오피스</h2>
              <p>네 명의 친구와 기록을 정리하는 공간</p>
            </div>
            <span className="personal-office-pill">한국어 프로토타입</span>
          </header>
          <div className="personal-office-rooms" aria-label="AI 직원 선택">
            {roles.map((item) => (
              <button key={item.id} type="button" className={'personal-office-role ' + (role === item.id ? 'selected' : '')}
                style={{ backgroundColor: item.color }} onClick={() => setRole(item.id)} aria-pressed={role === item.id}>
                <span className="personal-office-avatar" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{notes.filter((note) => note.role === item.id).length}개 기록</small>
              </button>
            ))}
          </div>
          <div className="personal-office-pixel-room" aria-label="네 명의 AI 직원이 있는 픽셀 사무실">
            {roles.map((item) => (
              <button key={item.id} type="button" onClick={() => setRole(item.id)}
                className={'personal-office-desk ' + (role === item.id ? 'active' : '')}
                aria-label={item.title + ' 직원 선택'} aria-pressed={role === item.id}>
                <span className="personal-office-pixel-person" style={{ backgroundColor: item.color }} aria-hidden="true">
                  <i className="pixel-eye left" /><i className="pixel-eye right" />
                </span>
                <span className="personal-office-desk-table" aria-hidden="true">▤</span>
                <span className="personal-office-desk-label">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="personal-office-detail">
            <h3>{selected.icon} {selected.title} 담당</h3>
            <p>{selected.subtitle}</p>
            <label htmlFor="personal-office-note">기억해 둘 내용을 적어 주세요</label>
            <textarea id="personal-office-note" value={draft} onChange={(event) => setDraft(event.target.value)}
              placeholder="이 내용은 현재 브라우저에만 저장됩니다." maxLength={3000} rows={3} />
            <button type="button" className="personal-office-save" onClick={addNote} disabled={!draft.trim()}>기록 저장</button>
            <label htmlFor="personal-office-search">저장된 기록 검색</label>
            <input id="personal-office-search" className="personal-office-search" value={search}
              onChange={(event) => setSearch(event.target.value)} placeholder="이 직원의 기록에서 검색" />
            <div className="personal-office-notes">
              {visibleNotes.length === 0 && <p className="personal-office-empty">아직 저장된 기록이 없어요.</p>}
              {visibleNotes.map((note) => (
                <article key={note.id} className="personal-office-note">
                  <p>{note.text}</p>
                  <div>
                    <time dateTime={note.createdAt}>{new Date(note.createdAt).toLocaleString('ko-KR')}</time>
                    <button type="button" onClick={() => setNotes((prev) => prev.filter((item) => item.id !== note.id))}
                      aria-label="기록 삭제">삭제</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <footer className="personal-office-footer">
            <p>현재는 AI 대화가 아닌 로컬 메모 단계입니다. GPT API와 장기 기억 검색은 이후 연결합니다. 브라우저 데이터를 삭제하거나 다른 기기로 이동하면 기록이 유지되지 않을 수 있습니다.</p>
            {storageError && <p role="alert">저장할 수 없습니다. 브라우저 저장 공간 설정을 확인하세요.</p>}
            <div className="personal-office-backup">
              <button type="button" onClick={exportNotes}>JSON 백업 내보내기</button>
              <label htmlFor="personal-office-import">JSON 백업 가져오기</label>
              <input id="personal-office-import" aria-label="JSON 백업 가져오기" type="file" accept=".json,application/json"
                onChange={(event) => { void importNotes(event.target.files?.[0]); event.target.value = ''; }} />
            </div>
            {importMessage && <p role="status">{importMessage}</p>}
          </footer>
        </section>
      )}
    </div>
  );
}
