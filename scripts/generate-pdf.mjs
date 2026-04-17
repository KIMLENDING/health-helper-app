import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

// ESM에서 __dirname 재현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Health Helper App - PDF Automation Tool (ESM version)
 * 
 * 기능:
 * 1. 마크다운 파일을 읽어 커스텀 테마 HTML로 변환
 * 2. 시스템 브라우저(MS Edge)를 사용하여 고품질 PDF 렌더링
 * 3. 완료 후 임시 파일 자동 정리
 */

async function main() {
    console.log("\n🚀 PDF 변환 프로세스를 시작합니다...");

    try {
        // 1. 경로 설정
        const rootDir = path.join(__dirname, "..");
        const mdPath = path.join(rootDir, "개발 하면서 공부한 파일", "Refactoring_Case_Study.md");
        const tempHtmlPath = path.join(rootDir, "temp_report_process.html");
        const outputPath = path.join(rootDir, "개발 하면서 공부한 파일", "Refactoring_Case_Study.pdf");
        const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

        if (!fs.existsSync(mdPath)) {
            throw new Error(`마크다운 파일을 찾을 수 없습니다: ${mdPath}`);
        }

        console.log("📄 마크다운 읽기 및 HTML 변환 중...");
        const mdContent = fs.readFileSync(mdPath, "utf8");

        // 2. MD -> HTML 변환 (정규식 기반)
        const bodyContent = simpleMdToHtml(mdContent);
        const htmlTemplate = generateHtmlTemplate(bodyContent);

        fs.writeFileSync(tempHtmlPath, htmlTemplate, "utf8");

        // 3. Edge 브라우저를 이용한 PDF 렌더링
        console.log("🎨 PDF 렌더링 중 (MS Edge Headless Engine)...");
        
        const result = spawnSync(edgePath, [
            "--headless",
            "--no-pdf-header-footer",
            `--print-to-pdf=${outputPath}`,
            tempHtmlPath
        ]);

        if (result.error) {
            throw result.error;
        }

        // 4. 정리
        if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
        }

        console.log(`\n✅ PDF 변환 완료!`);
        console.log(`📍 경로: ${outputPath}\n`);

    } catch (error) {
        console.error("\n❌ PDF 생성 중 오류가 발생했습니다:");
        console.error(error.message);
        process.exit(1);
    }
}

/**
 * 마크다운 -> HTML 변환기
 */
function simpleMdToHtml(md) {
    let html = md
        .replace(/^# (.*$)/gm, '<h1 class="title">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="section-title">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="sub-title">$1</h3>')
        .replace(/^\* (.*$)/gm, "<li>$1</li>")
        .replace(/^- (.*$)/gm, "<li>$1</li>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/^> (.*$)/gm, '<blockquote class="quote">$1</blockquote>')
        .replace(/---/g, '<hr class="divider">')
        .replace(/\n\s*\n/g, "</p><p>")
        .replace(/((?:<li>.*?<\/li>\s*)+)/g, "<ul>$1</ul>");

    return "<p>" + html + "</p>";
}

/**
 * 프리미엄 HTML 템플릿 생성
 */
function generateHtmlTemplate(content) {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refactoring Case Study</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', 'Noto Sans KR', sans-serif;
            line-height: 1.6;
            color: #334155;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 60px;
            background-color: white;
        }
        @media print {
            body { padding: 0; margin: 0; }
            .no-print { display: none; }
        }
        .title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 1.5rem;
            border-bottom: 4px solid #10b981;
            padding-bottom: 0.5rem;
            display: inline-block;
        }
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }
        .section-title::before {
            content: '';
            width: 4px;
            height: 1.2rem;
            background-color: #0d9488;
            margin-right: 12px;
            border-radius: 2px;
        }
        .sub-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #0d9488;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            background-color: #f0fdfa;
            padding: 4px 12px;
            border-radius: 6px;
            display: inline-block;
        }
        p { margin-bottom: 1rem; }
        ul { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        li::marker { color: #10b981; }
        strong { font-weight: 700; color: #0f172a; }
        code {
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9em;
            color: #ef4444;
        }
        .divider {
            border: 0;
            height: 1px;
            background-image: linear-gradient(to right, #e2e8f0, #10b981, #e2e8f0);
            margin: 2rem 0;
        }
        .quote {
            border-left: 4px solid #10b981;
            background-color: #f8fafc;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #475569;
            border-radius: 0 8px 8px 0;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
    `;
}

main();
