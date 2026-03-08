/* =====================================================
   data.js – Mock Data for College Website
   ===================================================== */

'use strict';

const CollegeData = (() => {

    /* ── Students ──────────────────────────────────────── */
    const students = [
        {
            id: 'S001',
            name: 'Sara Ahmed',
            email: 'sara@college.edu',
            password: 'password123',
            rollNo: '2024-CS-001',
            cnic: '35201-1234567-1',
            program: 'BS Computer Science',
            semester: '4th',
            section: 'A',
            dob: '2004-05-15',
            phone: '+92-300-1234567',
            address: 'House 24, Street 5, Gulberg, Lahore',
            guardian: 'Mr. Arif Ahmed',
            guardianPhone: '+92-321-7654321',
            gpa: 3.75,
            status: 'Active',
            admissionDate: '2024-09-01',
            avatarInitials: 'SA',
        },
        {
            id: 'S002',
            name: 'Ali Hassan',
            email: 'ali@college.edu',
            password: 'pass456',
            rollNo: '2024-EE-012',
            cnic: '35201-9876543-2',
            program: 'BS Electrical Engineering',
            semester: '2nd',
            section: 'B',
            dob: '2005-02-20',
            phone: '+92-311-9876543',
            address: 'Flat 3B, Model Town, Lahore',
            guardian: 'Mr. Tariq Hassan',
            guardianPhone: '+92-333-1122334',
            gpa: 3.20,
            status: 'Active',
            admissionDate: '2025-01-15',
            avatarInitials: 'AH',
        },
        {
            id: 'S003',
            name: 'Fatima Khan',
            email: 'fatima@college.edu',
            password: 'khan789',
            rollNo: '2023-BBA-007',
            cnic: '35202-7654321-3',
            program: 'BBA',
            semester: '6th',
            section: 'C',
            dob: '2003-11-08',
            phone: '+92-333-4455667',
            address: 'Bahria Town, Rawalpindi',
            guardian: 'Mr. Imran Khan',
            guardianPhone: '+92-345-6677889',
            gpa: 3.90,
            status: 'Active',
            admissionDate: '2023-09-01',
            avatarInitials: 'FK',
        }
    ];

    /* ── Results ───────────────────────────────────────── */
    const results = {
        'S001': [
            {
                semester: '1st Semester (Fall 2024)',
                subjects: [
                    { code: 'CS-101', name: 'Introduction to Computing', credit: 3, marks: 88, total: 100, grade: 'A' },
                    { code: 'MATH-101', name: 'Calculus I', credit: 3, marks: 79, total: 100, grade: 'B+' },
                    { code: 'ENG-101', name: 'English Composition', credit: 3, marks: 85, total: 100, grade: 'A' },
                    { code: 'PHY-101', name: 'Physics I', credit: 3, marks: 72, total: 100, grade: 'B' },
                    { code: 'ISL-101', name: 'Islamic Studies', credit: 2, marks: 90, total: 100, grade: 'A+' },
                ],
                gpa: 3.55, totalCredits: 14,
            },
            {
                semester: '2nd Semester (Spring 2025)',
                subjects: [
                    { code: 'CS-102', name: 'Programming Fundamentals', credit: 3, marks: 92, total: 100, grade: 'A+' },
                    { code: 'MATH-102', name: 'Calculus II', credit: 3, marks: 83, total: 100, grade: 'A' },
                    { code: 'CS-103', name: 'Digital Logic Design', credit: 3, marks: 77, total: 100, grade: 'B+' },
                    { code: 'ENG-102', name: 'Technical Writing', credit: 3, marks: 88, total: 100, grade: 'A' },
                    { code: 'PAK-101', name: 'Pakistan Studies', credit: 2, marks: 80, total: 100, grade: 'A' },
                ],
                gpa: 3.75, totalCredits: 14,
            },
            {
                semester: '3rd Semester (Fall 2025)',
                subjects: [
                    { code: 'CS-201', name: 'Data Structures & Algorithms', credit: 3, marks: 85, total: 100, grade: 'A' },
                    { code: 'CS-202', name: 'Object Oriented Programming', credit: 3, marks: 91, total: 100, grade: 'A+' },
                    { code: 'MATH-201', name: 'Discrete Mathematics', credit: 3, marks: 74, total: 100, grade: 'B+' },
                    { code: 'CS-203', name: 'Database Systems', credit: 3, marks: 88, total: 100, grade: 'A' },
                    { code: 'HUM-201', name: 'Communication Skills', credit: 2, marks: 93, total: 100, grade: 'A+' },
                ],
                gpa: 3.85, totalCredits: 14,
            }
        ],
        'S002': [
            {
                semester: '1st Semester (Fall 2025)',
                subjects: [
                    { code: 'EE-101', name: 'Basic Electrical Engineering', credit: 3, marks: 75, total: 100, grade: 'B+' },
                    { code: 'MATH-101', name: 'Calculus I', credit: 3, marks: 68, total: 100, grade: 'B' },
                    { code: 'ENG-101', name: 'English Composition', credit: 3, marks: 82, total: 100, grade: 'A' },
                    { code: 'PHY-101', name: 'Physics I', credit: 3, marks: 71, total: 100, grade: 'B' },
                    { code: 'ISL-101', name: 'Islamic Studies', credit: 2, marks: 88, total: 100, grade: 'A' },
                ],
                gpa: 3.20, totalCredits: 14,
            }
        ],
        'S003': [
            {
                semester: '1st Semester (Fall 2023)',
                subjects: [
                    { code: 'BBA-101', name: 'Principles of Management', credit: 3, marks: 95, total: 100, grade: 'A+' },
                    { code: 'MATH-101', name: 'Business Mathematics', credit: 3, marks: 88, total: 100, grade: 'A' },
                    { code: 'ENG-101', name: 'Business Communication', credit: 3, marks: 91, total: 100, grade: 'A+' },
                    { code: 'ACC-101', name: 'Financial Accounting', credit: 3, marks: 85, total: 100, grade: 'A' },
                    { code: 'ISL-101', name: 'Islamic Studies', credit: 2, marks: 93, total: 100, grade: 'A+' },
                ],
                gpa: 3.90, totalCredits: 14,
            }
        ]
    };

    /* ── Fee Records ───────────────────────────────────── */
    const feeRecords = {
        'S001': {
            total: 75000,
            paid: 50000,
            pending: 25000,
            items: [
                { title: 'Tuition Fee – Spring 2025', amount: 40000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-10' },
                { title: 'Library Charges', amount: 2000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-10' },
                { title: 'Lab Fee – Spring 2025', amount: 8000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-10' },
                { title: 'Exam Fee – Mid Term', amount: 5000, dueDate: '2025-03-15', status: 'Pending', paidOn: null },
                { title: 'Sports Fund', amount: 2000, dueDate: '2025-03-31', status: 'Pending', paidOn: null },
                { title: 'Alumni Association Fee', amount: 1000, dueDate: '2025-04-30', status: 'Overdue', paidOn: null },
                { title: 'Development Fund', amount: 5000, dueDate: '2025-03-10', status: 'Overdue', paidOn: null },
                { title: 'ID Card & Documents', amount: 500, dueDate: '2025-01-15', status: 'Paid', paidOn: '2025-01-10' },
                { title: 'Internet & IT Services', amount: 3500, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-10' },
                { title: 'Student Welfare Fund', amount: 8000, dueDate: '2025-03-31', status: 'Pending', paidOn: null },
            ]
        },
        'S002': {
            total: 65000,
            paid: 65000,
            pending: 0,
            items: [
                { title: 'Tuition Fee – Spring 2025', amount: 42000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
                { title: 'Lab Fee', amount: 10000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
                { title: 'Library Charges', amount: 2000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
                { title: 'Exam Fee', amount: 5000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
                { title: 'Sports Fund', amount: 2000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
                { title: 'Development Fund', amount: 4000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-02-05' },
            ]
        },
        'S003': {
            total: 55000,
            paid: 40000,
            pending: 15000,
            items: [
                { title: 'Tuition Fee – Spring 2025', amount: 35000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-01-30' },
                { title: 'Library Charges', amount: 2000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-01-30' },
                { title: 'Exam Fee', amount: 3000, dueDate: '2025-03-20', status: 'Pending', paidOn: null },
                { title: 'Sports Fund', amount: 2000, dueDate: '2025-03-31', status: 'Pending', paidOn: null },
                { title: 'Convocation Fee', amount: 5000, dueDate: '2025-04-15', status: 'Pending', paidOn: null },
                { title: 'Development Fund', amount: 3000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-01-30' },
                { title: 'Student Welfare Fund', amount: 5000, dueDate: '2025-02-28', status: 'Paid', paidOn: '2025-01-30' },
            ]
        }
    };

    /* ── Timetables ────────────────────────────────────── */
    const timetables = {
        'S001': {
            program: 'BS Computer Science – 4th Semester',
            periods: ['08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00', '12:00 – 01:00', '01:00 – 02:00', '02:00 – 03:00'],
            days: {
                Monday: ['CS-201 DSA', 'CS-202 OOP', 'MATH-201 DM', 'Break / Lunch', 'CS-203 DB', 'Free', 'CS-201 DSA Lab'],
                Tuesday: ['CS-202 OOP Lab', 'CS-202 OOP Lab', 'ENG-201 Comm', 'ENG-201 Comm', 'Break / Lunch', 'MATH-201 DM', 'Free'],
                Wednesday: ['CS-201 DSA', 'Free', 'CS-203 DB Lab', 'CS-203 DB Lab', 'Break / Lunch', 'CS-202 OOP', 'MATH-201 DM'],
                Thursday: ['MATH-201 DM', 'CS-201 DSA', 'ENG-201 Comm', 'Break / Lunch', 'CS-203 DB', 'Free', 'Free'],
                Friday: ['CS-202 OOP', 'CS-203 DB', 'Free', 'Friday Prayer', 'Free', 'MATH-201 DM', 'Free'],
            }
        },
        'S002': {
            program: 'BS Electrical Engineering – 2nd Semester',
            periods: ['08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00', '12:00 – 01:00', '01:00 – 02:00', '02:00 – 03:00'],
            days: {
                Monday: ['EE-102 Circuits', 'PHY-102 Physics', 'MATH-102 Calc', 'Break / Lunch', 'EE-102 Lab', 'EE-102 Lab', 'Free'],
                Tuesday: ['MATH-102 Calc', 'EE-103 Digital', 'EE-103 Digital', 'Break / Lunch', 'PHY-102 Physics', 'Free', 'Free'],
                Wednesday: ['EE-102 Circuits', 'ENG-102 Tech', 'ENG-102 Tech', 'Break / Lunch', 'MATH-102 Calc', 'EE-103 Digital', 'Free'],
                Thursday: ['PHY-102 Phys Lab', 'PHY-102 Phys Lab', 'EE-103 Digital', 'Break / Lunch', 'EE-102 Circuits', 'MATH-102 Calc', 'Free'],
                Friday: ['ENG-102 Tech', 'Free', 'Free', 'Friday Prayer', 'Free', 'Free', 'Free'],
            }
        },
        'S003': {
            program: 'BBA – 6th Semester',
            periods: ['08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00', '12:00 – 01:00', '01:00 – 02:00', '02:00 – 03:00'],
            days: {
                Monday: ['MKT-301 Marketing', 'FIN-301 Finance', 'HRM-301 HR', 'Break / Lunch', 'MKT-301 Marketing', 'Free', 'Free'],
                Tuesday: ['FIN-301 Finance', 'ACC-301 Audit', 'ACC-301 Audit', 'Break / Lunch', 'HRM-301 HR', 'Free', 'Free'],
                Wednesday: ['MKT-301 Marketing', 'FIN-301 Finance', 'Free', 'Break / Lunch', 'ACC-301 Audit', 'HRM-301 HR', 'Free'],
                Thursday: ['HRM-301 HR', 'ACC-301 Audit', 'MKT-301 Lab', 'MKT-301 Lab', 'Break / Lunch', 'FIN-301 Finance', 'Free'],
                Friday: ['FIN-301 Finance', 'Free', 'Free', 'Friday Prayer', 'Free', 'Free', 'Free'],
            }
        }
    };

    /* ── Default Announcements ─────────────────────────── */
    const defaultAnnouncements = [
        {
            id: 'ann-1',
            title: 'Mid-Term Examinations Schedule 2025',
            category: 'Exams',
            date: '2026-03-01',
            author: 'Examination Department',
            excerpt: 'Mid-term examinations for all departments will commence from March 20, 2025. The detailed schedule has been posted on the college notice board. All students are advised to check their exam timetables.',
            icon: 'fa-solid fa-calendar-check',
        },
        {
            id: 'ann-2',
            title: 'Annual College Sports Week – Registration Open',
            category: 'Events',
            date: '2026-02-25',
            author: 'Sports Committee',
            excerpt: 'The Annual Sports Week will be held from April 10–15, 2025. Students interested in participating in cricket, football, basketball, badminton, and athletics can register with their department representatives.',
            icon: 'fa-solid fa-trophy',
        },
        {
            id: 'ann-3',
            title: 'Admissions Open for Fall 2025',
            category: 'Admissions',
            date: '2026-02-20',
            author: 'Admissions Office',
            excerpt: 'Greenfield College is pleased to announce that admissions for the Fall 2025 session are now open. Applications are invited for BS, BBA, and associate programs. Merit-based scholarships are available.',
            icon: 'fa-solid fa-graduation-cap',
        }
    ];

    /* ── Admissions ────────────────────────────────────── */
    const defaultAdmissions = [
        { id: 'ADM-001', name: 'Bilal Raza', program: 'BS Computer Science', status: 'Approved', date: '2026-03-01', cnic: '35201-1112223-4', email: 'bilal.raza@mail.com' },
        { id: 'ADM-002', name: 'Sana Malik', program: 'BBA', status: 'Pending', date: '2026-03-03', cnic: '35202-3334445-6', email: 'sana.malik@mail.com' },
        { id: 'ADM-003', name: 'Usman Tariq', program: 'BS Electrical Engineering', status: 'Pending', date: '2026-03-05', cnic: '35203-5556667-8', email: 'usman.tariq@mail.com' },
        { id: 'ADM-004', name: 'Ayesha Noor', program: 'BS Computer Science', status: 'Rejected', date: '2026-03-02', cnic: '35204-7778889-0', email: 'ayesha.noor@mail.com' },
        { id: 'ADM-005', name: 'Kamran Sheikh', program: 'BBA', status: 'Approved', date: '2026-03-04', cnic: '35205-9990001-2', email: 'kamran.sheikh@mail.com' },
    ];

    /* ── Programs ──────────────────────────────────────── */
    const programs = [
        { icon: 'fa-solid fa-laptop-code', title: 'BS Computer Science', duration: '4 Years', seats: 120, dept: 'Faculty of IT', desc: 'Explore algorithms, AI, web development, databases, and software engineering in our flagship CS program.' },
        { icon: 'fa-solid fa-bolt', title: 'BS Electrical Engineering', duration: '4 Years', seats: 80, dept: 'Faculty of Engineering', desc: 'Master circuits, power systems, electronics, and telecommunications with hands-on lab experience.' },
        { icon: 'fa-solid fa-chart-line', title: 'BBA', duration: '4 Years', seats: 100, dept: 'Faculty of Business', desc: 'Develop leadership, finance, marketing, and management skills for a dynamic global business career.' },
        { icon: 'fa-solid fa-flask', title: 'BS Chemistry', duration: '4 Years', seats: 60, dept: 'Faculty of Sciences', desc: 'Dive into organic, inorganic, and physical chemistry through world-class labs and research facilities.' },
        { icon: 'fa-solid fa-heartbeat', title: 'BS Biotechnology', duration: '4 Years', seats: 50, dept: 'Faculty of Sciences', desc: 'Explore genetics, cell biology, bioinformatics, and biotechnology applications in medicine and agriculture.' },
        { icon: 'fa-solid fa-scale-balanced', title: 'LLB (Hons)', duration: '5 Years', seats: 60, dept: 'Faculty of Law', desc: 'Comprehensive legal education covering constitutional law, criminal law, civil procedure, and advocacy skills.' },
    ];

    /* ── localStorage Helpers ──────────────────────────── */
    function getAnnouncements() {
        const stored = localStorage.getItem('gc_announcements');
        if (stored) return JSON.parse(stored);
        localStorage.setItem('gc_announcements', JSON.stringify(defaultAnnouncements));
        return defaultAnnouncements;
    }

    function saveAnnouncements(arr) {
        localStorage.setItem('gc_announcements', JSON.stringify(arr));
    }

    function getAdmissions() {
        const stored = localStorage.getItem('gc_admissions');
        if (stored) return JSON.parse(stored);
        localStorage.setItem('gc_admissions', JSON.stringify(defaultAdmissions));
        return defaultAdmissions;
    }

    function saveAdmissions(arr) {
        localStorage.setItem('gc_admissions', JSON.stringify(arr));
    }

    function getPayments() {
        const stored = localStorage.getItem('gc_payments');
        if (stored) return JSON.parse(stored);
        return [];
    }

    function addPayment(payment) {
        const payments = getPayments();
        payments.unshift(payment);
        localStorage.setItem('gc_payments', JSON.stringify(payments));
    }

    function getStudentById(id) {
        return students.find(s => s.id === id) || null;
    }

    function getStudentByEmail(email) {
        return students.find(s => s.email === email.toLowerCase()) || null;
    }

    function formatCurrency(amount) {
        return 'PKR ' + Number(amount).toLocaleString('en-PK');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    /* Public API */
    return {
        students,
        results,
        feeRecords,
        timetables,
        programs,
        getAnnouncements,
        saveAnnouncements,
        getAdmissions,
        saveAdmissions,
        getPayments,
        addPayment,
        getStudentById,
        getStudentByEmail,
        formatCurrency,
        formatDate,
    };
})();
