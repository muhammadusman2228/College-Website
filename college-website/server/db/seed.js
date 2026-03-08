/* =====================================================
   db/seed.js – Database Seeder
   Run: node db/seed.js
   ===================================================== */

'use strict';

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getDb, createTables, run, get } = require('./database');

async function seed() {
    console.log('🌱 Seeding database...');

    await getDb();
    createTables();

    /* ── Students ──────────────────────────────────────── */
    const students = [
        {
            id: 'S001', name: 'Sara Ahmed', email: 'sara@college.edu', password: 'password123',
            rollNo: '2024-CS-001', cnic: '35201-1234567-1', program: 'BS Computer Science',
            semester: '4th', section: 'A', dob: '2004-05-15', phone: '+92-300-1234567',
            address: 'House 24, Street 5, Gulberg, Lahore', guardian: 'Mr. Arif Ahmed',
            guardianPhone: '+92-321-7654321', gpa: 3.75, status: 'Active',
            admissionDate: '2024-09-01', avatarInitials: 'SA',
        },
        {
            id: 'S002', name: 'Ali Hassan', email: 'ali@college.edu', password: 'pass456',
            rollNo: '2024-EE-012', cnic: '35201-9876543-2', program: 'BS Electrical Engineering',
            semester: '2nd', section: 'B', dob: '2005-02-20', phone: '+92-311-9876543',
            address: 'Flat 3B, Model Town, Lahore', guardian: 'Mr. Tariq Hassan',
            guardianPhone: '+92-333-1122334', gpa: 3.20, status: 'Active',
            admissionDate: '2025-01-15', avatarInitials: 'AH',
        },
        {
            id: 'S003', name: 'Fatima Khan', email: 'fatima@college.edu', password: 'khan789',
            rollNo: '2023-BBA-007', cnic: '35202-7654321-3', program: 'BBA',
            semester: '6th', section: 'C', dob: '2003-11-08', phone: '+92-333-4455667',
            address: 'Bahria Town, Rawalpindi', guardian: 'Mr. Imran Khan',
            guardianPhone: '+92-345-6677889', gpa: 3.90, status: 'Active',
            admissionDate: '2023-09-01', avatarInitials: 'FK',
        }
    ];

    for (const s of students) {
        const existing = get('SELECT id FROM students WHERE id = ?', [s.id]);
        if (existing) { console.log(`  ↳ Student ${s.id} already exists, skipping.`); continue; }
        const hash = bcrypt.hashSync(s.password, 10);
        run(
            `INSERT INTO students (id,name,email,password_hash,roll_no,cnic,program,semester,section,dob,phone,address,guardian,guardian_phone,gpa,status,admission_date,avatar_initials)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [s.id, s.name, s.email, hash, s.rollNo, s.cnic, s.program, s.semester, s.section, s.dob, s.phone, s.address, s.guardian, s.guardianPhone, s.gpa, s.status, s.admissionDate, s.avatarInitials]
        );
        console.log(`  ✓ Student: ${s.name} (${s.email})`);
    }

    /* ── Results ───────────────────────────────────────── */
    const resultsData = [
        // S001
        {
            sid: 'S001', sem: '1st Semester (Fall 2024)', ord: 1, gpa: 3.55, subjects: [
                { code: 'CS-101', name: 'Introduction to Computing', cr: 3, marks: 88, grade: 'A' },
                { code: 'MATH-101', name: 'Calculus I', cr: 3, marks: 79, grade: 'B+' },
                { code: 'ENG-101', name: 'English Composition', cr: 3, marks: 85, grade: 'A' },
                { code: 'PHY-101', name: 'Physics I', cr: 3, marks: 72, grade: 'B' },
                { code: 'ISL-101', name: 'Islamic Studies', cr: 2, marks: 90, grade: 'A+' },
            ]
        },
        {
            sid: 'S001', sem: '2nd Semester (Spring 2025)', ord: 2, gpa: 3.75, subjects: [
                { code: 'CS-102', name: 'Programming Fundamentals', cr: 3, marks: 92, grade: 'A+' },
                { code: 'MATH-102', name: 'Calculus II', cr: 3, marks: 83, grade: 'A' },
                { code: 'CS-103', name: 'Digital Logic Design', cr: 3, marks: 77, grade: 'B+' },
                { code: 'ENG-102', name: 'Technical Writing', cr: 3, marks: 88, grade: 'A' },
                { code: 'PAK-101', name: 'Pakistan Studies', cr: 2, marks: 80, grade: 'A' },
            ]
        },
        {
            sid: 'S001', sem: '3rd Semester (Fall 2025)', ord: 3, gpa: 3.85, subjects: [
                { code: 'CS-201', name: 'Data Structures & Algorithms', cr: 3, marks: 85, grade: 'A' },
                { code: 'CS-202', name: 'Object Oriented Programming', cr: 3, marks: 91, grade: 'A+' },
                { code: 'MATH-201', name: 'Discrete Mathematics', cr: 3, marks: 74, grade: 'B+' },
                { code: 'CS-203', name: 'Database Systems', cr: 3, marks: 88, grade: 'A' },
                { code: 'HUM-201', name: 'Communication Skills', cr: 2, marks: 93, grade: 'A+' },
            ]
        },
        // S002
        {
            sid: 'S002', sem: '1st Semester (Fall 2025)', ord: 1, gpa: 3.20, subjects: [
                { code: 'EE-101', name: 'Basic Electrical Engineering', cr: 3, marks: 75, grade: 'B+' },
                { code: 'MATH-101', name: 'Calculus I', cr: 3, marks: 68, grade: 'B' },
                { code: 'ENG-101', name: 'English Composition', cr: 3, marks: 82, grade: 'A' },
                { code: 'PHY-101', name: 'Physics I', cr: 3, marks: 71, grade: 'B' },
                { code: 'ISL-101', name: 'Islamic Studies', cr: 2, marks: 88, grade: 'A' },
            ]
        },
        // S003
        {
            sid: 'S003', sem: '1st Semester (Fall 2023)', ord: 1, gpa: 3.90, subjects: [
                { code: 'BBA-101', name: 'Principles of Management', cr: 3, marks: 95, grade: 'A+' },
                { code: 'MATH-101', name: 'Business Mathematics', cr: 3, marks: 88, grade: 'A' },
                { code: 'ENG-101', name: 'Business Communication', cr: 3, marks: 91, grade: 'A+' },
                { code: 'ACC-101', name: 'Financial Accounting', cr: 3, marks: 85, grade: 'A' },
                { code: 'ISL-101', name: 'Islamic Studies', cr: 2, marks: 93, grade: 'A+' },
            ]
        },
    ];

    for (const sem of resultsData) {
        const existing = get('SELECT id FROM results WHERE student_id = ? AND semester_label = ? LIMIT 1', [sem.sid, sem.sem]);
        if (existing) continue;
        for (const sub of sem.subjects) {
            run(
                `INSERT INTO results (student_id,semester_label,semester_order,subject_code,subject_name,credit,marks,total_marks,grade,semester_gpa)
         VALUES (?,?,?,?,?,?,?,100,?,?)`,
                [sem.sid, sem.sem, sem.ord, sub.code, sub.name, sub.cr, sub.marks, sub.grade, sem.gpa]
            );
        }
        console.log(`  ✓ Results: ${sem.sid} – ${sem.sem}`);
    }

    /* ── Fee Records ───────────────────────────────────── */
    const feeData = [
        {
            sid: 'S001', items: [
                { title: 'Tuition Fee – Spring 2025', amount: 40000, due: '2025-02-28', status: 'Paid', paid: '2025-02-10' },
                { title: 'Library Charges', amount: 2000, due: '2025-02-28', status: 'Paid', paid: '2025-02-10' },
                { title: 'Lab Fee – Spring 2025', amount: 8000, due: '2025-02-28', status: 'Paid', paid: '2025-02-10' },
                { title: 'Exam Fee – Mid Term', amount: 5000, due: '2025-03-15', status: 'Pending', paid: null },
                { title: 'Sports Fund', amount: 2000, due: '2025-03-31', status: 'Pending', paid: null },
                { title: 'Alumni Association Fee', amount: 1000, due: '2025-04-30', status: 'Overdue', paid: null },
                { title: 'Development Fund', amount: 5000, due: '2025-03-10', status: 'Overdue', paid: null },
                { title: 'ID Card & Documents', amount: 500, due: '2025-01-15', status: 'Paid', paid: '2025-01-10' },
                { title: 'Internet & IT Services', amount: 3500, due: '2025-02-28', status: 'Paid', paid: '2025-02-10' },
                { title: 'Student Welfare Fund', amount: 8000, due: '2025-03-31', status: 'Pending', paid: null },
            ]
        },
        {
            sid: 'S002', items: [
                { title: 'Tuition Fee – Spring 2025', amount: 42000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
                { title: 'Lab Fee', amount: 10000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
                { title: 'Library Charges', amount: 2000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
                { title: 'Exam Fee', amount: 5000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
                { title: 'Sports Fund', amount: 2000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
                { title: 'Development Fund', amount: 4000, due: '2025-02-28', status: 'Paid', paid: '2025-02-05' },
            ]
        },
        {
            sid: 'S003', items: [
                { title: 'Tuition Fee – Spring 2025', amount: 35000, due: '2025-02-28', status: 'Paid', paid: '2025-01-30' },
                { title: 'Library Charges', amount: 2000, due: '2025-02-28', status: 'Paid', paid: '2025-01-30' },
                { title: 'Exam Fee', amount: 3000, due: '2025-03-20', status: 'Pending', paid: null },
                { title: 'Sports Fund', amount: 2000, due: '2025-03-31', status: 'Pending', paid: null },
                { title: 'Convocation Fee', amount: 5000, due: '2025-04-15', status: 'Pending', paid: null },
                { title: 'Development Fund', amount: 3000, due: '2025-02-28', status: 'Paid', paid: '2025-01-30' },
                { title: 'Student Welfare Fund', amount: 5000, due: '2025-02-28', status: 'Paid', paid: '2025-01-30' },
            ]
        },
    ];

    for (const fd of feeData) {
        const existing = get('SELECT id FROM fee_records WHERE student_id = ? LIMIT 1', [fd.sid]);
        if (existing) continue;
        for (const item of fd.items) {
            run(
                `INSERT INTO fee_records (student_id,title,amount,due_date,status,paid_on) VALUES (?,?,?,?,?,?)`,
                [fd.sid, item.title, item.amount, item.due, item.status, item.paid]
            );
        }
        console.log(`  ✓ Fee records: ${fd.sid}`);
    }

    /* ── Timetables ────────────────────────────────────── */
    const timetables = [
        {
            sid: 'S001', prog: 'BS Computer Science – 4th Semester', days: [
                { day: 'Monday', p: ['CS-201 DSA', 'CS-202 OOP', 'MATH-201 DM', 'Break/Lunch', 'CS-203 DB', 'Free', 'CS-201 DSA Lab'] },
                { day: 'Tuesday', p: ['CS-202 OOP Lab', 'CS-202 OOP Lab', 'ENG-201 Comm', 'ENG-201 Comm', 'Break/Lunch', 'MATH-201 DM', 'Free'] },
                { day: 'Wednesday', p: ['CS-201 DSA', 'Free', 'CS-203 DB Lab', 'CS-203 DB Lab', 'Break/Lunch', 'CS-202 OOP', 'MATH-201 DM'] },
                { day: 'Thursday', p: ['MATH-201 DM', 'CS-201 DSA', 'ENG-201 Comm', 'Break/Lunch', 'CS-203 DB', 'Free', 'Free'] },
                { day: 'Friday', p: ['CS-202 OOP', 'CS-203 DB', 'Free', 'Friday Prayer', 'Free', 'MATH-201 DM', 'Free'] },
            ]
        },
        {
            sid: 'S002', prog: 'BS Electrical Engineering – 2nd Semester', days: [
                { day: 'Monday', p: ['EE-102 Circuits', 'PHY-102 Physics', 'MATH-102 Calc', 'Break/Lunch', 'EE-102 Lab', 'EE-102 Lab', 'Free'] },
                { day: 'Tuesday', p: ['MATH-102 Calc', 'EE-103 Digital', 'EE-103 Digital', 'Break/Lunch', 'PHY-102 Physics', 'Free', 'Free'] },
                { day: 'Wednesday', p: ['EE-102 Circuits', 'ENG-102 Tech', 'ENG-102 Tech', 'Break/Lunch', 'MATH-102 Calc', 'EE-103 Digital', 'Free'] },
                { day: 'Thursday', p: ['PHY-102 Phys Lab', 'PHY-102 Phys Lab', 'EE-103 Digital', 'Break/Lunch', 'EE-102 Circuits', 'MATH-102 Calc', 'Free'] },
                { day: 'Friday', p: ['ENG-102 Tech', 'Free', 'Free', 'Friday Prayer', 'Free', 'Free', 'Free'] },
            ]
        },
        {
            sid: 'S003', prog: 'BBA – 6th Semester', days: [
                { day: 'Monday', p: ['MKT-301 Marketing', 'FIN-301 Finance', 'HRM-301 HR', 'Break/Lunch', 'MKT-301 Marketing', 'Free', 'Free'] },
                { day: 'Tuesday', p: ['FIN-301 Finance', 'ACC-301 Audit', 'ACC-301 Audit', 'Break/Lunch', 'HRM-301 HR', 'Free', 'Free'] },
                { day: 'Wednesday', p: ['MKT-301 Marketing', 'FIN-301 Finance', 'Free', 'Break/Lunch', 'ACC-301 Audit', 'HRM-301 HR', 'Free'] },
                { day: 'Thursday', p: ['HRM-301 HR', 'ACC-301 Audit', 'MKT-301 Lab', 'MKT-301 Lab', 'Break/Lunch', 'FIN-301 Finance', 'Free'] },
                { day: 'Friday', p: ['FIN-301 Finance', 'Free', 'Free', 'Friday Prayer', 'Free', 'Free', 'Free'] },
            ]
        },
    ];

    for (const tt of timetables) {
        const existing = get('SELECT id FROM timetable WHERE student_id = ? LIMIT 1', [tt.sid]);
        if (existing) continue;
        for (const d of tt.days) {
            run(
                `INSERT INTO timetable (student_id,program,day,period_1,period_2,period_3,period_4,period_5,period_6,period_7)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [tt.sid, tt.prog, d.day, d.p[0], d.p[1], d.p[2], d.p[3], d.p[4], d.p[5], d.p[6]]
            );
        }
        console.log(`  ✓ Timetable: ${tt.sid}`);
    }

    /* ── Announcements ─────────────────────────────────── */
    const anns = [
        { title: 'Mid-Term Examinations Schedule 2025', category: 'Exams', author: 'Examination Department', excerpt: 'Mid-term examinations for all departments will commence from March 20, 2025. The detailed schedule has been posted on the college notice board. All students are advised to check their exam timetables.', date: '2026-03-01', icon: 'fa-solid fa-calendar-check' },
        { title: 'Annual College Sports Week – Registration Open', category: 'Events', author: 'Sports Committee', excerpt: 'The Annual Sports Week will be held from April 10–15, 2025. Students interested in participating in cricket, football, basketball, and athletics can register with their department representatives.', date: '2026-02-25', icon: 'fa-solid fa-trophy' },
        { title: 'Admissions Open for Fall 2025', category: 'Admissions', author: 'Admissions Office', excerpt: 'Greenfield College is pleased to announce that admissions for the Fall 2025 session are now open. Applications are invited for BS, BBA, and associate programs. Merit-based scholarships are available.', date: '2026-02-20', icon: 'fa-solid fa-graduation-cap' },
    ];

    for (const ann of anns) {
        const existing = get('SELECT id FROM announcements WHERE title = ?', [ann.title]);
        if (existing) continue;
        run(
            `INSERT INTO announcements (title,category,author,excerpt,date,icon) VALUES (?,?,?,?,?,?)`,
            [ann.title, ann.category, ann.author, ann.excerpt, ann.date, ann.icon]
        );
    }
    console.log('  ✓ Announcements seeded');

    /* ── Admissions ────────────────────────────────────── */
    const admissions = [
        { id: 'ADM-001', name: 'Bilal Raza', program: 'BS Computer Science', cnic: '35201-1112223-4', email: 'bilal.raza@mail.com', status: 'Approved', date: '2026-03-01' },
        { id: 'ADM-002', name: 'Sana Malik', program: 'BBA', cnic: '35202-3334445-6', email: 'sana.malik@mail.com', status: 'Pending', date: '2026-03-03' },
        { id: 'ADM-003', name: 'Usman Tariq', program: 'BS Electrical Engineering', cnic: '35203-5556667-8', email: 'usman.tariq@mail.com', status: 'Pending', date: '2026-03-05' },
        { id: 'ADM-004', name: 'Ayesha Noor', program: 'BS Computer Science', cnic: '35204-7778889-0', email: 'ayesha.noor@mail.com', status: 'Rejected', date: '2026-03-02' },
        { id: 'ADM-005', name: 'Kamran Sheikh', program: 'BBA', cnic: '35205-9990001-2', email: 'kamran.sheikh@mail.com', status: 'Approved', date: '2026-03-04' },
    ];

    for (const adm of admissions) {
        const existing = get('SELECT id FROM admissions WHERE id = ?', [adm.id]);
        if (existing) continue;
        run(
            `INSERT INTO admissions (id,name,program,cnic,email,status,applied_on) VALUES (?,?,?,?,?,?,?)`,
            [adm.id, adm.name, adm.program, adm.cnic, adm.email, adm.status, adm.date]
        );
    }
    console.log('  ✓ Admissions seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Student: sara@college.edu / password123');
    console.log('   Student: ali@college.edu / pass456');
    console.log('   Student: fatima@college.edu / khan789');
    console.log('   Admin:   admin / admin123');

    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
