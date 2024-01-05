import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Avatar, List, Modal, Menu, Dropdown } from 'antd';
import { BellOutlined, DownOutlined } from '@ant-design/icons';

const TopBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [getRows, setRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  // Racine des liens en fonction du rôle
  const linkRoot = isAdmin ? '/admin' : isUserSimple ? '/user' : '';
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        setUser(response.data.user);
        setRows(response.data.count_notif);
        setLoading(false);

        if (response.data.notification) {
          setNotifications(response.data.notification);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNotificationClick = (notificationId) => {
    const clickedNotification = notifications.find(
      (notification) => notification.id_notif === notificationId
    );

    if (clickedNotification) {
      // Implement your notification click logic here

      // Close modal after a certain time
      setTimeout(() => {
        setIsModalVisible(false);
      }, 3000);
    }
  };

  const logoutSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_name');
          swal('Success', res.data.message, 'success');
          navigate('/login');
        } else {
          // Handle other cases if necessary
        }
      })
      .catch(() => {
        // Handle logout request errors here
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to={`${linkRoot}/profile`}>
          <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
          Profile
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to="#">
          <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
          Paramètre
        </NavLink>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <NavLink to="/login" onClick={logoutSubmit}>
          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Se déconnecter
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  let AuthButtons = null;
  if (localStorage.getItem('auth_token')) {
    AuthButtons = (
      <ul className="navbar-nav">
        <li className="nav-item dropdown no-arrow mx-1">
          <div className="nav-link dropdown-toggle" onClick={showModal}>
            <BellOutlined style={{ fontSize: '1.5rem' }} />
            <span className="badge badge-danger badge-counter">{getRows === '0' ? '0' : getRows}</span>
          </div>
        </li>

        <li className="nav-item dropdown no-arrow">
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="nav-link dropdown-toggle" onClick={(e) => e.preventDefault()}>
              <Avatar
                size="large"
                src={`http://localhost:8000/uploads/users/${user.photo_profil}`}
                alt="User Photo"
              />
              <DownOutlined style={{ marginLeft: '8px' }} />
            </div>
          </Dropdown>
        </li>
      </ul>
    );
  } else {
    // ... (rest of the non-authenticated menu)
  }

  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

  const changeStyle1 = () => {
    if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={changeStyle1}>
        <i className="fa fa-bars"></i>
      </button>
      <ul className="navbar-nav ml-auto">
        {AuthButtons}
      </ul>

      <Modal
        title="Notifications"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleNotificationClick(item.id_notif)}
              style={{
                backgroundColor: item.status_notif === 0 ? '#ccffcc' : 'white',
                cursor: 'pointer',
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={`http://localhost:8000/uploads/users/${user.photo_profil}`} />}
                title={<a href="#">{item.title}</a>}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Modal>
    </nav>
  );
};

export default TopBar;
