import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Upload } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileFile, setFileFile] = useState(null);

  const handleFileChange = (fieldName, file, setFile) => {
    setFile(file);
  };

  const registerSubmit = async (values) => {
    try {
      // Fetch CSRF token
      const csrfResponse = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');


        // Set CSRF token in headers for subsequent requests
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfResponse.data.csrf_token;

        // Prepare data for registration
        const data = {
          name: values.name,
          email: values.email,
          password: values.password,
          role_user: values.role_user,
          photo_profil: fileFile?.originFileObj,
        };

        // Create FormData and append data
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }

        // Send registration request
        const res = await axios.post('http://127.0.0.1:8000/api/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.status === 200) {
          message.success(res.data.message);
          navigate('/admin');
        } else {
          form.setFields([{ name: 'error_list', errors: [res.data.validation_errors] }]);
        }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Register</h4>
              </div>
              <div className="card-body">
                <Form form={form} onFinish={registerSubmit} encType="multipart/form-data">
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Role User"
                    name="role_user"
                    rules={[{ required: true, message: 'Please input your role user' }]}
                  >
                    <Input prefix={<UsergroupAddOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Photo de profil"
                    name="photo_profil"
                    rules={[{ required: true, message: "Le fichier du cours est requis" }]}
                  >
                    <Upload
                      onChange={(info) => handleFileChange("fileFile", info.file, setFileFile)}
                    >
                      <Button>Uploader Fichier</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
