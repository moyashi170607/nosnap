export function dataURLtoFile(dataurl: string, baseName: string): File {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("無効なDataURLです");

    const mime = mimeMatch[1]; // 例: "image/jpeg"

    // MIMEタイプから拡張子を決定するマッピング
    const extensions: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/avif': '.avif'
    };

    // 対応する拡張子を取得（不明な場合は .bin などにするか、そのままにする）
    const ext = extensions[mime] || '.bin';
    const filename = `${baseName}${ext}`;

    // バイナリ変換処理
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}