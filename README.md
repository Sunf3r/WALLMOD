# ⭐ WALL-E 🤖 ⭐

### ✨ WALL-E is a **modularized** WhatsApp chat bot with some cool features. ✨

> ⚠️ » _WALL-E is still under development, feel free to contribute to this repo and leave a_ ⭐

---

# 🤔 What do you mean by "cool features"?:

- [x] Translate text;
- [x] Search on Google;
- [x] "Speak" in 5 languages;
- [x] Change its prefix just for you;
- [x] Remove background from images;
- [x] Create stickers with photos and gifs;
- [x] Rank group members by sent msgs count;
- [x] Mass delete group msgs for all members;
- [x] Run code in multiple programming languages;
- [x] Download videos and audios from many websites;

**and more.**

# 💭 How does it work and wtf is modularization?

1. The main thread connects to WhatsApp posing as a MacOS app (NodeJS).
2. There are two main threads, they divide the workload between themselves (Pm2 Clusters).
3. Each command and each event runs in a separate process (DENO).
4. They communicate with each other via http requests.
5. No thread retains cache. When necessary, it will ask DBCacher.
6. DBCacher stores the entire application cache and interacts with the database (PostgreSQL /
   Prisma).
7. This way, each structure can be completely restarted without affecting the others.

# 🤔 How to install?

### `1 -` 🛠️ Install runtimes and tools:

- [🦕 DENO 🦕](https://deno.com/)

> 🪧 » _Recommended version: 1.41 or higher_

- [💩 NodeJS 💩](https://nodejs.org/pt-br/)

> 🪧 » _Recommended version: 20 or higher_

- [🐍 Python 🐍](https://www.python.org/)

> 🪧 » _Recommended version: 3.11 or higher_

- [🐘 PostgreSQL 🐘](https://www.postgresql.org/download/)

> 🪧 » _Recommended version: 14 or higher_

- [☝️🤓 GIT ☝️🤓](https://git-scm.com/downloads)

> ⚠️ » _Only required to clone this repo_

**OPTIONAL TOOLS REQUIRED ONLY TO RUN CODE:**

- [🌙 LUA 🌙](https://www.lua.org/)

> 🪧 » _Recommended version: 5.4 or higher_

- [🔥 G++ 🔥]()

> 🪧 » _Recommended version: 11.4 or higher_

### `2 -` 📁 Download or clone the repository:

```bash
"Code" > "Download ZIP"

or

git clone https://github.com/Sunf3r/WALL-E # Clone this repo
```

### `3 -` 🧰 Install dependencies:

> 💡 » _Open the folder in terminal_

```bash
npm install # Download and build dependencies
npm install -g pm2 prisma # production packages
```

### `4 -` 🌿 Preparing the environment:

You can configure the bot however you want in the following files:

- `bot.json` (`settings/bot.json`)

```json
{
	"botOwners": [""], // owners can use eval and admin tools
	"botNumber": ""
}
```

> 💡 » _Rename "`bot.example.json`" to "`bot.json`"_

- `.env` (`.env.example`)

```env
DATABASE_URL="postgresql://role:password@host:port/db"
```

> 💡 » _Rename "`.env.example`" to "`.env`"_

- `db.json` (`settings/db.json`)

```json
{
	"userDefaults": {
		"prefix": ".",
		"language": "pt",
		"cacheLimit": 500
	},
	"groupDefaults": {
		"msgsCacheLimit": 200
	}
}
```

### `5 -` 🚀 Starting:

> 💡 » _If it's your first time running the bot, you need to format the database:_

```bash
npm run prisma:push
```

And finally:

```bash
pm2 start settings/ecosystem.config.cjs --attach
```

---

### I Hope you like the project :)
