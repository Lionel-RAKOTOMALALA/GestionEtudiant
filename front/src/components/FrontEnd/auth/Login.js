import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import TopBar from '../../admin/TopBar';

import coursBackground from '../../assets/cours.jpg';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loginInput, setLogin] = useState({
    name: '',
    password: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setLogin({ ...loginInput, [e.target.name]: e.target.value });
  };

  const loginSubmit = (values) => {
    const data = {
      name: values.name,
      password: values.password,
    };

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then((response) => {
      axios.post(`http://127.0.0.1:8000/api/login`, data).then((res) => {
        if (res.data.status === 200) {
          alert(res.data.token);
          const user = JSON.stringify(res.data.user);
          localStorage.setItem('user', user);
          console.log(localStorage.getItem('user'));
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('professeur_count', res.data.professeur_count);
          swal('Success', res.data.message, 'success');
          if (res.data.role === 'admin') {
            navigate('/admin');
          } else if (res.data.role === 'userSimple') {
            navigate('/user');
          }
        } else if (res.data.status === 401) {
          swal('Avertissement', res.data.message, 'warning');
        } else {
          // Gestion des erreurs de validation
          setLogin({ ...loginInput, error_list: res.data.validation_errors });
        }
      });
    });
  };

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: `url(${coursBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TopBar />
      <Card
        style={{
          width: '500px',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Authentification
        </Title>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={loginSubmit}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                type: 'text',
                message: 'Please enter your Name!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              onChange={handleInput}
              value={loginInput.name}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              onChange={handleInput}
              value={loginInput.password}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
