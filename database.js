// database.js
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("student.db");

// Initialize the database
const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, address TEXT NOT NULL, birthdate TEXT NOT NULL, year INTEGER NOT NULL, section TEXT NOT NULL);"
    );
  });
};

// Insert a new student
const insertStudent = (name, address, birthdate, year, section, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO students (name, address, birthdate, year, section) VALUES (?, ?, ?, ?, ?);",
      [name, address, birthdate, year, section],
      (_, result) => callback && callback(result)
    );
  });
};

// Fetch all students
const fetchStudents = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM students;",
      [],
      (_, { rows: { _array } }) => callback && callback(_array)
    );
  });
};

// Update a student
const updateStudent = (
  id,
  name,
  address,
  birthdate,
  year,
  section,
  callback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE students SET name = ?, address = ?, birthdate = ?, year = ?, section = ? WHERE id = ?;",
      [name, address, birthdate, year, section, id],
      (_, result) => callback && callback(result)
    );
  });
};

// Delete a student
const deleteStudent = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM students WHERE id = ?;",
      [id],
      (_, result) => callback && callback(result)
    );
  });
};

export { initDB, insertStudent, fetchStudents, updateStudent, deleteStudent };
