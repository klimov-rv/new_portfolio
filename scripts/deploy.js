import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
    sourceDir: path.resolve(__dirname, '..', '.output', 'public'),
    targetDir: path.resolve(__dirname, '..', 'dist_gh'),
    remoteUrl: 'https://github.com/klimov-rv/klimov-rv.github.io',
    branch: 'master',
    gitignoreFiles: ['.git', '.gitignore']
};

function validateDirectory(dir, name) {
    if (!fs.existsSync(dir)) {
        throw new Error(`${name} directory not found: ${dir}`);
    }
}

function cleanDirectory(dir) {
    const gitignoreFiles = new Set(CONFIG.gitignoreFiles);

    const entries = fs.readdirSync(dir);
    let deletedCount = 0;

    for (const entry of entries) {
        if (gitignoreFiles.has(entry)) {
            console.log(`  ⏭️  Skipping: ${entry}`);
            continue;
        }

        const fullPath = path.join(dir, entry);
        fs.rmSync(fullPath, { recursive: true, force: true });
        deletedCount++;
    }

    console.log(`  ✅ Removed ${deletedCount} items`);
}

function copyDirectory(source, target) {
    const entries = fs.readdirSync(source, { withFileTypes: true });
    let copiedCount = 0;

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(targetPath, { recursive: true });
            const subCount = copyDirectory(sourcePath, targetPath);
            copiedCount += subCount;
        } else {
            fs.copyFileSync(sourcePath, targetPath);
            copiedCount++;
        }
    }

    return copiedCount;
}

function executeGitCommands(targetDir, remoteUrl, branch) {
    const commands = [
        {
            cmd: 'git add .',
            msg: 'Adding all files to git'
        },
        {
            cmd: 'git commit -m "Deploy: auto-generated update"',
            msg: 'Committing changes',
            ignoreError: true
        },
        {
            cmd: 'git pull --rebase',
            msg: 'Pulling latest changes',
            ignoreError: true
        },
        {
            cmd: `git push ${remoteUrl} ${branch}`,
            msg: 'Pushing to remote'
        }
    ];

    for (const { cmd, msg, ignoreError } of commands) {
        console.log(`  🔄 ${msg}...`);
        try {
            execSync(cmd, {
                cwd: targetDir,
                stdio: 'pipe'
            });
            console.log(`  ✅ Done`);
        } catch (error) {
            if (ignoreError) {
                console.log(`  ℹ️  ${error.message.trim()}`);
            } else {
                throw error;
            }
        }
    }
}

// Главная функция
async function deploy() {
    console.log('🚀 Starting deploy process...\n');

    try {
        // Валидация
        console.log('📋 Validating directories...');
        validateDirectory(CONFIG.sourceDir, 'Source');
        validateDirectory(CONFIG.targetDir, 'Target');

        // Проверяем что в target есть .git
        if (!fs.existsSync(path.join(CONFIG.targetDir, '.git'))) {
            throw new Error('Target directory is not a git repository');
        }

        // Очистка
        console.log('\n🧹 Cleaning target directory...');
        cleanDirectory(CONFIG.targetDir);

        // Копирование
        console.log('\n📦 Copying files...');
        const copiedCount = copyDirectory(CONFIG.sourceDir, CONFIG.targetDir);
        console.log(`  ✅ Copied ${copiedCount} files`);

        // Git операции
        console.log('\n📤 Git operations...');
        executeGitCommands(CONFIG.targetDir, CONFIG.remoteUrl, CONFIG.branch);

        console.log('\n✨ Deploy completed successfully!');

    } catch (error) {
        console.error('\n❌ Deploy failed:', error.message);
        process.exit(1);
    }
}

deploy();