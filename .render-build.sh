# .render-build.sh
#!/usr/bin/env bash
set -o errexit
npm install --include=dev
npm run build
