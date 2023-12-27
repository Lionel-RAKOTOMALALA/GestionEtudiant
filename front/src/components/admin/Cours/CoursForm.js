import React, { useEffect, useState } from "react";
import { Button, Card, Input, Form, Select, message, Typography, Space, Upload } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const CoursForm = () => {
  const [UniteList, setUniteList] = useState([]);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [fileFile, setFileFile] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [CoursInput, setCoursInput] = useState({
    libelle: "",
    id_unite: "",
    niveau_cours: "",
    error_list: {},
  });

  const handleFileChange = (name, file, setFileFunction) => {
    if (file.status === "done" || file.status === "error") {
      setFileFunction(file.originFileObj);
    }
  };

  const handleVideoChange = (info) => {
    const newVideoFiles = Array.from(info.fileList.map(file => file.originFileObj));
    setVideoFiles(newVideoFiles);
  };

  const resetForm = () => {
    form.resetFields();
    setImageFile(null);
    setFileFile(null);
    setVideoFiles([]);
  };

  const submitCours = async () => {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("libelle", CoursInput.libelle);
      formData.append("niveau_cours", CoursInput.niveau_cours);
      formData.append("image_cours", imageFile);
      formData.append("fichier_cours", fileFile);

      // Append multiple video files
      videoFiles.forEach((videoFile, index) => {
        formData.append(`video_cours[]`, videoFile);
      });

      formData.append("id_unite", CoursInput.id_unite);

      const response = await axios.post("http://127.0.0.1:8000/api/cours", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 200) {
        message.success(response.data.message);
        resetForm();
      } else if (response.data.status === 400) {
        setCoursInput({
          ...CoursInput,
          error_list: response.data.error_list,
        });
        message.error(response.data.error_list);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUnites = await axios.get("http://127.0.0.1:8000/api/uniteEnseigns");
        if (resUnites.data.status === 200) {
          setUniteList(resUnites.data.unites);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInput = (name, value) => {
    setCoursInput({
      ...CoursInput,
      [name]: value,
    });
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card>
        <Typography.Title level={4}>Ajouter un cours</Typography.Title>
        <Form
          form={form}
          onFinish={submitCours}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          encType="multipart/form-data"
        >
          <Form.Item
            label="Libellé du cours"
            name="libelle"
            rules={[{ required: true, message: "Le libellé est requis" }]}
          >
            <Input onChange={(e) => handleInput("libelle", e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Niveau du cours"
            name="niveau_cours"
            rules={[
              { required: true, message: "Le niveau du cours est requis" },
            ]}
          >
            <Select
              placeholder="Sélectionner le niveau du cours"
              onChange={(value) => handleInput("niveau_cours", value)}
            >
              <Option value="L1">L1</Option>
              <Option value="L2">L2</Option>
              <Option value="L3">L3</Option>
              <Option value="M1">M1</Option>
              <Option value="M2">M2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Image du cours"
            name="image_cours"
            rules={[{ required: true, message: "L'image du cours est requise" }]}
          >
            <Upload
              onChange={(info) => handleFileChange("imageFile", info.file, setImageFile)}
            >
              <Button>Uploader Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Fichier du cours"
            name="fichier_cours"
            rules={[{ required: true, message: "Le fichier du cours est requis" }]}
          >
            <Upload
              onChange={(info) => handleFileChange("fileFile", info.file, setFileFile)}
            >
              <Button>Uploader Fichier</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Vidéo du cours"
            name="video_cours"
            rules={[{ required: true, message: "La vidéo du cours est requise" }]}
          >
            <Upload
              onChange={(info) => handleVideoChange(info)}
              beforeUpload={() => false}
              multiple
            >
              <Button>Uploader Vidéo</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Unité d'enseignement"
            name="id_unite"
            rules={[
              { required: true, message: "L'unité d'enseignement est requise" },
            ]}
          >
            <Select placeholder="Sélectionner l'unité d'enseignement" onChange={(value) => handleInput("id_unite", value)}>
              {UniteList.map((unite) => (
                <Option key={unite.id_unite} value={unite.id_unite}>
                  {unite.nom_unite}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
              >
                Ajouter
              </Button>
              <NavLink to="/user/Cours">
                <Button type="default" icon={<CloseCircleOutlined />}>
                  Annuler
                </Button>
              </NavLink>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default CoursForm;
