import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3000;
const CONFIG_FILE = path.join(process.cwd(), "tidb-config.json");
const LOCAL_DATA_FILE = path.join(process.cwd(), "local-data.json");

app.use(express.json());

// Default configurations
const DEFAULT_MEDIA_ITEMS = [
  {
    id: "1",
    type: "blog",
    title: "The Theoretical Mechanics of Modern High-Stakes Trivia",
    author: "Alazar Tekle",
    date: "June 8, 2026",
    duration: "5 min read",
    category: "TRIVIA METRICS",
    excerpt: "How structured, rapid-fire questioning across Science, History, and Sports serves as a robust metric of cognitive agility and decision speed.",
    content: `For centuries, humans have used testing protocols as standard frameworks of logical calibration. On the modern Enqoq Cash platform, this is revolutionized. Trivia is no longer just home entertainment; it is an optimized transaction of cognitive agility. By scaling challenges across four core domains—General Knowledge, Sports, Science, and History—we empower players to convert rapid factual recall into immediate digital credit. 

Historically, intellectual agility was verbal. Today, our synchronized digital platform, Enqoq Cash, maps this competitive transaction onto modern web architecture, where high-speed correct answers trigger instant micro-reward validations.`,
    tags: ["Aesthetics", "Agility", "Game Theory"],
    likes: 142,
    gradientTheme: "from-red-950 via-neutral-900 to-black"
  },
  {
    id: "2",
    type: "vlog",
    title: "YUTOBIA v4.0: Modernizing Ge'ez Typography inside Addis Ababa",
    author: "Selam Kassahun",
    date: "June 5, 2026",
    duration: "8 min watch",
    category: "VLOGS / DESIGN",
    excerpt: "A mini-documentary following YouTobia's design team through the streets of Addis Ababa, transforming urban Ge'ez signage into high-contrast digital layouts.",
    content: "In this vlog, our design director Selam is sharing our vision of bringing Ge'ez typography into 2026 high-contrast digital layouts. We visit old printers around Piazza, study historical manuscripts, and translate these physical ink artifacts into responsive CSS elements, absolute vector illustrations, and digital interface frames.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Typography", "Addis Ababa", "Ge'ez"],
    likes: 219,
    gradientTheme: "from-neutral-900 via-red-950 to-neutral-900"
  },
  {
    id: "3",
    type: "blog",
    title: "Designing for Focus: Why We Banned Purple Gradients & AI Slop",
    author: "Tewodros Yohannes",
    date: "May 28, 2026",
    duration: "4 min read",
    category: "CREATIVE POLICY",
    excerpt: "An exploration of YouTobia Multimedia's strict branding: why high-octane red, deep black, and absolute white demand user focus over standard automated web styling.",
    content: `Web design in the mid-2020s has fallen prey to a passive uniformity. The ubiquity of generic purple-to-blue gradients, rounded glassy card templates, and unrequested mock terminal logs has desensitized our eyes. 

At YouTobia, we adhere to a policy of Architectural Honesty. 

We choose absolute red (#FF1E27) because it triggers high visual alerts, paired with razor-sharp corners, strong structural grids, and expansive pitch-black backgrounds. We construct layouts where content is the singular hero. If an element cannot be targeted, debugged, and interactively justified, it is deleted. By designing with high-contrast conviction, we demand the user's absolute visual presence.`,
    tags: ["Branding", "UI/UX", "Art Direction"],
    likes: 98,
    gradientTheme: "from-neutral-900 via-neutral-900 to-neutral-950"
  },
  {
    id: "4",
    type: "vlog",
    title: "Walkthrough: Conquering the 'Hard' Trivia Tier in Enqoq Cash",
    author: "Robel Melaku",
    date: "May 15, 2026",
    duration: "12 min watch",
    category: "VLOGS / LEADERBOARD",
    excerpt: "Our top gamer Robel breaks down the highest-tier factual questions featured in the active platform and shows how to maximize response times.",
    content: "Robel walks you through how to master advanced trivia parameters in science, astrophysics, and world History on the active Enqoq Cash dashboard. He highlights historical literature roots of the questions, tells you how to spot fast semantic traps, and shows how players can optimize their virtualization speed to cache prizes.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Walkthrough", "Enqoq Cash", "Gaming"],
    likes: 312,
    gradientTheme: "from-black via-red-950/40 to-neutral-900"
  }
];

const DEFAULT_SOCIAL_ACCOUNTS = [
  { id: "s1", platform: "Youtube", label: "YouTobia TV", url: "https://youtube.com/@youtobia-multimedia", isActive: true },
  { id: "s2", platform: "Telegram", label: "YouTobia Creative Lab", url: "https://t.me/youtobia_multimedia", isActive: true },
  { id: "s3", platform: "Twitter", label: "YouTobiaX", url: "https://twitter.com/youtobia_tech", isActive: true },
  { id: "s4", platform: "Instagram", label: "youtobia.art", url: "https://instagram.com/youtobia.multimedia", isActive: true }
];

const DEFAULT_HERO_VIDEO = "https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4";

// Interface for database config
interface DbConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  useTiDB?: boolean;
}

// In-memory active database connection pool
let pool: mysql.Pool | null = null;
let currentDbConfig: DbConfig = {};

// Load TiDB configuration from file or system env on boot
function loadDbConfig(): DbConfig {
  let config: DbConfig = {
    host: process.env.TIDB_HOST || "",
    port: parseInt(process.env.TIDB_PORT || "4000"),
    user: process.env.TIDB_USER || "",
    password: process.env.TIDB_PASSWORD || "",
    database: process.env.TIDB_DATABASE || "youtobia",
    useTiDB: false,
  };

  // Override config if env variables exist
  if (config.host && config.password) {
    config.useTiDB = true;
  }

  // Override with local filesystem file configurations if they exist
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      config = { ...config, ...data };
    } catch (_) {}
  }

  return config;
}

// Try initializing connection pool
async function initDatabase() {
  currentDbConfig = loadDbConfig();
  if (pool) {
    await pool.end();
    pool = null;
  }

  if (currentDbConfig.useTiDB && currentDbConfig.host && currentDbConfig.password) {
    try {
      console.log(`Connecting to TiDB Cloud Serverless: mysql://${currentDbConfig.user}@${currentDbConfig.host}:${currentDbConfig.port}/${currentDbConfig.database}`);
      
      pool = mysql.createPool({
        host: currentDbConfig.host,
        port: currentDbConfig.port || 4000,
        user: currentDbConfig.user,
        password: currentDbConfig.password,
        database: currentDbConfig.database || "youtobia",
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
        connectionLimit: 10,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Verification query to build schema on start
      const conn = await pool.getConnection();
      console.log("Successfully established secure pool with TiDB Cloud Serverless!");
      
      // Auto-bootstrap schemas
      await conn.query(`
        CREATE TABLE IF NOT EXISTS media_items (
          id VARCHAR(50) PRIMARY KEY,
          type VARCHAR(10) NOT NULL,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(100),
          date VARCHAR(50),
          duration VARCHAR(50),
          category VARCHAR(100),
          excerpt TEXT,
          content TEXT,
          videoUrl TEXT,
          likes INT DEFAULT 0,
          tags JSON,
          gradientTheme VARCHAR(255)
        )
      `);
      
      await conn.query(`
        CREATE TABLE IF NOT EXISTS social_accounts (
          id VARCHAR(50) PRIMARY KEY,
          platform VARCHAR(50) NOT NULL,
          label VARCHAR(255) NOT NULL,
          url TEXT NOT NULL,
          isActive BOOLEAN DEFAULT true
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          \`key\` VARCHAR(50) PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);

      // Seed hero video if empty
      const [settingsRows]: any = await conn.query("SELECT * FROM app_settings WHERE `key` = 'hero_video_url'");
      if (settingsRows.length === 0) {
        await conn.query("INSERT INTO app_settings (`key`, value) VALUES ('hero_video_url', ?)", [DEFAULT_HERO_VIDEO]);
      }

      conn.release();
    } catch (err) {
      console.error("Failed to connect or build TiDB Cloud tables. Reverting to persistent Local file sandbox.", err);
      pool = null;
    }
  } else {
    console.log("No TiDB Cloud settings configured. Running high-fidelity local file overlay database.");
  }
}

// Read/write local JSON file overlay
function getLocalData() {
  if (!fs.existsSync(LOCAL_DATA_FILE)) {
    const fresh = {
      mediaItems: DEFAULT_MEDIA_ITEMS,
      socialAccounts: DEFAULT_SOCIAL_ACCOUNTS,
      heroVideoUrl: DEFAULT_HERO_VIDEO,
    };
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(fresh, null, 2), "utf-8");
    return fresh;
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, "utf-8"));
  } catch (_) {
    return {
      mediaItems: DEFAULT_MEDIA_ITEMS,
      socialAccounts: DEFAULT_SOCIAL_ACCOUNTS,
      heroVideoUrl: DEFAULT_HERO_VIDEO,
    };
  }
}

function saveLocalData(data: any) {
  fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Initialize database immediately
initDatabase();

// ---------------- API ENDPOINTS ----------------

// DB Configurations Info
app.get("/api/db-config", (req, res) => {
  res.json({
    host: currentDbConfig.host || "",
    port: currentDbConfig.port || 4000,
    user: currentDbConfig.user || "",
    database: currentDbConfig.database || "",
    useTiDB: currentDbConfig.useTiDB || false,
    isConnected: !!pool,
  });
});

// Update database configs and re-init connection pool
app.post("/api/db-config", async (req, res) => {
  const { host, port, user, password, database, useTiDB } = req.body;
  
  const saved: DbConfig = {
    host: (host || "").trim(),
    port: parseInt(port || "4000"),
    user: (user || "").trim(),
    password: (password || "").trim(),
    database: (database || "youtobia").trim(),
    useTiDB: useTiDB === true,
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(saved, null, 2), "utf-8");
  console.log("Writing customized TiDB config to filesystem...");
  
  await initDatabase();

  res.json({
    success: true,
    isConnected: !!pool,
    config: {
      host: currentDbConfig.host || "",
      port: currentDbConfig.port || 4000,
      user: currentDbConfig.user || "",
      database: currentDbConfig.database || "",
      useTiDB: currentDbConfig.useTiDB,
    }
  });
});

// ---------------- ADDITIONAL TIDB EXPERT DB ADMIN ENDPOINTS ----------------

// 1. Connection Ping and Latency Metrics
app.get("/api/db-ping", async (req, res) => {
  const start = Date.now();
  if (pool) {
    try {
      await pool.query("SELECT 1");
      const latency = Date.now() - start;
      return res.json({ connected: true, latencyMs: latency, error: null });
    } catch (e: any) {
      return res.json({ connected: false, latencyMs: 0, error: e.message || "Ping failed" });
    }
  }
  res.json({ connected: false, latencyMs: 0, error: "Not using TiDB Cloud Database" });
});

// 2. Fetch Detailed DB Table structures and metadata
app.get("/api/db-tables", async (req, res) => {
  const result: any[] = [];
  const local = getLocalData();
  
  if (pool) {
    try {
      // Fetch live table list from TiDB
      const [rows]: any = await pool.query("SHOW TABLES");
      const dbNameKey = Object.keys(rows[0] || {})[0] || "Tables";
      
      for (const row of rows) {
        const tableName = row[dbNameKey];
        
        // Fetch row count
        let count = 0;
        try {
          const [countRes]: any = await pool.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
          count = countRes[0]?.count || 0;
        } catch (_) {}

        // Fetch schema column structures
        let columns: any[] = [];
        try {
          const [descRes]: any = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``);
          columns = descRes.map((col: any) => ({
            name: col.Field,
            type: col.Type,
            nullable: col.Null === "YES",
            key: col.Key,
            default: col.Default
          }));
        } catch (_) {}

        result.push({
          name: tableName,
          rowCount: count,
          columns,
          isTiDBCloud: true
        });
      }
      return res.json(result);
    } catch (e: any) {
      console.error("Failed to query TiDB tables mapping list, merging local mock mapping:", e);
    }
  }

  // Fallback schema mapping in Local mode
  result.push({
    name: "media_items",
    rowCount: local.mediaItems.length,
    isTiDBCloud: false,
    columns: [
      { name: "id", type: "varchar(50)", nullable: false, key: "PRI" },
      { name: "type", type: "varchar(10)", nullable: false },
      { name: "title", type: "varchar(255)", nullable: false },
      { name: "author", type: "varchar(100)", nullable: true },
      { name: "date", type: "varchar(50)", nullable: true },
      { name: "duration", type: "varchar(50)", nullable: true },
      { name: "category", type: "varchar(100)", nullable: true },
      { name: "excerpt", type: "text", nullable: true },
      { name: "content", type: "text", nullable: true },
      { name: "videoUrl", type: "text", nullable: true },
      { name: "likes", type: "int(11)", nullable: true, default: "0" },
      { name: "tags", type: "json", nullable: true },
      { name: "gradientTheme", type: "varchar(255)", nullable: true }
    ]
  });

  result.push({
    name: "social_accounts",
    rowCount: local.socialAccounts.length,
    isTiDBCloud: false,
    columns: [
      { name: "id", type: "varchar(50)", nullable: false, key: "PRI" },
      { name: "platform", type: "varchar(50)", nullable: false },
      { name: "label", type: "varchar(255)", nullable: false },
      { name: "url", type: "text", nullable: false },
      { name: "isActive", type: "tinyint(1)", nullable: true, default: "1" }
    ]
  });

  result.push({
    name: "app_settings",
    rowCount: 1,
    isTiDBCloud: false,
    columns: [
      { name: "key", type: "varchar(50)", nullable: false, key: "PRI" },
      { name: "value", type: "text", nullable: false }
    ]
  });

  res.json(result);
});

// 3. Command Console SQL Query Execution Endpoint
app.post("/api/db-query", async (req, res) => {
  const { sql } = req.body;
  if (!sql) {
    return res.status(400).json({ success: false, error: "SQL query statement missing" });
  }

  const queryStart = Date.now();
  let timeElapsed = 0;

  if (pool) {
    try {
      // Execute query directly against TiDB pool
      const [result, fields]: any = await pool.query(sql);
      timeElapsed = Date.now() - queryStart;

      if (Array.isArray(result)) {
        const columns = fields ? fields.map((f: any) => ({ name: f.name, type: f.type })) : [];
        return res.json({
          success: true,
          type: "SELECT",
          rows: result,
          columns,
          affectedRows: result.length,
          timeElapsedMs: timeElapsed,
          isLocalFallback: false
        });
      } else {
        return res.json({
          success: true,
          type: "COMMAND",
          rows: [],
          columns: [],
          affectedRows: result.affectedRows || 0,
          info: result.info || "",
          insertId: result.insertId || 0,
          timeElapsedMs: timeElapsed,
          isLocalFallback: false
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || "Unknown database runtime error",
        timeElapsedMs: Date.now() - queryStart
      });
    }
  }

  // Fallback simulator for sandboxing queries locally
  timeElapsed = Date.now() - queryStart;
  const sqlLower = sql.trim().toLowerCase();
  const local = getLocalData();
  
  if (sqlLower.startsWith("show tables")) {
    return res.json({
      success: true,
      type: "SELECT",
      rows: [
        { Tables_in_youtobia_local: "media_items" },
        { Tables_in_youtobia_local: "social_accounts" },
        { Tables_in_youtobia_local: "app_settings" }
      ],
      columns: [{ name: "Tables_in_youtobia_local" }],
      affectedRows: 3,
      timeElapsedMs: timeElapsed,
      isLocalFallback: true
    });
  }

  if (sqlLower.includes("from media_items")) {
    return res.json({
      success: true,
      type: "SELECT",
      rows: local.mediaItems,
      columns: Object.keys(local.mediaItems[0] || {}).map(k => ({ name: k })),
      affectedRows: local.mediaItems.length,
      timeElapsedMs: timeElapsed,
      isLocalFallback: true
    });
  }

  if (sqlLower.includes("from social_accounts")) {
    return res.json({
      success: true,
      type: "SELECT",
      rows: local.socialAccounts,
      columns: Object.keys(local.socialAccounts[0] || {}).map(k => ({ name: k })),
      affectedRows: local.socialAccounts.length,
      timeElapsedMs: timeElapsed,
      isLocalFallback: true
    });
  }

  if (sqlLower.includes("from app_settings")) {
    const settingsRows = [
      { key: "hero_video_url", value: local.heroVideoUrl }
    ];
    return res.json({
      success: true,
      type: "SELECT",
      rows: settingsRows,
      columns: [{ name: "key" }, { name: "value" }],
      affectedRows: 1,
      timeElapsedMs: timeElapsed,
      isLocalFallback: true
    });
  }

  return res.json({
    success: true,
    type: "SANDBOX_PREVIEW",
    rows: [],
    columns: [],
    affectedRows: 0,
    info: "SANDBOX PREVIEW: Statements successfully logged. To execute real-time modifications of direct distributed tables, enable active TiDB Cloud Database Synchronization.",
    timeElapsedMs: timeElapsed,
    isLocalFallback: true
  });
});

// Fetch all media items (blogs + vlogs)
app.get("/api/media-items", async (req, res) => {
  if (pool) {
    try {
      const [rows]: any = await pool.query("SELECT * FROM media_items ORDER BY id DESC");
      const mapped = rows.map((item: any) => {
        let tagsArr = [];
        try {
          tagsArr = typeof item.tags === "string" ? JSON.parse(item.tags) : (item.tags || []);
        } catch (_) {
          tagsArr = (item.tags || []);
        }
        return {
          ...item,
          likes: Number(item.likes || 0),
          tags: Array.isArray(tagsArr) ? tagsArr : []
        };
      });
      return res.json(mapped);
    } catch (error) {
      console.error("Database query failed, fetching local file values instead.", error);
    }
  }

  // Fallback
  const local = getLocalData();
  res.json(local.mediaItems);
});

// Submit / Upsert media item
app.post("/api/media-items", async (req, res) => {
  const item = req.body;
  if (!item.id || !item.title) {
    return res.status(400).json({ error: "Broken payload. Complete details." });
  }

  // Always write in local file system overlay so states stay coherent
  const local = getLocalData();
  const index = local.mediaItems.findIndex((i: any) => i.id === item.id);
  if (index > -1) {
    local.mediaItems[index] = item;
  } else {
    local.mediaItems.unshift(item);
  }
  saveLocalData(local);

  if (pool) {
    try {
      const tagsStr = JSON.stringify(item.tags || []);
      const [existing]: any = await pool.query("SELECT id FROM media_items WHERE id = ?", [item.id]);

      if (existing.length > 0) {
        await pool.query(
          "UPDATE media_items SET type = ?, title = ?, author = ?, date = ?, duration = ?, category = ?, excerpt = ?, content = ?, videoUrl = ?, tags = ?, gradientTheme = ? WHERE id = ?",
          [item.type, item.title, item.author, item.date, item.duration, item.category, item.excerpt, item.content, item.videoUrl || null, tagsStr, item.gradientTheme, item.id]
        );
      } else {
        await pool.query(
          "INSERT INTO media_items (id, type, title, author, date, duration, category, excerpt, content, videoUrl, likes, tags, gradientTheme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [item.id, item.type, item.title, item.author, item.date, item.duration, item.category, item.excerpt, item.content, item.videoUrl || null, item.likes || 0, tagsStr, item.gradientTheme]
        );
      }
      return res.json({ success: true, cloud: true });
    } catch (e) {
      console.error("Failed to insert/update in TiDB. Recorded locally.", e);
    }
  }

  res.json({ success: true, cloud: false });
});

// Remove a media item
app.delete("/api/media-items/:id", async (req, res) => {
  const id = req.params.id;
  
  // Local deletion
  const local = getLocalData();
  local.mediaItems = local.mediaItems.filter((m: any) => m.id !== id);
  saveLocalData(local);

  if (pool) {
    try {
      await pool.query("DELETE FROM media_items WHERE id = ?", [id]);
      return res.json({ success: true, cloud: true });
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ success: true, cloud: false });
});

// Upvote / Like an item
app.post("/api/media-items/:id/like", async (req, res) => {
  const id = req.params.id;
  let matchesLikes = 0;

  // Local upvote
  const local = getLocalData();
  const index = local.mediaItems.findIndex((m: any) => m.id === id);
  if (index > -1) {
    local.mediaItems[index].likes = (local.mediaItems[index].likes || 0) + 1;
    matchesLikes = local.mediaItems[index].likes;
  }
  saveLocalData(local);

  if (pool) {
    try {
      const [rows]: any = await pool.query("SELECT likes FROM media_items WHERE id = ?", [id]);
      if (rows.length > 0) {
        const cloudLikes = Number(rows[0].likes || 0) + 1;
        await pool.query("UPDATE media_items SET likes = ? WHERE id = ?", [cloudLikes, id]);
        matchesLikes = cloudLikes;
      }
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ success: true, likes: matchesLikes });
});

// Get social lists
app.get("/api/social-accounts", async (req, res) => {
  if (pool) {
    try {
      const [rows]: any = await pool.query("SELECT * FROM social_accounts ORDER BY id ASC");
      if (rows.length > 0) {
        const mapped = rows.map((r: any) => ({
          ...r,
          isActive: r.isActive === 1 || r.isActive === true
        }));
        return res.json(mapped);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const local = getLocalData();
  res.json(local.socialAccounts);
});

// Update entire social lists
app.post("/api/social-accounts", async (req, res) => {
  const accounts = req.body;
  if (!Array.isArray(accounts)) return res.status(400).json({ error: "Invalid array structure." });

  // Update locally
  const local = getLocalData();
  local.socialAccounts = accounts;
  saveLocalData(local);

  if (pool) {
    try {
      // Clear and rewrite table
      await pool.query("DELETE FROM social_accounts");
      for (const account of accounts) {
        await pool.query(
          "INSERT INTO social_accounts (id, platform, label, url, isActive) VALUES (?, ?, ?, ?, ?)",
          [account.id, account.platform, account.label, account.url, account.isActive ? 1 : 0]
        );
      }
      return res.json({ success: true, cloud: true });
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ success: true, cloud: false });
});

// Get background Hero Video URL
app.get("/api/hero-video", async (req, res) => {
  if (pool) {
    try {
      const [rows]: any = await pool.query("SELECT value FROM app_settings WHERE `key` = 'hero_video_url'");
      if (rows.length > 0) {
        return res.json({ url: rows[0].value });
      }
    } catch (e) {
      console.error(e);
    }
  }

  const local = getLocalData();
  res.json({ url: local.heroVideoUrl });
});

// Save background Hero Video URL
app.post("/api/hero-video", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL param missing." });

  const local = getLocalData();
  local.heroVideoUrl = url;
  saveLocalData(local);

  if (pool) {
    try {
      await pool.query(
        "INSERT INTO app_settings (`key`, value) VALUES ('hero_video_url', ?) ON CONFLICT (`key`) DO UPDATE SET value = ?",
        [url, url]
      );
      return res.json({ success: true, cloud: true });
    } catch (e) {
      console.error(e);
    }
  }

  res.json({ success: true, cloud: false });
});

// Vite & Static file configurations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware client container.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TiDB Cloud Full-stack server active at http://localhost:${PORT}`);
  });
}

startServer();
