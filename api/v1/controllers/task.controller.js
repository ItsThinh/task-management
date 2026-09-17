const Task = require("../models/task.model");

// [GET] api/v1/tasks
module.exports.index = async (req, res) => {
    const { taskId: _id, taskTitle: title, taskStatus: status } = req.query;

    const dbQuery = {
        deleted: false
    };

    if (req.query._id) {
        dbQuery._id = req.query._id;
    }
    if (req.query.title) {
        dbQuery.title = req.query.title;
    }
    if (req.query.status) {
        dbQuery.status = req.query.status;
    }

    const tasks = await Task.find(dbQuery).select("title status timeStart timeEnd").lean();

    res.json(tasks);
}

// [GET] api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const tasks = await Task.findOne({
            _id: req.params.id,
            deleted: false
        }).select("title status timeStart timeEnd").lean();

        res.json(tasks);
    } catch (error) {
        res.json("Không tìm thấy");
    }

}
