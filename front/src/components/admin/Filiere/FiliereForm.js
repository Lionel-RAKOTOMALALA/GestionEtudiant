import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router';

const FiliereForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const registerFiliere = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = {
          nom_filiere: values.nom_filiere,
        };

        const res = await fetch('http://127.0.0.1:8000/api/filieres', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.status === 200) {
          message.success(result.message);
          navigate('/user/filieres');
        } else {
          form.setFields([{ name: 'nom_filiere', errors: [result.validation_errors.nom_filiere] }]);
        }
      } else {
        message.error('Failed to set CSRF cookie.');
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
                <h4>Ajouter une filière</h4>
              </div>
              <div className="card-body">
                <Form form={form} onFinish={registerFiliere}>
                  <Form.Item
                    label="Nom de la filière"
                    name="nom_filiere"
                    rules={[{ required: true, message: 'Le nom de la filière est requis' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Ajouter
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

export default FiliereForm;
  