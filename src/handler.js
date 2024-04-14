const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = (book) => book.pageCount === book.readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess1 = books.name.length > 0;
  const isSuccess2 = books.readPage > books.pageCount;

  if (isSuccess1 && isSuccess2) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
  } else if ((isSuccess1 == false) && isSuccess2) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
  } else if ((isSuccess2 == false) && isSuccess1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
  }

  return response;
};

const getAllBooksHandler = (request, h) => {
  const {} = request.payload;
  const response = h.response({
    status: 'success',
    data: books.map(book => ({ 
      id: book.id, 
      name: book.name, 
      publisher: book.publisher})),
  });
  response.code(200);
  return response;
};  

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: books,
    });
    response.code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  
  const finished = (book) => book.pageCount === book.readPage;
  const indexFound = books.findIndex((book) => book.id === id);
  const isSuccess1 = books.name.length > 0;
  const isSuccess2 = books.readPage < books.pageCount;
  const isSuccess3 = indexFound !== -1;

  if (isSuccess1 && isSuccess2 && isSuccess3) {
    books[indexFound] = {
      ...books[indexFound],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      finished,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
  } else if (isSuccess1 == false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
  } else if (isSuccess2 == false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
  } else if (isSuccess3 == false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
  }

  return response;
};

const deleteBookByIdHandler = (request, h) => { 
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};