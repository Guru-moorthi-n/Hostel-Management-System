import express from "express";
import cors from "cors";
import db from "./db.js";
import bcrypt from "bcrypt";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(limiter);

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is ready.");
});

app.get("/api/users", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, full_name, username, is_active, created_at, role FROM users ORDER BY id ASC"
        );

        res.json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.get("/api/student/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query(
            `
            SELECT

                users.id,
                users.full_name,
                users.username,
                users.role,
                users.is_active,
                users.created_at,

                students.register_number,
                students.email,
                students.department,
                students.dob::text AS dob,
                students.year,
                students.gender,
                students.phone,
                students.parent_phone,
                students.address,
                students.room_id,

                rooms.room_number,
                rooms.block,
                rooms.floor,
                rooms.capacity,
                rooms.occupancy,
                rooms.status AS room_status

            FROM users

            LEFT JOIN students
            ON users.id = students.user_id

            LEFT JOIN rooms
            ON students.room_id = rooms.id

            WHERE users.id = $1
            `,
            [id]
        );
        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});


app.post("/api/add-user", async (req, res) => {
    const newUser = req.body;

    const username = newUser.username?.trim();
    const password = newUser.password?.trim();
    const role = newUser.role;
    const full_name = newUser.full_name?.trim();

    if (!full_name || !username || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "Fields cannot be empty"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS));
        const result = await db.query(
            "INSERT INTO users (username, password, role, full_name) VALUES ($1, $2, $3, $4)", [username, hashedPassword, role, full_name]
        );

        res.json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.json({
                success: false,
                message: "Username already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
});

app.post("/api/login", async (req, res) => {
    const loginUser = req.body;

    const username = loginUser.username.trim();
    const password = loginUser.password.trim();
    const role = loginUser.role;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Fields cannot be empty"
        });
    }

    try {
        const result = await db.query(
            "SELECT * FROM users WHERE username = $1 AND role = $2",
            [username, role]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const storedPassword = result.rows[0].password;
        const isMatch = await bcrypt.compare(
            password,
            storedPassword
        );

        if (isMatch) {
            res.json({
                success: true,
                user_id: result.rows[0].id,
                role: result.rows[0].role,
                username: result.rows[0].username,
                full_name: result.rows[0].full_name,
                message: "Login successful"
            });

        } else {
            res.json({
                success: false,
                message: "Invalid username or password"
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/student/save", async (req, res) => {
    const {
        user_id,
        register_number,
        email,
        department,
        dob,
        year,
        gender,
        phone,
        parent_phone,
        address
    } = req.body;

    const safeDob = dob === "" ? null : dob;

    try {
        const checkStudent = await db.query(
            `
            SELECT * FROM students
            WHERE user_id = $1
            `,
            [user_id]
        );

        if (checkStudent.rows.length > 0) {
            await db.query(
                `
                UPDATE students
                SET
                    register_number = $1,
                    email = $2,
                    department = $3,
                    dob = $4,
                    year = $5,
                    gender = $6,
                    phone = $7,
                    parent_phone = $8,
                    address = $9

                WHERE user_id = $10
                `,
                [
                    register_number,
                    email,
                    department,
                    safeDob,
                    year,
                    gender,
                    phone,
                    parent_phone,
                    address,
                    user_id
                ]
            );
            return res.json({
                success: true,
                message: "Student updated successfully"
            });
        }

        else {
            await db.query(
                `
                INSERT INTO students (
                    user_id,
                    register_number,
                    email,
                    department,
                    dob,
                    year,
                    gender,
                    phone,
                    parent_phone,
                    address
                )
                VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
                )
                `,
                [
                    user_id,
                    register_number,
                    email,
                    department,
                    safeDob,
                    year,
                    gender,
                    phone,
                    parent_phone,
                    address
                ]
            );

            return res.json({
                success: true,
                message: "Student created successfully"
            });
        }
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/delete-user", async (req, res) => {
    const { admin_username, admin_password, target_user_id } = req.body;

    try {
        const adminResult = await db.query(
            `
            SELECT * FROM users
            WHERE username = $1
            AND role = 'admin'
            `,
            [admin_username]
        );

        if (adminResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Admin account not found",
            });
        }

        const admin = adminResult.rows[0];
        const isMatch = await bcrypt.compare(
            admin_password,
            admin.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Incorrect password",
            });
        }

        if (admin.id === target_user_id) {
            return res.json({
                success: false,
                message: "Admin cannot delete own account",
            });
        }

        const studentResult = await db.query(
            `
        SELECT room_id
        FROM students
        WHERE user_id = $1
        `,
            [target_user_id]
        );
        const roomId = studentResult.rows[0]?.room_id;

        if (roomId) {
            await db.query(
                `
            UPDATE rooms
            SET occupancy = GREATEST(occupancy - 1,0)
            WHERE id = $1
            `,
                [roomId]
            );
            await db.query(
                `
            UPDATE rooms
            SET status='available'
            WHERE id=$1
            AND occupancy < capacity
            `,
                [roomId]
            );
        }

        await db.query(
            `
            DELETE FROM users
            WHERE id = $1
            `,
            [target_user_id]
        );

        res.json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Database error",
        });
    }
});

app.get("/api/rooms", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT * FROM rooms
            ORDER BY id ASC
            `
        );

        res.json({
            success: true,
            rooms: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.get("/api/available-rooms", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT *
            FROM rooms
            WHERE occupancy < capacity
            ORDER BY room_number ASC
            `
        );

        res.json({
            success: true,
            rooms: result.rows
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/assign-room", async (req, res) => {
    const { user_id, room_id } = req.body;
    try {
        const studentResult = await db.query(
            `
            SELECT room_id
            FROM students
            WHERE user_id = $1
            `,
            [user_id]
        );

        const oldRoomId = studentResult.rows[0]?.room_id;
        if (oldRoomId == room_id) {
            return res.json({
                success: true,
                message: "Room already assigned"
            });
        }
        if (oldRoomId) {
            await db.query(
                `
                UPDATE rooms
                SET occupancy = GREATEST(occupancy - 1, 0)
                WHERE id = $1
                `,
                [oldRoomId]
            );

            await db.query(
                `
                UPDATE rooms
                SET status = 'available'
                WHERE id = $1
                `,
                [oldRoomId]
            );
        }

        await db.query(
            `
            UPDATE students
            SET room_id = $1
            WHERE user_id = $2
            `,
            [room_id, user_id]
        );

        await db.query(
            `
            UPDATE rooms
            SET occupancy = occupancy + 1
            WHERE id = $1
            `,
            [room_id]
        );

        await db.query(
            `
            UPDATE rooms
            SET status = 'full'
            WHERE id = $1
            AND occupancy = capacity
            `,
            [room_id]
        );

        res.json({
            success: true,
            message: "Room assigned successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/add-room", async (req, res) => {
    const {
        room_number,
        block,
        floor,
        capacity,
        status,
    } = req.body;

    try {
        await db.query(
            `
      INSERT INTO rooms(
        room_number,
        block,
        floor,
        capacity,
        occupancy,
        status
      )
      VALUES($1,$2,$3,$4,0,$5)
      `,
            [
                room_number,
                block,
                floor,
                capacity,
                status,
            ]
        );

        res.json({
            success: true,
            message: "Room added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error",
        });
    }
});

app.put("/api/update-room/:id", async (req, res) => {
    const id = req.params.id;

    const {
        room_number,
        block,
        floor,
        capacity,
        status,
    } = req.body;

    try {
        await db.query(
            `
      UPDATE rooms
      SET
        room_number = $1,
        block = $2,
        floor = $3,
        capacity = $4,
        status = $5
      WHERE id = $6
      `,
            [
                room_number,
                block,
                floor,
                capacity,
                status,
                id,
            ]
        );

        res.json({
            success: true,
            message: "Room updated successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Database error",
        });
    }
});

app.post("/api/delete-room", async (req, res) => {
    const {
        room_id,
        admin_username,
        admin_password
    } = req.body;

    try {
        const adminResult = await db.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            AND role = 'admin'
            `,
            [admin_username]
        );

        if (adminResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Admin account not found"
            });
        }

        const admin = adminResult.rows[0];
        const passwordMatch = await bcrypt.compare(
            admin_password,
            admin.password
        );
        if (!passwordMatch) {
            return res.json({
                success: false,
                message: "Incorrect password"
            });
        }

        const roomResult = await db.query(
            `
            SELECT occupancy
            FROM rooms
            WHERE id = $1
            `,
            [room_id]
        );

        if (roomResult.rows[0].occupancy > 0) {
            return res.json({
                success: false,
                message:
                    "Room contains students. Move them first."
            });
        }

        await db.query(
            `
            DELETE FROM rooms
            WHERE id = $1
            `,
            [room_id]
        );
        res.json({
            success: true,
            message: "Room deleted successfully"
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });

    }

});

app.get("/api/room-students/:id", async (req, res) => {
    const roomId = req.params.id;
    try {
        const result = await db.query(
            `
            SELECT
                users.id,
                users.full_name,
                users.username,
                students.register_number,
                students.department,
                students.year

            FROM students

            JOIN users
            ON students.user_id = users.id

            WHERE students.room_id = $1
            ORDER BY users.full_name
            `,
            [roomId]
        );

        res.json({
            success: true,
            students: result.rows
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.put("/api/toggle-room-status/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const room = await db.query(
            `
            SELECT *
            FROM rooms
            WHERE id=$1
            `,
            [id]
        );

        const current = room.rows[0];

        if (current.occupancy > 0) {
            return res.json({
                success: false,
                message: "Cannot mark occupied room."
            });
        }

        const newStatus = current.status === "maintenance" ? "available" : "maintenance";

        await db.query(
            `
            UPDATE rooms
            SET status=$1
            WHERE id=$2
            `,
            [
                newStatus,
                id
            ]
        );
        res.json({
            success: true,
            message:
                `Room marked ${newStatus}`
        });
    }
    catch (error) {
        console.log(error);
    }
});

app.post("/api/remove-room-assignment", async (req, res) => {
    const { user_id } = req.body;
    try {
        const studentResult = await db.query(
            `
            SELECT room_id
            FROM students
            WHERE user_id = $1
            `,
            [user_id]
        );

        if (studentResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }

        const roomId = studentResult.rows[0].room_id;
        if (!roomId) {
            return res.json({
                success: false,
                message: "Student has no room assigned"
            });
        }

        await db.query(
            `
            UPDATE students
            SET room_id = NULL
            WHERE user_id = $1
            `,
            [user_id]
        );

        await db.query(
            `
            UPDATE rooms
            SET occupancy = GREATEST(occupancy - 1, 0)
            WHERE id = $1
            `,
            [roomId]
        );
        await db.query(
            `
            UPDATE rooms
            SET status = 'available'
            WHERE id = $1
            AND occupancy < capacity
            `,
            [roomId]
        );
        res.json({
            success: true,
            message: "Student removed from room successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.get("/api/complaints", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT
                complaints.*,
                users.username,
                users.full_name,
                students.register_number,
                students.department,
                rooms.room_number,
                wardens.full_name AS assigned_warden

            FROM complaints

            JOIN users
            ON complaints.student_id = users.id

            LEFT JOIN students
            ON students.user_id = users.id

            LEFT JOIN rooms
            ON complaints.room_id = rooms.id

            LEFT JOIN users wardens
            ON complaints.assigned_to = wardens.id

            ORDER BY complaints.created_at DESC
            `
        );

        res.json({
            success: true,
            complaints: result.rows
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/complaints", async (req, res) => {
    const {
        username,
        title,
        category,
        priority,
        description
    } = req.body;

    try {
        const studentResult = await db.query(
            `
            SELECT
                users.id AS user_id,
                students.room_id

            FROM users

            JOIN students
            ON students.user_id = users.id

            WHERE users.username = $1
            `,
            [username]
        );

        if (studentResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Student not found."
            });
        }

        const student = studentResult.rows[0];
        await db.query(
            `
            INSERT INTO complaints(
                student_id,
                room_id,
                title,
                category,
                priority,
                description,
                status,
                assigned_to
            )

            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                'Pending',
                NULL
            )
            `,
            [
                student.user_id,
                student.room_id,
                title.trim(),
                category,
                priority,
                description.trim()
            ]
        );

        const staff = await db.query(
            `
            SELECT id
            FROM users
            WHERE role IN ('admin','warden')
            `
        );

        for (const user of staff.rows) {
            await db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,
                [
                    user.id,
                    "New Complaint",
                    `${username} raised a new complaint.`,
                    "complaint"
                ]
            );

        }

        res.json({
            success: true,
            message: "Complaint submitted successfully."
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.put("/api/complaints/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            `
            UPDATE complaints
            SET
                status = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *;
            `,
            [status, id]
        );

        const complaint = result.rows[0];
        await db.query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            `,
            [
                complaint.student_id,
                "Complaint Updated",
                `Your complaint is now ${status}.`,
                "complaint"
            ]);

        res.json({
            success: true,
            complaint: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update complaint status."
        });
    }
});

app.delete("/api/complaints/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            `
            DELETE FROM complaints
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });

    }
});

app.get("/api/wardens", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                id,
                full_name
            FROM users
            WHERE role='warden'
            ORDER BY full_name
        `);

        res.json({
            success: true,
            wardens: result.rows

        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.put("/api/complaints/assign/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { wardenId } = req.body;
        const result = await db.query(
            `
            UPDATE complaints
            SET
            assigned_to=$1,
            updated_at=NOW()
            WHERE id=$2
            RETURNING *
            `,
            [
                wardenId,
                id
            ]
        );

        res.json({
            success: true,
            complaint: result.rows[0]
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/fees", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                s.id,
                u.full_name,
                s.register_number,
                s.department,
                s.year,
                r.room_number,
                COALESCE(SUM(sf.amount),0) AS total_fee,
                COALESCE(
                    (
                        SELECT SUM(fp.amount)
                        FROM fee_payments fp
                        WHERE fp.student_id = s.id
                    ),
                    0
                ) AS paid_amount

            FROM students s

            JOIN users u
            ON s.user_id = u.id

            LEFT JOIN rooms r
            ON s.room_id = r.id

            LEFT JOIN student_fees sf
            ON sf.student_id = s.id

            GROUP BY
                s.id,
                u.full_name,
                s.register_number,
                s.department,
                s.year,
                r.room_number
            ORDER BY

                u.full_name;
                    `);

        const students = result.rows.map(student => {
            const total = Number(student.total_fee);
            const paid = Number(student.paid_amount);
            const balance = total - paid;
            let status = "Pending";

            if (balance === 0 && total > 0) {
                status = "Paid";
            }

            else if (paid > 0) {
                status = "Partial";
            }

            return {
                id: student.id,
                name: student.full_name,
                regNo: student.register_number,
                department: student.department,
                year: student.year,
                room: student.room_number,
                total: total,
                paid: paid,
                balance: balance,
                status: status
            };
        });

        res.json({
            success: true,
            students
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/fee-structure", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT *
            FROM fee_structure
            WHERE is_active = true
            ORDER BY fee_name
            `
        );

        res.json({
            success: true,
            fees: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.post("/api/assign-fees", async (req, res) => {
    const {
        student_id,
        fee_ids,
        due_date,
        remarks
    } = req.body;
    try {
        let insertedCount = 0;
        for (const feeId of fee_ids) {
            const fee = await db.query(
                `
                SELECT default_amount
                FROM fee_structure
                WHERE id = $1
                `,
                [feeId]
            );

            const exists = await db.query(
                `
                SELECT id
                FROM student_fees
                WHERE student_id = $1
                AND fee_structure_id = $2
                `,
                [
                    student_id,
                    feeId
                ]
            );

            if (exists.rows.length > 0) {
                continue;
            }

            await db.query(
                `
                INSERT INTO student_fees(
                    student_id,
                    fee_structure_id,
                    amount,
                    due_date,
                    remarks
                )

                VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
                `,
                [
                    student_id,
                    feeId,
                    fee.rows[0].default_amount,
                    due_date || null,
                    remarks || null
                ]
            );
            insertedCount++;
        }

        if (insertedCount === 0) {
            return res.json({
                success: false,
                message: "All selected fees are already assigned."
            });
        }

        res.json({
            success: true,
            message: `${insertedCount} fee(s) assigned successfully.`
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.get("/api/student-fees/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const studentResult = await db.query(
            `
            SELECT
                s.id,
                u.full_name,
                s.register_number,
                s.department,
                s.year,
                r.room_number

            FROM students s

            JOIN users u
            ON s.user_id = u.id

            LEFT JOIN rooms r
            ON s.room_id = r.id

            WHERE s.id = $1
            `,
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const feesResult = await db.query(
            `
            SELECT
                sf.id,
                fs.fee_name,
                sf.amount,
                sf.due_date,
                sf.remarks

            FROM student_fees sf

            JOIN fee_structure fs
            ON sf.fee_structure_id = fs.id

            WHERE sf.student_id = $1
            ORDER BY fs.fee_name
            `,
            [studentId]
        );

        const paymentResult = await db.query(
            `
            SELECT
                COALESCE(SUM(amount),0) AS paid
            FROM fee_payments
            WHERE student_id = $1
            `,
            [studentId]
        );

        const student = studentResult.rows[0];
        const fees = feesResult.rows;
        const total = fees.reduce(
            (sum, fee) => sum + Number(fee.amount),
            0
        );

        const paid = Number(paymentResult.rows[0].paid);
        const balance = total - paid;
        let status = "Pending";
        if (total > 0 && balance === 0) {
            status = "Paid";
        }

        else if (paid > 0) {
            status = "Partial";
        }

        const nextDueDate =
            fees.length > 0
                ? fees.reduce((latest, fee) => {

                    if (!latest) return fee.due_date;

                    return new Date(fee.due_date) > new Date(latest)
                        ? fee.due_date
                        : latest;

                }, null)
                : null;

        res.json({
            success: true,
            student,
            fees,
            summary: {
                total,
                paid,
                balance,
                status,
                dueDate: nextDueDate
            }
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/receive-payment", async (req, res) => {
    const {
        student_id,
        amount,
        payment_method,
        transaction_id,
        remarks
    } = req.body;

    try {
        const totalResult = await db.query(
            `
            SELECT
                COALESCE(SUM(amount),0) AS total
            FROM student_fees
            WHERE student_id = $1
            `,
            [student_id]
        );

        const paidResult = await db.query(
            `
            SELECT
                COALESCE(SUM(amount),0) AS paid
            FROM fee_payments
            WHERE student_id = $1
            `,
            [student_id]
        );

        const total = Number(totalResult.rows[0].total);
        const paid = Number(paidResult.rows[0].paid);
        const balance = total - paid;

        if (Number(amount) <= 0) {
            return res.json({
                success: false,
                message: "Enter a valid amount."
            });
        }

        if (Number(amount) > balance) {
            return res.json({
                success: false,
                message: "Amount exceeds pending balance."
            });
        }

        await db.query(
            `
            INSERT INTO fee_payments(
                student_id,
                amount,
                payment_method,
                transaction_id,
                remarks
            )

            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )
            `,
            [
                student_id,
                amount,
                payment_method,
                transaction_id || null,
                remarks || null
            ]
        );

        res.json({
            success: true,
            message: "Payment received successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/payment-history/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await db.query(
            `
            SELECT
                id,
                amount,
                payment_method,
                transaction_id,
                remarks,
                payment_date

            FROM fee_payments
            WHERE student_id = $1
            ORDER BY payment_date DESC, id DESC
            `,
            [studentId]
        );

        res.json({
            success: true,
            payments: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to load payment history."
        });
    }
});

app.get("/api/student-fees/edit/:studentId", async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await db.query(
            `
            SELECT
                sf.id,
                sf.amount,
                sf.due_date,
                sf.remarks,
                fs.fee_name

            FROM student_fees sf
            JOIN fee_structure fs
            ON sf.fee_structure_id = fs.id
            WHERE sf.student_id = $1
            ORDER BY fs.fee_name
            `,
            [
                studentId
            ]
        );

        res.json({
            success: true,
            fees: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.put("/api/student-fees/update", async (req, res) => {
    const { fees } = req.body;
    try {
        for (const fee of fees) {
            await db.query(
                `
                UPDATE student_fees
                SET
                    amount = $1,
                    due_date = $2,
                    remarks = $3
                WHERE id = $4
                `,
                [
                    fee.amount,
                    fee.due_date,
                    fee.remarks,
                    fee.id
                ]
            );
        }

        res.json({
            success: true,
            message: "Fees updated successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.delete("/api/student-fees/:id", async (req, res) => {
    try {
        await db.query(
            `
            DELETE FROM student_fees
            WHERE id = $1
            `,
            [
                req.params.id
            ]
        );

        res.json({
            success: true
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/leaves", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT

                lr.id,
                lr.leave_type,
                lr.from_date,
                lr.to_date,
                lr.reason,
                lr.status,
                lr.created_at,
                lr.approved_at,

                s.id AS student_id,
                s.register_number,
                s.department,
                s.year,
                u.full_name,
                r.room_number

            FROM leave_requests lr

            JOIN students s
            ON lr.student_id = s.id

            JOIN users u
            ON s.user_id = u.id

            LEFT JOIN rooms r
            ON s.room_id = r.id

            ORDER BY lr.created_at DESC
        `);

        res.json({
            success: true,
            leaves: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.post("/api/leaves", async (req, res) => {
    const {
        username,
        leave_type,
        from_date,
        to_date,
        reason
    } = req.body;

    if (
        !leave_type ||
        !from_date ||
        !to_date ||
        !reason
    ) {
        return res.json({
            success: false,
            message: "Please fill all fields."
        });
    }

    try {
        const studentResult = await db.query(
            `
            SELECT
                students.id

            FROM users

            JOIN students
            ON students.user_id = users.id

            WHERE users.username = $1
            `,
            [username]
        );

        if (studentResult.rows.length === 0) {
            return res.json({
                success: false,
                message: "Student not found."
            });
        }

        const studentId = studentResult.rows[0].id;
        await db.query(
            `
            INSERT INTO leave_requests(
                student_id,
                leave_type,
                from_date,
                to_date,
                reason,
                status

            )

            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                'Pending'
            )
            `,
            [
                studentId,
                leave_type,
                from_date,
                to_date,
                reason.trim()
            ]
        );

        const staff = await db.query(
            `
            SELECT id
            FROM users
            WHERE role IN ('admin','warden')
            `
        );

        for (const user of staff.rows) {
            await db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,
                [
                    user.id,
                    "New Leave Request",
                    `${username} submitted a leave request.`,
                    "leave"
                ]
            );

        }

        res.json({
            success: true,
            message: "Leave request submitted successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.put("/api/leaves/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await db.query(
            `
            UPDATE leave_requests
            SET
                status = $1,
                approved_at = NOW()
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        res.json({
            success: true,
            leave: result.rows[0]
        });

        const leave = result.rows[0];
        const student = await db.query(
            `
            SELECT user_id
            FROM students
            WHERE id=$1
            `,
            [
                leave.student_id
            ]);

        await db.query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                type
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            `,
            [
                student.rows[0].user_id,
                "Leave Request Updated",
                `Your leave request has been ${status}.`,
                "leave"
            ]);
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/notices", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT *
            FROM notices
            ORDER BY
            is_pinned DESC,
            created_at DESC
            `
        );

        res.json({
            success: true,
            notices: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.post("/api/notices", async (req, res) => {
    const {
        title,
        description,
        type,
        is_pinned
    } = req.body;
    try {
        const noticeResult = await db.query(
            `
            INSERT INTO notices
            (
                title,
                description,
                type,
                is_pinned
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )

            RETURNING *
            `,
            [
                title,
                description,
                type,
                is_pinned
            ]
        );

        const students = await db.query(
            `
            SELECT id
            FROM users
            WHERE role='student'
            `
        );

        for (const student of students.rows) {
            await db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,
                [
                    student.id,
                    "New Notice",
                    title,
                    "notice"
                ]);
        }

        res.json({
            success: true,
            message: "Notice added successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.put("/api/notices/:id", async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        type,
        is_pinned
    } = req.body;

    try {
        await db.query(
            `
            UPDATE notices
            SET
                title=$1,
                description=$2,
                type=$3,
                is_pinned=$4,
                updated_at=NOW()
            WHERE id=$5
            `,

            [
                title,
                description,
                type,
                is_pinned,
                id
            ]
        );

        res.json({
            success: true,
            message: "Notice updated."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.delete("/api/notices/:id", async (req, res) => {
    try {
        await db.query(
            `
            DELETE
            FROM notices
            WHERE id=$1
            `,

            [req.params.id]
        );

        res.json({
            success: true,
            message: "Notice deleted."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/profile/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const result = await db.query(
            `
            SELECT
                full_name,
                username,
                email,
                phone
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            profile: result.rows[0]
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.put("/api/profile/:username", async (req, res) => {
    const { username } = req.params;
    const {
        full_name,
        email,
        phone
    } = req.body;

    try {
        await db.query(
            `
            UPDATE users
            SET
                full_name=$1,
                email=$2,
                phone=$3

            WHERE username=$4
            `,
            [
                full_name,
                email,
                phone,
                username
            ]
        );

        res.json({
            success: true,
            message: "Profile updated successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.put("/api/profile/change-password/:username", async (req, res) => {
    const { username } = req.params;
    const {
        currentPassword,
        newPassword
    } = req.body;

    try {
        const result = await db.query(
            `
            SELECT password
            FROM users
            WHERE username=$1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(
            currentPassword,
            result.rows[0].password
        );

        if (!match) {
            return res.json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_ROUNDS));
        await db.query(
            `
            UPDATE users
            SET password=$1
            WHERE username=$2
            `,

            [hashedPassword, username]
        );

        res.json({
            success: true,
            message: "Password changed successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/hostel-settings", async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT *
            FROM app_settings
            LIMIT 1
            `
        );

        res.json({
            success: true,
            settings: result.rows[0]
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.put("/api/hostel-settings", async (req, res) => {
    const {
        hostel_name,
        warden_name,
        address,
        phone,
        email,
        auto_logout,
        session_timeout
    } = req.body;

    try {
        await db.query(
            `
            UPDATE app_settings
            SET
                hostel_name=$1,
                warden_name=$2,
                address=$3,
                phone=$4,
                email=$5,
                auto_logout=$6,
                session_timeout=$7

            WHERE id=1
            `,
            [
                hostel_name,
                warden_name,
                address,
                phone,
                email,
                auto_logout,
                session_timeout
            ]
        );

        res.json({
            success: true,
            message: "Hostel information updated successfully."
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const totalStudents = await db.query(`
            SELECT COUNT(*) FROM students
        `);

        const activeStudents = await db.query(`
            SELECT COUNT(*)
            FROM users
            WHERE role='student'
            AND is_active=true
        `);

        const totalRooms = await db.query(`
            SELECT COUNT(*)
            FROM rooms
        `);

        const occupiedRooms = await db.query(`
            SELECT COUNT(*)
            FROM rooms
            WHERE occupancy>0
        `);

        const availableRooms = await db.query(`
            SELECT COUNT(*)
            FROM rooms
            WHERE occupancy < capacity
            AND status='available'
        `);

        const pendingComplaints = await db.query(`
            SELECT COUNT(*)
            FROM complaints
            WHERE status IN ('Pending','In Progress')
        `);

        const resolvedComplaints = await db.query(`
            SELECT COUNT(*)
            FROM complaints
            WHERE status='Resolved'
        `);

        const pendingLeaves = await db.query(`
            SELECT COUNT(*)
            FROM leave_requests
            WHERE status='Pending'
        `);

        const approvedLeaves = await db.query(`
            SELECT COUNT(*)
            FROM leave_requests
            WHERE status='Approved'
        `);

        const rooms = Number(totalRooms.rows[0].count);
        const occupied = Number(occupiedRooms.rows[0].count);

        const occupancyPercentage =
            rooms === 0
                ? 0
                : Math.round((occupied / rooms) * 100);

        res.json({
            success: true,
            stats: {
                students: Number(totalStudents.rows[0].count),
                activeStudents:
                    Number(activeStudents.rows[0].count),

                rooms,
                availableRooms:
                    Number(availableRooms.rows[0].count),

                occupied,
                occupancyPercentage,

                complaints:
                    Number(pendingComplaints.rows[0].count),
                resolvedComplaints:
                    Number(resolvedComplaints.rows[0].count),

                leaves:
                    Number(pendingLeaves.rows[0].count),
                approvedLeaves:
                    Number(approvedLeaves.rows[0].count)

            }
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.get("/api/dashboard/student-overview", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                department,
                COUNT(*) AS total
            FROM students
            GROUP BY department
            ORDER BY department
        `);

        res.json({
            success: true,
            overview: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Database Error"
        });
    }
});

app.get("/api/current-user/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const result = await db.query(
            `
            SELECT id
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            id: result.rows[0].id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.get("/api/notifications/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(
            `
            SELECT *
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            notifications: result.rows
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.put("/api/notifications/read-all/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query(
            `
            UPDATE notifications
            SET is_read = true
            WHERE user_id = $1
            `,
            [userId]
        );

        res.json({
            success: true
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});