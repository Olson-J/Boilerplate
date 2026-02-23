#!/usr/bin/env node

/**
 * Automated Setup Script for Next.js + Supabase Project
 * 
 * This script automates the initial project setup:
 * - Checks prerequisites (Node.js, Supabase CLI)
 * - Installs dependencies
 * - Starts Supabase local instance
 * - Configures environment variables
 * - Runs database migrations
 */

import { execSync, spawnSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n[${step}/8] ${message}`, 'cyan');
}

function logSuccess(message: string) {
  log(`✓ ${message}`, 'green');
}

function logError(message: string) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

function runCommand(command: string, description: string): string {
  try {
    const result = execSync(command, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`${description} failed: ${error.message}`);
  }
}

function checkPrerequisite(command: string, name: string, installInstructions: string): boolean {
  try {
    execSync(command, { stdio: 'ignore' });
    logSuccess(`${name} is installed`);
    return true;
  } catch {
    logError(`${name} is not installed`);
    log(`  ${installInstructions}`, 'yellow');
    return false;
  }
}

function isSupabaseRunning(): boolean {
  try {
    execSync('npx supabase status', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function extractSupabaseCredentials(): { url: string; anonKey: string } | null {
  try {
    const status = runCommand('npx supabase status', 'Get Supabase status');
    
    // Parse status output for API URL and anon key
    const urlMatch = status.match(/API URL: (.+)/);
    const keyMatch = status.match(/anon key: (.+)/);
    
    if (urlMatch && keyMatch) {
      return {
        url: urlMatch[1].trim(),
        anonKey: keyMatch[1].trim(),
      };
    }
    
    return null;
  } catch (error: any) {
    logError(`Failed to extract Supabase credentials: ${error.message}`);
    return null;
  }
}

function updateEnvFile(url: string, anonKey: string) {
  const envPath = join(process.cwd(), '.env.local');
  const envExamplePath = join(process.cwd(), '.env.local.example');
  
  let envContent = '';
  
  // Start with example if it exists
  if (existsSync(envExamplePath)) {
    envContent = readFileSync(envExamplePath, 'utf-8');
  }
  
  // Replace or add the Supabase variables
  const vars = {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  };
  
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      // Replace existing
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      // Add new
      envContent += `\n${key}=${value}`;
    }
  });
  
  // Ensure file ends with newline
  if (!envContent.endsWith('\n')) {
    envContent += '\n';
  }
  
  writeFileSync(envPath, envContent);
  logSuccess('Environment variables configured in .env.local');
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'bright');
  log('║     Next.js + Supabase Project Setup Script              ║', 'bright');
  log('╚═══════════════════════════════════════════════════════════╝', 'bright');
  
  let allPrereqsMet = true;
  
  // Step 1: Check prerequisites
  logStep(1, 'Checking prerequisites...');
  
  allPrereqsMet = checkPrerequisite(
    'node --version',
    'Node.js',
    'Install from https://nodejs.org/'
  ) && allPrereqsMet;
  
  allPrereqsMet = checkPrerequisite(
    'npm --version',
    'npm',
    'Comes with Node.js'
  ) && allPrereqsMet;
  
  const hasSupabaseCLI = checkPrerequisite(
    'npx supabase --version',
    'Supabase CLI',
    'Will be installed via npx'
  );
  
  if (!allPrereqsMet) {
    logError('\nSome prerequisites are missing. Please install them and try again.');
    process.exit(1);
  }
  
  // Step 2: Install dependencies
  logStep(2, 'Installing dependencies...');
  
  if (!existsSync(join(process.cwd(), 'node_modules'))) {
    log('Running npm install...');
    try {
      runCommand('npm install', 'npm install');
      logSuccess('Dependencies installed');
    } catch (error: any) {
      logError(error.message);
      process.exit(1);
    }
  } else {
    logSuccess('Dependencies already installed');
  }
  
  // Step 3: Check Supabase status
  logStep(3, 'Checking Supabase status...');
  
  const alreadyRunning = isSupabaseRunning();
  
  if (alreadyRunning) {
    logWarning('Supabase is already running');
    log('  Using existing instance');
  } else {
    logSuccess('Supabase is not running (will start)');
  }
  
  // Step 4: Start Supabase
  if (!alreadyRunning) {
    logStep(4, 'Starting Supabase...');
    log('This may take a few minutes on first run...');
    
    try {
      // Use spawnSync for better output handling with long-running commands
      const result = spawnSync('npx', ['supabase', 'start'], {
        stdio: 'inherit',
        shell: true,
      });
      
      if (result.status !== 0) {
        throw new Error('Supabase start failed');
      }
      
      logSuccess('Supabase started successfully');
    } catch (error: any) {
      logError(`Failed to start Supabase: ${error.message}`);
      log('\nTroubleshooting:', 'yellow');
      log('  - Make sure Docker is installed and running', 'yellow');
      log('  - Try running: npx supabase stop', 'yellow');
      log('  - Then run this script again', 'yellow');
      process.exit(1);
    }
  } else {
    logStep(4, 'Starting Supabase... (skipped - already running)');
  }
  
  // Step 5: Extract credentials
  logStep(5, 'Extracting Supabase credentials...');
  
  const credentials = extractSupabaseCredentials();
  
  if (!credentials) {
    logError('Failed to extract credentials from Supabase status');
    log('  Try running: npx supabase status', 'yellow');
    process.exit(1);
  }
  
  logSuccess('Credentials extracted');
  log(`  API URL: ${credentials.url}`, 'reset');
  
  // Step 6: Create/update .env.local
  logStep(6, 'Configuring environment variables...');
  
  try {
    updateEnvFile(credentials.url, credentials.anonKey);
  } catch (error: any) {
    logError(`Failed to update .env.local: ${error.message}`);
    process.exit(1);
  }
  
  // Step 7: Run migrations
  logStep(7, 'Running database migrations...');
  
  try {
    log('Running: npx supabase db reset');
    const result = spawnSync('npx', ['supabase', 'db', 'reset'], {
      stdio: 'inherit',
      shell: true,
    });
    
    if (result.status !== 0) {
      throw new Error('Migration failed');
    }
    
    logSuccess('Database migrations completed');
  } catch (error: any) {
    logError(`Database migration failed: ${error.message}`);
    log('  You can try running migrations manually:', 'yellow');
    log('  npx supabase db reset', 'yellow');
  }
  
  // Step 8: Run tests
  logStep(8, 'Running tests...');
  
  try {
    log('Running: npm test');
    const result = spawnSync('npm', ['test'], {
      stdio: 'inherit',
      shell: true,
    });
    
    if (result.status === 0) {
      logSuccess('All tests passed');
    } else {
      logWarning('Some tests failed - check output above');
    }
  } catch (error: any) {
    logWarning('Could not run tests - you can run them manually with: npm test');
  }
  
  // Success message
  log('\n╔═══════════════════════════════════════════════════════════╗', 'green');
  log('║                 Setup Complete! 🎉                        ║', 'green');
  log('╚═══════════════════════════════════════════════════════════╝', 'green');
  
  log('\nNext steps:', 'bright');
  log('  1. Start the development server:', 'reset');
  log('     npm run dev', 'cyan');
  log('\n  2. Open your browser:', 'reset');
  log('     http://localhost:3000', 'cyan');
  log('\n  3. View Supabase Studio:', 'reset');
  log('     http://localhost:54323', 'cyan');
  log('\n  4. Start building! 🚀', 'reset');
  
  log('\nUseful commands:', 'bright');
  log('  npm test              - Run tests', 'reset');
  log('  npm run type-check    - Check TypeScript types', 'reset');
  log('  npm run lint          - Lint code', 'reset');
  log('  npx supabase status   - Check Supabase status', 'reset');
  log('  npx supabase stop     - Stop Supabase', 'reset');
  log('');
}

// Run the setup
main().catch((error) => {
  logError(`\nSetup failed: ${error.message}`);
  process.exit(1);
});
