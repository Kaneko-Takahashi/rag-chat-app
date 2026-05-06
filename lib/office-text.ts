/**
 * officeparser v6 は parseOffice が AST を返し、プレーンテキストは toText() で取得する。
 * 旧コードは文字列返却を想定していたため、ここで正規化する。
 */
export function officeParseResultToText(result: unknown): string {
  if (result == null) return '';
  if (typeof result === 'string') return result;

  if (typeof result === 'object') {
    const r = result as Record<string, unknown>;
    if (typeof r.toText === 'function') {
      try {
        const out = (r.toText as () => unknown)();
        if (typeof out === 'string' && out.trim()) return out;
      } catch {
        /* fall through */
      }
    }
    if (Array.isArray(r.content)) {
      const joined = r.content
        .map((item: unknown) => {
          if (item && typeof item === 'object' && 'text' in item) {
            return String((item as { text?: unknown }).text ?? '');
          }
          return '';
        })
        .filter(Boolean)
        .join('\n')
        .trim();
      if (joined) return joined;
    }
  }

  try {
    return JSON.stringify(result);
  } catch {
    return String(result);
  }
}
