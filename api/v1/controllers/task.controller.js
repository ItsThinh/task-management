const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");

// [GET] api/v1/tasks
module.exports.index = async (req, res) => {

    const dbQuery = {
        deleted: false
    };

    // Tìm theo id, title hoặc status
    if (req.query._id) {
        dbQuery._id = req.query._id;
    }
    if (req.query.title) {
        dbQuery.title = req.query.title;
    }
    if (req.query.status) {
        dbQuery.status = req.query.status;
    }
    // End: Tìm theo id, title hoặc status

    // Sắp xếp hiển thị
    const sort = {};
    if (req.query.keyValue && req.query.sortValue) {
        sort[req.query.keyValue] = req.query.sortValue;
    }
    // End: Sắp xếp hiển thị

    // Pagination
    const paginationObject = paginationHelper(req.query);
    // End: Pagination


    const tasks = await Task.find(dbQuery)
        .select("title status timeStart timeEnd")
        .lean()
        .sort(sort)
        .skip(paginationObject.skip)
        .limit(paginationObject.limit);

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
