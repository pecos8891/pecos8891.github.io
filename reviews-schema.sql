CREATE TABLE IF NOT EXISTS reviews (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 artwork TEXT NOT NULL,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 text TEXT NOT NULL,
 ip_hash TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS reviews_recent_ip ON reviews(ip_hash,created_at);
CREATE INDEX IF NOT EXISTS reviews_recent ON reviews(created_at DESC);
