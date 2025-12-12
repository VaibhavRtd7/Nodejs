const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');


const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'exams.json');


app.use(cors()); // allow requests from Angular dev server
app.use(express.json());


async function loadData() {
    try {
        if (!(await fs.pathExists(DATA_FILE))) {
            await fs.writeJson(DATA_FILE, { exams: [] }, { spaces: 2 });
        }
        return fs.readJson(DATA_FILE);
    } catch (e) {
        console.error('loadData error', e);
        return { exams: [] };
    }
}
async function saveData(data) {
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
}


// In-memory timers
const timers = new Map();


async function autoFinish(examId) {
    const data = await loadData();
    const exam = data.exams.find(e => e.id === examId);
    if (!exam || exam.status === 'finished') return;
    exam.status = 'finished';
    exam.finishedAt = new Date().toISOString();
    exam.submittedByAuto = true;
    await saveData(data);
    if (timers.has(examId)) { clearTimeout(timers.get(examId)); timers.delete(examId); }
    console.log(`Auto-finished exam ${examId}`);
}


function scheduleAutoFinish(exam) {
    if (timers.has(exam.id)) { clearTimeout(timers.get(exam.id)); timers.delete(exam.id); }
    if (exam.status !== 'active') return;
    const msLeft = new Date(exam.endsAt).getTime() - Date.now();
    if (msLeft <= 0) { autoFinish(exam.id).catch(console.error); return; }
    const t = setTimeout(() => autoFinish(exam.id).catch(console.error), msLeft);
    timers.set(exam.id, t);
}


// Re-schedule on startup
(async () => {
    const data = await loadData();
    for (const e of data.exams) {
        if (e.status === 'active') scheduleAutoFinish(e);
    }
})();


// POST /exam/start
app.post('/exam/start', async (req, res) => {
    const { studentId } = req.body || {};
    const durationHours = 3; // fixed per requirement
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + durationHours * 60 * 60 * 1000);


    const exam = {
        id: uuidv4(),
        studentId: studentId || 'anonymous',
        status: 'active',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        finishedAt: null,
        submittedByAuto: false,
        answers: null
    };


    const data = await loadData();
    data.exams.push(exam);
    await saveData(data);
    scheduleAutoFinish(exam);


    res.status(201).json({ examId: exam.id, startsAt: exam.startsAt, endsAt: exam.endsAt });
});

// GET /exam/:id/time
app.get('/exam/:id/time', async (req, res) => {
    const id = req.params.id;
    const data = await loadData();
    const exam = data.exams.find(e => e.id === id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });


    const now = Date.now();
    const ends = new Date(exam.endsAt).getTime();
    const remainingMs = Math.max(0, ends - now);
    const h = Math.floor(remainingMs / 3600000);
    const m = Math.floor((remainingMs % 3600000) / 60000);
    const s = Math.floor((remainingMs % 60000) / 1000);
    const remainingReadable = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;


    res.json({ examId: exam.id, status: exam.status, remainingMs, remainingReadable, endsAt: exam.endsAt });
});


// POST /exam/:id/submit
app.post('/exam/:id/submit', async (req, res) => {
    const id = req.params.id;
    const { answers } = req.body || {};
    const data = await loadData();
    const exam = data.exams.find(e => e.id === id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });


    if (exam.status === 'finished') {
        return res.status(400).json({ error: 'Exam already finished', finishedAt: exam.finishedAt, submittedByAuto: exam.submittedByAuto });
    }


    const now = Date.now();
    const ends = new Date(exam.endsAt).getTime();
    if (now > ends) {
        exam.status = 'finished';
        exam.finishedAt = new Date().toISOString();
        exam.submittedByAuto = true;
        await saveData(data);
        if (timers.has(exam.id)) { clearTimeout(timers.get(exam.id)); timers.delete(exam.id); }
        return res.status(400).json({ error: 'Time is up. Submission not accepted; exam auto-finished.' });
    }


    exam.status = 'finished';
    exam.finishedAt = new Date().toISOString();
    exam.answers = answers || null;
    exam.submittedByAuto = false;
    await saveData(data);
    if (timers.has(exam.id)) { clearTimeout(timers.get(exam.id)); timers.delete(exam.id); }


    res.json({ message: 'Submission accepted', finishedAt: exam.finishedAt });
});


// For dev: list exams
app.get('/exams', async (req, res) => {
    const data = await loadData();
    res.json(data.exams);
});


app.listen(PORT, () => console.log(`Backend running: http://localhost:${PORT}`));