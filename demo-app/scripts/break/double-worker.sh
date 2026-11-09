#!/bin/sh
# Breakage (M7.8): "we scaled out" — a second copy of the worker starts.
# Nothing elects a leader and nothing locks the report run, so every report
# is now generated twice.
#   sh scripts/break/double-worker.sh      (from the demo-app directory)
# Observe:  SELECT day, count(*) FROM reports GROUP BY day ORDER BY day DESC;
echo "[break] starting a SECOND worker process (reports will duplicate)…"
REPORT_EVERY_MINUTES="${REPORT_EVERY_MINUTES:-10}" node worker/cron.js
