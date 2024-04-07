import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  initDB,
  insertStudent,
  fetchStudents,
  updateStudent,
  deleteStudent,
} from "./database";

const App = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  useEffect(() => {
    initDB();
    refreshStudents();
  }, []);

  const refreshStudents = () => {
    fetchStudents(setStudents);
  };

  const handleAddStudent = () => {
    if (!name || !address || !birthdate || !year || !section) {
      alert("Please fill out all fields.");
      return;
    }
    insertStudent(name, address, birthdate, parseInt(year), section, () => {
      setName("");
      setAddress("");
      setBirthdate("");
      setYear("");
      setSection("");
      refreshStudents();
    });
  };

  const handleEditStudent = (student) => {
    setName(student.name);
    setAddress(student.address);
    setBirthdate(student.birthdate);
    setYear(student.year.toString()); // Ensure year is a string for the TextInput
    setSection(student.section);
    setEditingStudentId(student.id);
    setIsEditing(true);
  };

  const handleDeleteStudent = (id) => {
    deleteStudent(id, refreshStudents);
  };

  // Update the renderItem function
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text
        style={styles.itemText}
      >{`${item.name}, ${item.address}, Born: ${item.birthdate}, Year: ${item.year}, Section: ${item.section}`}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => handleEditStudent(item)}
          style={styles.editButton}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteStudent(item.id)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleUpdateStudent = () => {
    if (!name || !address || !birthdate || !year || !section) {
      alert("Please fill out all fields.");
      return;
    }
    updateStudent(
      editingStudentId,
      name,
      address,
      birthdate,
      parseInt(year),
      section,
      () => {
        // Reset the form and state
        resetForm();
        refreshStudents();
      }
    );
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setBirthdate("");
    setYear("");
    setSection("");
    setIsEditing(false);
    setEditingStudentId(null);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Student Information
      </Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Birthdate (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
        style={styles.input}
      />
      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Section"
        value={section}
        onChangeText={setSection}
        style={styles.input}
      />

      {isEditing ? (
        <Button title="Update Student" onPress={handleUpdateStudent} />
      ) : (
        <Button title="Add Student" onPress={handleAddStudent} />
      )}

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  itemText: {
    maxWidth: "65%",
  },
  deleteButtonText: {
    color: "#fff",
  },
  editButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
  },
});

export default App;
