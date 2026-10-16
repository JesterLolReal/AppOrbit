const { spawn } = require('child_process');
const EventEmitter = require('events');

class JobQueue extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrency = options.concurrency || 1;
    this.jobs = new Map(); // id -> job object
    this.activeProcesses = new Map(); // id -> child_process
    this.isRunning = false;
    this.isPaused = false;
    this.history = [];
  }

  setConcurrency(limit) {
    this.concurrency = Math.max(1, Math.min(8, parseInt(limit, 10) || 1));
  }

  addJob(job) {
    const id = job.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const fullJob = {
      id,
      appId: job.appId,
      appName: job.appName,
      category: job.category,
      operation: job.operation || 'install', // 'install', 'update', 'uninstall'
      command: job.command,
      args: job.args || [],
      status: 'pending', // 'pending', 'running', 'succeeded', 'failed', 'cancelled', 'skipped'
      progress: 0,
      exitCode: null,
      logs: [],
      error: null,
      startTime: null,
      endTime: null,
      retryCount: 0
    };

    this.jobs.set(id, fullJob);
    this.emit('job-added', fullJob);
    return fullJob;
  }

  addBatch(jobs) {
    const added = [];
    for (const job of jobs) {
      added.push(this.addJob(job));
    }
    return added;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.emit('queue-started', { timestamp: Date.now() });

    try {
      await this._processQueue();
    } finally {
      this.isRunning = false;
      const report = this.generateReport();
      this.history.unshift(report);
      this.emit('queue-finished', report);
    }
  }

  async _processQueue() {
    while (this.isRunning) {
      if (this.isPaused) {
        await new Promise(r => setTimeout(r, 200));
        continue;
      }

      const activeCount = this.activeProcesses.size;
      const availableSlots = this.concurrency - activeCount;

      if (availableSlots <= 0) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      // Find pending jobs
      const pendingJobs = Array.from(this.jobs.values()).filter(j => j.status === 'pending');

      if (pendingJobs.length === 0 && activeCount === 0) {
        // Queue is completely done!
        break;
      }

      if (pendingJobs.length === 0) {
        // Active jobs still running
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      // Dispatch up to availableSlots jobs
      const toDispatch = pendingJobs.slice(0, availableSlots);
      for (const job of toDispatch) {
        this._executeJob(job);
      }

      await new Promise(r => setTimeout(r, 100));
    }
  }

  async _executeJob(job) {
    job.status = 'running';
    job.startTime = Date.now();
    job.progress = 10;
    this.emit('job-status', { jobId: job.id, status: job.status, progress: job.progress });
    this.appendLog(job.id, `Starting ${job.operation} for ${job.appName}...`);
    this.appendLog(job.id, `Command: ${job.command} ${job.args.join(' ')}`);

    return new Promise((resolve) => {
      let child;
      try {
        child = spawn(job.command, job.args, {
          shell: false,
          windowsHide: true,
          env: process.env
        });
      } catch (err) {
        job.status = 'failed';
        job.error = err.message;
        job.endTime = Date.now();
        this.appendLog(job.id, `Execution failure: ${err.message}`);
        this.emit('job-status', { jobId: job.id, status: job.status, error: job.error });
        resolve(job);
        return;
      }

      this.activeProcesses.set(job.id, child);

      child.stdout.on('data', (data) => {
        const text = data.toString();
        this.appendLog(job.id, text.trimEnd());
        
        // Dynamic progress heuristic
        if (text.includes('%') || text.includes('Downloading') || text.includes('Installing')) {
          job.progress = Math.min(90, job.progress + 15);
          this.emit('job-progress', { jobId: job.id, progress: job.progress });
        }
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        this.appendLog(job.id, `[stderr] ${text.trimEnd()}`);
      });

      child.on('error', (err) => {
        job.status = 'failed';
        job.error = err.message;
        job.endTime = Date.now();
        this.appendLog(job.id, `Process error: ${err.message}`);
        this.emit('job-status', { jobId: job.id, status: job.status, error: job.error });
      });

      child.on('close', (code) => {
        this.activeProcesses.delete(job.id);
        job.exitCode = code;
        job.endTime = Date.now();

        if (job.status === 'cancelled') {
          this.appendLog(job.id, 'Job was cancelled by user.');
        } else if (code === 0) {
          job.status = 'succeeded';
          job.progress = 100;
          this.appendLog(job.id, `Completed successfully with exit code 0.`);
        } else {
          job.status = 'failed';
          job.error = `Process exited with code ${code}`;
          this.appendLog(job.id, `Failed with exit code ${code}.`);
        }

        this.emit('job-status', {
          jobId: job.id,
          status: job.status,
          exitCode: job.exitCode,
          progress: job.progress
        });

        resolve(job);
      });
    });
  }

  appendLog(jobId, line) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    const entry = {
      timestamp: new Date().toLocaleTimeString(),
      text: line
    };
    job.logs.push(entry);
    this.emit('job-log', { jobId, entry });
  }

  cancelJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'pending') {
      job.status = 'cancelled';
      job.endTime = Date.now();
      this.emit('job-status', { jobId, status: 'cancelled' });
      return true;
    }

    if (job.status === 'running') {
      job.status = 'cancelled';
      const child = this.activeProcesses.get(jobId);
      if (child) {
        try {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t']);
          } else {
            child.kill('SIGTERM');
          }
        } catch (e) {
          // ignore kill error
        }
      }
      return true;
    }

    return false;
  }

  cancelAll() {
    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'pending' || job.status === 'running') {
        this.cancelJob(id);
      }
    }
  }

  retryJob(jobId, autoStart = false) {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    if (job.status === 'failed' || job.status === 'cancelled') {
      job.status = 'pending';
      job.error = null;
      job.progress = 0;
      job.retryCount = (job.retryCount || 0) + 1;
      this.appendLog(jobId, `Queued for retry (attempt #${job.retryCount + 1})...`);
      this.emit('job-status', { jobId, status: 'pending', progress: 0 });
      if (autoStart && !this.isRunning) {
        this.start();
      }
      return true;
    }
    return false;
  }

  clearFinished() {
    for (const [id, job] of Array.from(this.jobs.entries())) {
      if (['succeeded', 'failed', 'cancelled', 'skipped'].includes(job.status)) {
        this.jobs.delete(id);
      }
    }
    this.emit('queue-updated');
  }

  generateReport() {
    const all = Array.from(this.jobs.values());
    const succeeded = all.filter(j => j.status === 'succeeded').length;
    const failed = all.filter(j => j.status === 'failed').length;
    const cancelled = all.filter(j => j.status === 'cancelled').length;
    const skipped = all.filter(j => j.status === 'skipped').length;
    
    return {
      timestamp: new Date().toISOString(),
      total: all.length,
      succeeded,
      failed,
      cancelled,
      skipped,
      jobs: all.map(j => ({
        id: j.id,
        appId: j.appId,
        appName: j.appName,
        status: j.status,
        operation: j.operation,
        exitCode: j.exitCode,
        error: j.error,
        durationMs: (j.endTime && j.startTime) ? (j.endTime - j.startTime) : 0
      }))
    };
  }

  getSnapshot() {
    return {
      isRunning: this.isRunning,
      concurrency: this.concurrency,
      jobs: Array.from(this.jobs.values())
    };
  }
}

module.exports = JobQueue;
