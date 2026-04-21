import { ingestDocument } from '@/lib/rag/embeddings';
import * as officeparser from 'officeparser';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'ファイルが必要です' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = fileName.split('.').pop()?.toLowerCase();
    let text = '';

    // ファイル形式に応じてテキスト抽出
    if (fileType === 'txt') {
      text = await file.text();

    } else if (fileType === 'pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;

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

    } else if (fileType === 'pptx' || fileType === 'docx') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await officeparser.parseOffice(buffer);
      if (result && typeof result.toText === 'function') {
        text = result.toText();
      } else if (result && result.content) {
        text = result.content
          .filter((item: any) => item.text)
          .map((item: any) => item.text)
          .join('\n');
      } else {
        text = JSON.stringify(result);
      }

    } else {
      return Response.json(
        { error: '対応していないファイル形式です（txt, pdf, xlsx, pptx, docx に対応）' },
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
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}