// const express = require('express');
// const db = require('../database');
// const authenticateToken = require('../Middleware/auth');

// const router = express.Router();

// // GET /tasks: Fetch all tasks

// router.get('/', (req, res) => {
//     const query = `SELECT * FROM tasks`;
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to fetch tasks' });
//         }
//         res.status(200).json(results);
//     });
// });


// // GET /tasks/:id: Fetch a task by its ID
// router.get('/:id', (req, res) => {
//     const { id } = req.params;

//     const query = `SELECT * FROM tasks WHERE id = ?`;
//     db.query(query, [id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to fetch task' });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         res.status(200).json(results[0]); // Return the first result (unique task)
//     });
// });




// // Post /task : Creating the new task

// router.post('/',(req,res) =>{
//     const {title , description } = req.body;

//     // Ensure that title is provided

//     if(!title){
//         return res.status(400).json({error : 'Title is required'});
//     }

//     const query = `Insert INTO tasks (title , description) values (? ,? )`;

//     db.execute(query, [title , description || null] , (err,result) => {
//         if(err){
//             return res.status(500).json({error : 'Failed to create task'})
//         }


//         // Return the newly created tasks

//         res.status(201).json({
//             id: result.insertId,
//             title,
//             description,
//             status: 'pending'
//         })
//     })
// });



// // PUT /tasks/:id: Update task status

// router.put('/:id', authenticateToken, (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     // Validate the status
//     const validStatuses = ['pending', 'in-progress', 'completed'];
//     if (!validStatuses.includes(status)) {
//         return res.status(400).json({ error: 'Invalid status. Valid values are: pending, in-progress, completed.' });
//     }

//     const query = `UPDATE tasks SET status = ? WHERE id = ?`;
//     db.execute(query, [status, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to update task status' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         res.status(200).json({ message: 'Task status updated successfully', id, status });
//     });
// });


// // DELETE /tasks/:id: Delete a task by ID (Protected)
// // router.delete('/:id', authenticateToken, (req, res) => {
// //     const { id } = req.params;

// //     const query = `DELETE FROM tasks WHERE id = ?`;
// //     db.execute(query, [id], (err, result) => {
// //         if (err) {
// //             return res.status(500).json({ error: 'Failed to delete task' });
// //         }

// //         if (result.affectedRows === 0) {
// //             return res.status(404).json({ error: 'Task not found' });
// //         }

// //         res.status(200).json({ message: 'Task deleted successfully', id });
// //     });
// // });

// // DELETE /tasks/:id: Delete a task by ID and reassign IDs (Protected)
// router.delete('/:id', authenticateToken, (req, res) => {
//     const { id } = req.params;

//     // Step 1: Delete the task with the given id
//     const deleteQuery = `DELETE FROM tasks WHERE id = ?`;
//     db.execute(deleteQuery, [id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to delete task' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         // Step 2: Reassign the IDs of remaining tasks
//         const reassignQuery = `UPDATE tasks SET id = id - 1 WHERE id > ?`;
//         db.execute(reassignQuery, [id], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Failed to reassign task IDs' });
//             }

//             // Step 3: Respond with success
//             res.status(200).json({ message: 'Task deleted and IDs reassigned successfully', deletedId: id });
//         });
//     });
// });

// module.exports = router;




const express = require('express');
const db = require('../database');
const authenticateToken = require('../Middleware/auth');

const router = express.Router();

// GET /tasks: Fetch all tasks
router.get('/', (req, res) => {
    const query = `SELECT * FROM tasks`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        res.status(200).json(results);
    });
});

// GET /tasks/:id: Fetch a task by its ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM tasks WHERE id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch task' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(results[0]); // Return the first result (unique task)
    });
});

// POST /tasks: Create a new task
router.post('/', (req, res) => {
    const { title, description } = req.body;

    // Ensure that title is provided
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const query = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.execute(query, [title, description || null], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create task' });
        }

        res.status(201).json({
            id: result.insertId,
            title,
            description,
            status: 'pending',
        });
    });
});

// PUT /tasks/:id: Update task status
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid values are: pending, in-progress, completed.' });
    }

    const query = `UPDATE tasks SET status = ? WHERE id = ?`;
    db.execute(query, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update task status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task status updated successfully', id, status });
    });
});

// DELETE /tasks/:id: Delete a task by ID and reassign IDs (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Step 1: Delete the task with the given id
    const deleteQuery = `DELETE FROM tasks WHERE id = ?`;
    db.execute(deleteQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete task' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Step 2: Reassign the IDs of remaining tasks
        const reassignQuery = `UPDATE tasks SET id = id - 1 WHERE id > ?`;
        db.execute(reassignQuery, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to reassign task IDs' });
            }

            // Optional: Reset auto-increment after reassignment (this may need optimization)
            const resetAutoIncrementQuery = `ALTER TABLE tasks AUTO_INCREMENT = 1`;
            db.execute(resetAutoIncrementQuery, (err) => {
                if (err) {
                    console.error('Failed to reset auto-increment');
                }
            });

            res.status(200).json({ message: 'Task deleted and IDs reassigned successfully', deletedId: id });
        });
    });
});

module.exports = router;
