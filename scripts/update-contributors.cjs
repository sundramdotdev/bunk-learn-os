const fs = require('fs');
const https = require('https');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.REPO || process.env.GITHUB_REPOSITORY; 

if (!GITHUB_TOKEN) {
    console.error("No GITHUB_TOKEN provided.");
    process.exit(1);
}

if (!REPO) {
    console.error("No REPO provided. Ensure GITHUB_REPOSITORY is set.");
    process.exit(1);
}

const CONTRIBUTORS_FILE = path.join(__dirname, '../src/data/contributors.json');

// Helper to make API requests
function fetchGitHubAPI(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: endpoint,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js/Contributors-Updater',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`API Error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function updateContributors() {
    try {
        console.log(`Fetching merged PRs for ${REPO}...`);
        
        let allPrs = [];
        let page = 1;
        let keepFetching = true;
        
        while (keepFetching) {
            const prs = await fetchGitHubAPI(`/repos/${REPO}/pulls?state=closed&per_page=100&page=${page}`);
            if (prs.length === 0) {
                keepFetching = false;
            } else {
                allPrs = allPrs.concat(prs);
                page++;
            }
        }
        
        const mergedPrs = allPrs.filter(pr => pr.merged_at !== null);
        console.log(`Found ${mergedPrs.length} merged PRs.`);

        const contributorStats = {};
        for (const pr of mergedPrs) {
            const user = pr.user;
            if (!user || user.type === 'Bot') continue;

            if (!contributorStats[user.login]) {
                contributorStats[user.login] = {
                    username: user.login,
                    avatar: user.avatar_url,
                    github: user.html_url,
                    name: null,
                    contributions: 0,
                    mergedPRs: []
                };
            }
            
            contributorStats[user.login].contributions++;
            contributorStats[user.login].mergedPRs.push({
                number: pr.number,
                title: pr.title,
                url: pr.html_url,
                mergedAt: pr.merged_at
            });
        }
        
        // Sort PRs and fetch names
        for (const login in contributorStats) {
            const stats = contributorStats[login];
            stats.mergedPRs.sort((a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime());
            try {
                const userProfile = await fetchGitHubAPI(`/users/${login}`);
                stats.name = userProfile.name || login;
            } catch (e) {
                console.warn(`Could not fetch details for ${login}, using username instead.`);
                stats.name = login;
            }
        }

        let existingContributors = [];
        if (fs.existsSync(CONTRIBUTORS_FILE)) {
            try {
                const fileContent = fs.readFileSync(CONTRIBUTORS_FILE, 'utf-8');
                existingContributors = JSON.parse(fileContent);
            } catch (e) {
                console.error("Failed to parse existing contributors.json:", e);
                // We keep existingContributors as empty array to not fail the script completely,
                // but Phase 15 says: "If API fails, do not break website... do not overwrite with empty".
                // Here, if parsing fails, it's safer to exit so we don't clobber it.
                process.exit(1);
            }
        }

        const existingMap = new Map();
        for (const c of existingContributors) {
            let username = c.username;
            if (!username && c.github) {
                const parts = c.github.split('/');
                username = parts[parts.length - 1];
            }
            if (username) {
                existingMap.set(username.toLowerCase(), c);
            }
        }

        const newContributorsList = [];

        for (const login in contributorStats) {
            const stats = contributorStats[login];
            const lowerLogin = login.toLowerCase();
            
            if (existingMap.has(lowerLogin)) {
                const existing = existingMap.get(lowerLogin);
                newContributorsList.push({
                    ...existing,
                    name: existing.name || stats.name,
                    username: stats.username,
                    avatar: stats.avatar,
                    github: stats.github,
                    contributions: stats.contributions,
                    mergedPRs: stats.mergedPRs
                });
                existingMap.delete(lowerLogin);
            } else {
                newContributorsList.push({
                    name: stats.name,
                    username: stats.username,
                    avatar: stats.avatar,
                    github: stats.github,
                    contributions: stats.contributions,
                    mergedPRs: stats.mergedPRs,
                    role: "Contributor"
                });
            }
        }

        for (const remaining of existingMap.values()) {
            newContributorsList.push(remaining);
        }

        newContributorsList.sort((a, b) => {
            const countA = a.contributions || 0;
            const countB = b.contributions || 0;
            if (countA !== countB) {
                return countB - countA;
            }
            const dateA = a.mergedPRs && a.mergedPRs.length > 0 ? new Date(a.mergedPRs[0].mergedAt).getTime() : 0;
            const dateB = b.mergedPRs && b.mergedPRs.length > 0 ? new Date(b.mergedPRs[0].mergedAt).getTime() : 0;
            return dateB - dateA;
        });

        fs.writeFileSync(CONTRIBUTORS_FILE, JSON.stringify(newContributorsList, null, 2), 'utf-8');
        console.log('Successfully updated contributors.json');

    } catch (error) {
        console.error("Failed to update contributors:", error);
        process.exit(1);
    }
}

updateContributors();
