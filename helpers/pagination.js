module.exports = (query) => {
    const itemsPerPage = query.limit ? parseInt(query.limit) : 20;
    const currentPage = query.page ? parseInt(query.page) : 1;
    const initialIndex = itemsPerPage * (currentPage - 1);
    return {
        skip: initialIndex,
        limit: itemsPerPage
    };
}