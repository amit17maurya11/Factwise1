import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  EditOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from "@ant-design/icons";
import { Button, Modal, Space,message } from "antd";
const { confirm } = Modal;

function Fact() {
  const [api, setapi] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [editable, setEditable] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setselected] = useState(null);

  const [DeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const toggle = (i) => {
    if (selected == i) {
      return setselected(null);
    }
    setselected(i);
    console.log(i);
  };

  // Input Search Bar
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = api.filter((user) =>
      user.first.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    setSearchTerm(null);
  };

  const handleUserClick = (user) => {
    setSearchTerm(user.first);
  };

  
/// Age calculate//
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  };
  //

  // edit

  const handleEditClick = (item) => {
    setEditable(item.id);
    setEditedData({ ...item });
  };

  // Find the index of the item  edited
  const handleSaveClick = () => {
    const index = api.findIndex((item) => item.id === editable);

    // Update the data array with  edit item
    if (index !== -1) {
      const newData = [...api];
      newData[index] = editedData;
      setFilteredUsers(newData);
      setEditable(null);
    }
  };

  const handleCancelClick = () => {
    setEditable(null);
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  //

  // CLick Delete will delete

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  const handleDeleteClick = () => {
    showDeleteModal()
  };

  //


  const handleDeleteConfirmed = () => {
    // Filter out  the item  edited
    const newData = api.filter((item) => item.id !== editable);
    setFilteredUsers(newData);
    setEditable(null);
    setDeleteModalVisible(false);
  };

  //

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };

  useEffect(() => {
    axios
      .get(`celebrities.json`)
      .then((response) => setapi(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div>
      <h5> Enter some word for List View </h5>
      <input
        className="inputt"
        type="text"
        placeholder="search......."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="wrapper">
        <div className="accordion">
          <div style={{ padding: "20px" }}>
            {filteredUsers.map((item, i) => {
              return (
                <div className="item">
                  <div className="header">
                    <img src={item.picture} />
                    <div
                      className="title"
                      onClick={() => {
                        toggle(i);
                      }}
                    >
                      <h2>
                        {item.first}
                        {item.last}
                      </h2>
                    </div>
                    <CaretDownOutlined
                      onClick={() => {
                        toggle(i);
                      }}
                    />
                  </div>
                  <div className={selected === i ? "content show" : "content"}>
                    <div className="agee">
                      <label>
                        Age
                        <br />
                        {editable === item.id ? (
                          <input
                            type="date"
                            max={1973 - 10 - 16}
                            min={2023 - 11 - 30}
                            placeholder="YYYY-MM-DD"
                            value={editedData.dob || ""}
                            onChange={(e) => handleInputChange(e, "dob")}
                          />
                        ) : (
                          <span> {calculateAge(item.dob)}</span>
                        )}
                      </label>
                      <br />

                      <label>
                        Gender
                        <br/>
                        {editable === item.id ? (
                          <select
                            style={{
                              borderRadius: "5px",
                              border: "2px solid #ddd",
                            }}
                            value={editedData.gender || ""}
                            onChange={(e) => handleInputChange(e, "gender")}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        ) : (
                          <span>{item.gender}</span>
                        )}
                      </label>
                      <br />

                      <label>
                        Country
                        <br/>
                        {editable === item.id ? (
                          <input
                            type="text"
                            value={editedData.country || ""}
                            onChange={(e) => handleInputChange(e, "country")}
                          />
                        ) : (
                          <span>{item.country}</span>
                        )}
                      </label>
                    </div>
                    <br />
                    <label>
                      Description:
                      <br />
                      {editable === item.id ? (
                        <textarea
                          style={{ width: "22vw", height: "30vh" }}
                          type="text"
                          value={editedData.description || ""}
                          onChange={(e) => handleInputChange(e, "description")}
                        />
                      ) : (
                        <span>{item.description}</span>
                      )}
                    </label>

                    <div className="delete">
                      {editable === item.id ? (
                        <>
                          <Button type="dashed">
                            <DeleteIcon
                              fontSize="inherit"
                              style={{ color: "red" }}
                              onClick={handleDeleteClick}
                             
                            />
                          </Button>

                          <Modal
                            title="Confirm Delete"
                            visible={DeleteModalVisible}
                            onOk={handleDeleteConfirmed}
                            onCancel={handleDeleteCancel}
                          >
                            <p>Are you sure you want to delete this item?</p>
                          </Modal>

                          <Button onClick={error}>
                            <CloseCircleFilled
                              onClick={handleCancelClick}
                              style={{
                                color: "#ff5c5c",
                                fontSize: 17,
                                cursor: "pointer",
                              }}
                            />
                          </Button>
                          <Button>
                            <CheckCircleFilled
                              onClick={handleSaveClick}
                              style={{
                                color: "#4ec64e",
                                fontSize: 17,
                                marginLeft: 10,
                                cursor: "pointer",
                              }}
                            />
                          </Button>
                        </>
                      ) : (
                        <Button>
                          <EditOutlined onClick={() => handleEditClick(item)} />
                        </Button>
                      )}
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fact;
