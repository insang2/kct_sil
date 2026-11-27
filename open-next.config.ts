import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// 사전 렌더(SSG)된 페이지를 정적 에셋에서 읽기 전용으로 서빙 → Worker CPU 절약
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
