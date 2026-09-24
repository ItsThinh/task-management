const Task = require("../models/task.model");
const User = require("../models/user.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

const STATUSES = ["initial", "doing", "finish", "pending", "notFinish"];
const KEYS = ["title", "status", "content", "timeStart", "timeFinish", "deleted"];

// [GET] api/v1/tasks
module.exports.index = async (req, res) => {

    const userId = req.user.id;

    const dbQuery = {
        $or: [
            { createdBy: userId },
            { listUserId: userId },
        ],
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

    // Tìm kiếm theo title
    if (req.query.keyword) {
        const searchObject = searchHelper(req.query);
        dbQuery.title = searchObject.regex;
    }
    // End: Tìm kiếm theo title

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
        }).select("title status content timeStart timeFinish").lean();

        res.json(tasks);
    } catch (error) {
        res.json("Không tìm thấy");
    }

}

// [PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            code: 400,
            message: "Không nhận được giá trị cập nhật mới"
        });
    }

    if (!STATUSES.includes(status)) {
        return res.status(400).json({
            code: 400,
            message: "Giá trị cập nhật mới không phù hợp"
        });
    }
    try {

        await Task.updateOne(
            { _id: id },
            { status }
        );

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi hệ thống hoặc id không hợp lệ"
        });
    }
}

// [PATCH] api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    const { ids, key, value } = req.body;

    const updateData = {
        [key]: value
    }

    if (!KEYS.includes(key)) {
        return res.status(400).json({
            code: 400,
            message: "Trường cập nhật không hợp lệ"
        });
    }

    if (key === "status") {
        if (!value) {
            return res.status(400).json({
                code: 400,
                message: "Không nhận được giá trị cập nhật mới"
            });
        }
        if (!STATUSES.includes(value)) {
            return res.status(400).json({
                code: 400,
                message: "Giá trị cập nhật mới không phù hợp"
            });
        }
    }

    if (key === "deleted") {
        const deletedValue = JSON.parse(value);
        if (typeof deletedValue !== "boolean") {
            return res.status(400).json({
                code: 400,
                message: "Giá trị cập nhật mới không phù hợp"
            });
        }

        updateData[key] = deletedValue;

        if (deletedValue == true) {
            updateData.deletedAt = new Date();
        } else {
            updateData.deletedAt = null;
        }
    }

    try {
        await Task.updateMany(
            { _id: { $in: ids } },
            { $set: updateData }
        );

        res.json({
            code: 200,
            message: "Cập nhật thông tin thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi hệ thống hoặc id không hợp lệ"
        });
    }
}

// [POST] api/v1/tasks/create
module.exports.create = async (req, res) => {

    try {
        req.body.createdBy = req.user.id;

        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo không thành công"
        });
    }
}

// [POST] api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.updateOne(
            { _id: id },
            req.body
        )
        res.json({
            code: 200,
            message: "Cập nhật thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật không thành công"
        });
    }
}

// [DELETE] api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        await Task.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedAt: new Date()
            }
        )
        res.json({
            code: 200,
            message: "Xóa thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa không thành công"
        });
    }
}