import { ingestDocument } from '@/lib/rag/embeddings';
import { officeParseResultToText } from '@/lib/office-text';
import { parseOffice } from 'officeparser';

/** officeparser / pdfjs は Node ランタイムが前提（Edge では不可） */
export const runtime = 'nodejs';

/** 大きめファイルの解析時間確保（Vercel プランの上限に依存） */
export const maxDuration = 60;

const parserConfig = { outputErrorToConsole: false } as const;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'ファイルが必要です' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = fileName.split('.').pop()?.toLowerCase();
    let text = '';

    if (fileType === 'txt') {
      text = await file.text();
    } else if (fileType === 'pdf' || fileType === 'docx' || fileType === 'pptx') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await parseOffice(buffer, parserConfig);
      text = officeParseResultToText(result);
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const XLSX = await import('xlsx');
      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;
      text = sheetNames
        .map((name) => {
          const sheet = workbook.Sheets[name];
          return `【シート: ${name}】\n${XLSX.utils.sheet_to_txt(sheet)}`;
        })
        .join('\n\n');
    } else {
      return Response.json(
        {
          error:
            '対応していないファイル形式です（txt, pdf, xlsx, xls, pptx, docx に対応）',
        },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return Response.json(
        { error: 'ファイルからテキストを抽出できませんでした' },
        { status: 400 }
      );
    }

    const title = fileName.replace(/\.[^/.]+$/, '');
    const doc = await ingestDocument(title, text);

    return Response.json({
      message: `「${title}」を登録しました`,
      document: doc,
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return Response.json(
      {
        error: 'ファイルのアップロードに失敗しました',
        detail:
          error instanceof Error ? error.message : 'officeparser 等の処理でエラー',
      },
      { status: 500 }
    );
  }
}
