const Book = require('../models/book');
const fs = require('fs');

exports.all = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.one = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.bestRating = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3).then(books => res.status(200).json(books)).catch(error => res.status(400).json({error}))
};

exports.create = async (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    delete bookObject.ratings;
    const book = new Book({
        ...bookObject,
        ratings: [],
        averageRating: 0,
        imageUrl: req.body.imageUrl,
    });

    book.save().then(() => { res.status(201).json({message: 'Book saved !'})}).catch(error => res.status(400).json({ error }));
};

exports.update = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: req.body.imageUrl
    } : { ...req.body };

    delete bookObject.userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized'})
            } else if (bookObject.imageUrl) {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.updateOne({ _id: book.id }, { ...bookObject })
                    .then(() => res.status(200).json({ message: 'Book updated !'}))
                    .catch(error => res.status(400).json({ error }));
                });
            } else {
                Book.updateOne({ _id: book.id }, { ...bookObject })
                    .then(() => res.status(200).json({ message: 'Book updated !'}))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.delete = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized'})
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: book.id })
                        .then(() => res.status(200).json({ message: 'Book deleted !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.addRating = (req, res) => {
    const rating = {
        userId: req.body.userId,
        grade: req.body.rating
    };

    Book.findOne({ _id: req.params.id }).then(book => {
        book.ratings.push(rating);
        book.averageRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length;
        book.save().then(book => res.status(201).json(book)).catch(error => res.status(400).json({ error }));
    }).catch(error => res.status(404).json({ error }));
};