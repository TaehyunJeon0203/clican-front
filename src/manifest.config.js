import { defineManifest } from '@crxjs/vite-plugin';
import pkg from '../package.json';
export default defineManifest({
    manifest_version: 3,
    name: 'Clican — 검색 결과 신뢰도 별점',
    version: pkg.version,
    description: 'AI가 검색 결과의 신뢰도를 분석해 별점으로 보여줍니다.',
    action: {
        default_popup: 'src/popup/index.html',
        default_title: 'Clican',
    },
    background: {
        service_worker: 'src/background.ts',
        type: 'module',
    },
    content_scripts: [
        {
            matches: ['https://www.google.com/search*'],
            js: ['src/content/index.tsx'],
            run_at: 'document_idle',
        },
    ],
    host_permissions: ['https://clican.onrender.com/*'],
    permissions: ['storage'],
});
