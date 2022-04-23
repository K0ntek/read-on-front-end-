const Book = require("../models/book");
const Tag = require("../models/tag");

function ensureArray(arg) {
    if (Array.isArray(arg)) {
        return arg;
    } else {
        return [arg];
    }
}

const get_index = (req, res, next) => {
    Book.find()
        .sort({ title: 1 })
        .limit(12)
        .then((result) => {
            Tag.find()
                .sort({ name: 1 })
                .then((resultTags) => res.render("index", { books: result, tags: resultTags }))
                .catch((err) => res.render("404", { err }));
        })
        .catch((err) => res.render("404", { err }));
};

const post_books = (req, res) => {
    if (req.body.tags != null) {
        res.redirect(`/books?q=${req.body.title}&tags=${ensureArray(req.body.tags).join(",")}`);
    } else {
        res.redirect(`/books?q=${req.body.title}&tags=none`);
    }
};

const get_books_title = (req, res) => {
    const reg = new RegExp(req.query.q, "i");
    const tags = req.query.tags.split(",");

    let query = {
        $or: [{ title: { $in: reg } }, { author: { $in: reg } }],
        tags: { $in: tags },
    };

    if (req.query.tags == "none") {
        query = {
            $or: [{ title: { $in: reg } }, { author: { $in: reg } }]
        };
    }

    Book.find(query)
        .sort({ title: 1 })
        .limit(12)
        .then((result) => {
            Tag.find()
                .sort({ name: 1 })
                .then((resultTags) => res.render("index", { books: result, tags: resultTags, query: req.query.q }))
                .catch((err) => res.render("404", { err }));
        })
        .catch((err) => res.render("404", { err }));
};

const get_book_id = (req, res) => {
    Book.findById(req.params.id).then((result) => res.render("book", { book: result }));
};

module.exports = {
    get_index,
    post_books,
    get_books_title,
    get_book_id,
};
